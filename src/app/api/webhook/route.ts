import { and, eq, not, isNotNull } from "drizzle-orm";
import {
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent // Added for transcription URL support - handles transcription ready webhooks
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings, guests } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { sendMeetingLinksEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";


function verifySignatureWithSDK(body: string, signature: string): boolean{
      return streamVideo.verifyWebhook(body, signature);

};
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      {
        error: "Missing signature or API key",
        status: 400
      }
    );
  }


const body = await req.text();

if (!verifySignatureWithSDK(body, signature)) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}

let payload: unknown;
try {
  payload = JSON.parse(body) as Record<string, unknown>;
} catch {
  return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
}

const eventType = (payload as Record<string, unknown>)?.type;

if (eventType === "call.session_started") {
  const event = payload as CallSessionStartedEvent;
  const meetingId = event.call.custom?.meetingId;

  if (!meetingId) {
    return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
  }


const [existingMeeting] = await db
  .select()
  .from(meetings)
  .where(
    and(
      eq(meetings.id, meetingId),
      not(eq(meetings.status, "completed")),
      not(eq(meetings.status, "active")),
      not(eq(meetings.status, "cancelled")),
      not(eq(meetings.status, "processing"))
    )
  );
  if (!existingMeeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }
  await db
  .update(meetings)
  .set({
    status: "active",
    startTime: new Date(),
  })
  .where(eq(meetings.id, existingMeeting.id));

const [existingAgent] = await db
  .select()
  .from(agents)
  .where(eq(agents.id, existingMeeting.agentId));


  if(!existingAgent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const call = streamVideo.video.call("default", meetingId);

  // Recording is now started when meeting is created, not in webhook

  // Recording is now started when meeting is created, not in webhook
  // Note: For proper web integration with Stream, we'll use Vapi's web SDK
  // in the client-side meeting component instead of server-side API calls
  // This allows the AI to join as a web participant
  console.log('Meeting started with agent:', existingAgent.id, '- Vapi integration ready for client-side');



}
else if (eventType === "call.session_participant_left") {
  const event = payload as CallSessionParticipantLeftEvent;
  const callCid = event.call_cid;
  console.log('Received call.session_participant_left event for call:', callCid);

  // Extract meeting ID from call_cid (format: "call_type:call_id")
  const callId = callCid?.split(":")[1];
  if (!callId) {
    console.log('Could not extract call ID from call_cid:', callCid);
    return NextResponse.json({ error: "Invalid call_cid format" }, { status: 400 });
  }

  console.log('Extracted call ID:', callId);

  // Find meeting by ID (call ID should match meeting ID)
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, callId));

  if (!meeting) {
    console.log('No meeting found for call ID:', callId);
    return NextResponse.json({ error: "Meeting not found for call" }, { status: 404 });
  }

  console.log('Found meeting:', meeting.id, 'current status:', meeting.status);

  // Get participant info to determine if it's the host leaving
  const participant = event.participant;
  const isHostLeaving = participant?.user?.id === meeting.userId;

  console.log('Participant leaving:', participant?.user?.id, 'Host user ID:', meeting.userId, 'Is host leaving:', isHostLeaving);

  // Only end the meeting if the host is leaving and meeting is still active
  if (isHostLeaving && meeting.status === 'active') {
    await db
      .update(meetings)
      .set({
        status: "completed",
        endTime: new Date(),
      })
      .where(eq(meetings.id, meeting.id));

    console.log('Updated meeting status to completed because host left:', meeting.id);
  } else if (!isHostLeaving) {
    console.log('Guest left meeting, not ending the meeting. Participant:', participant?.user?.id);
  } else {
    console.log('Meeting already has status:', meeting.status, '- not updating');
  }

  // Note: Don't call call.end() here as it might cause issues
  // The call is already ending due to participant leaving
}
else if (eventType === "call.recording_ready") {
  // console.log('🔴 RECEIVED call.recording_ready event - FULL PAYLOAD:', JSON.stringify(payload, null, 2));

  const event = payload as any; // Using any due to uncertain event structure
  const callId = event.call_cid?.split(":")[1]; // Extract meeting ID from call_cid

  if (!callId) {
    // console.log('❌ No call ID in recording event - full event:', event);
    return NextResponse.json({ error: "Missing call ID in recording event" }, { status: 400 });
  }

  // console.log('📞 Extracted call ID from recording event:', callId);

  // Find the meeting by call ID (assuming call ID matches meeting ID)
  let [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, callId));

  // If not found, try to find any recent meeting that might match (fallback for ID mismatches)
  if (!meeting) {
    // console.log('❌ Meeting not found for call ID:', callId, '- trying fallback search...');

    // Look for meetings that ended recently and might be waiting for recording
    const recentMeetings = await db
      .select()
      .from(meetings)
      .where(eq(meetings.status, 'completed'))
      .orderBy(meetings.endTime)
      .limit(5);

    // console.log('Recent completed meetings:', recentMeetings.map(m => ({ id: m.id, endTime: m.endTime })));

    // If there's only one recent meeting, assume it's the one
    if (recentMeetings.length === 1) {
      meeting = recentMeetings[0];
      // console.log('✅ Using fallback meeting:', meeting.id);
    } else {
      // console.log('❌ Multiple or no recent meetings found, cannot determine which meeting this recording belongs to');
      return NextResponse.json({ error: "Cannot match recording to meeting" }, { status: 400 });
    }
  }

  // console.log('✅ Found meeting for recording:', meeting.id, 'current status:', meeting.status);

  // Update the meeting with the recording URL
  // Try different possible property paths for the recording URL
  const recordingUrl = event.call_recording?.url || event.recording?.url || event.url || event.recording_url || event.recording?.mp4_url;

  // console.log('🔍 Recording URL extraction attempt:');
  // console.log('  - event.call_recording?.url:', event.call_recording?.url);
  // console.log('  - event.recording?.url:', event.recording?.url);
  // console.log('  - event.url:', event.url);
  // console.log('  - event.recording_url:', event.recording_url);
  // console.log('  - event.recording?.mp4_url:', event.recording?.mp4_url);
  // console.log('  - Final URL:', recordingUrl);

  if (!recordingUrl || recordingUrl === '.' || recordingUrl.trim() === '') {
    // console.log('❌ Invalid recording URL - URL is empty, dot, or whitespace. Full event:', JSON.stringify(event, null, 2));
    return NextResponse.json({ error: "Invalid recording URL in event" }, { status: 400 });
  }

  // console.log('✅ Valid recording URL found, updating database...');

  await db
    .update(meetings)
    .set({
      recordingUrl: recordingUrl,
      status: "completed",
      endTime: new Date(),
    })
    .where(eq(meetings.id, meeting.id));

  // console.log('🎉 Successfully updated meeting with recording - ID:', meeting.id, 'URL:', recordingUrl);

  // Verify the update
  const [updatedMeeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meeting.id));

  // console.log('🔍 Verification - Updated meeting status:', updatedMeeting?.status, 'recordingUrl:', updatedMeeting?.recordingUrl);

  // Check if both recording and transcript are ready, then send emails to guests
  if (updatedMeeting?.recordingUrl && updatedMeeting?.transcriptUrl) {
    await sendMeetingLinksToGuests(meeting.id);
  }
}
// Added transcription URL support - handles call.transcription_ready webhooks to store transcription URLs
// This ensures meetings can retrieve transcribed text via the stored URL
else if (eventType === "call.transcription_ready") {
  // console.log('🔴 RECEIVED call.transcription_ready event - FULL PAYLOAD:', JSON.stringify(payload, null, 2));

  const event = payload as any; // Using any due to uncertain event structure
  const callId = event.call_cid?.split(":")[1]; // Extract meeting ID from call_cid

  if (!callId) {
    // console.log('❌ No call ID in transcription event - full event:', event);
    return NextResponse.json({ error: "Missing call ID in transcription event" }, { status: 400 });
  }

  // console.log('📞 Extracted call ID from transcription event:', callId);

  // Find the meeting by call ID (assuming call ID matches meeting ID)
  let [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, callId));

  // If not found, try to find any recent meeting that might match (fallback for ID mismatches)
  if (!meeting) {
    // console.log('❌ Meeting not found for call ID:', callId, '- trying fallback search...');

    // Look for meetings that ended recently and might be waiting for transcription
    const recentMeetings = await db
      .select()
      .from(meetings)
      .where(eq(meetings.status, 'completed'))
      .orderBy(meetings.endTime)
      .limit(5);

    // console.log('Recent completed meetings:', recentMeetings.map(m => ({ id: m.id, endTime: m.endTime })));

    // If there's only one recent meeting, assume it's the one
    if (recentMeetings.length === 1) {
      meeting = recentMeetings[0];
      // console.log('✅ Using fallback meeting:', meeting.id);
    } else {
      // console.log('❌ Multiple or no recent meetings found, cannot determine which meeting this transcription belongs to');
      return NextResponse.json({ error: "Cannot match transcription to meeting" }, { status: 400 });
    }
  }

  // console.log('✅ Found meeting for transcription:', meeting.id, 'current status:', meeting.status);

  // Update the meeting with the transcription URL
  // Try different possible property paths for the transcription URL (similar to recording)
  const transcriptionUrl = event.call_transcription?.url || event.transcription?.url || event.url || event.transcription_url;

  // console.log('🔍 Transcription URL extraction attempt:');
  // console.log('  - event.call_transcription?.url:', event.call_transcription?.url);
  // console.log('  - event.transcription?.url:', event.transcription?.url);
  // console.log('  - event.url:', event.url);
  // console.log('  - event.transcription_url:', event.transcription_url);
  // console.log('  - Final URL:', transcriptionUrl);

  if (!transcriptionUrl || transcriptionUrl === '.' || transcriptionUrl.trim() === '') {
    // console.log('❌ Invalid transcription URL - URL is empty, dot, or whitespace. Full event:', JSON.stringify(event, null, 2));
    return NextResponse.json({ error: "Invalid transcription URL in event" }, { status: 400 });
  }

  // console.log('✅ Valid transcription URL found, updating database...');

  // Log additional details about the transcription URL for debugging
  // console.log('📄 Transcription URL details:');
  // console.log('  - URL starts with:', transcriptionUrl.substring(0, 50) + '...');
  // console.log('  - URL length:', transcriptionUrl.length);
  // console.log('  - Is HTTPS:', transcriptionUrl.startsWith('https://'));

  await db
    .update(meetings)
    .set({
      transcriptUrl: transcriptionUrl,
    })
    .where(eq(meetings.id, meeting.id));

  // console.log('🎉 Successfully updated meeting with transcription - ID:', meeting.id, 'URL:', transcriptionUrl);

  // Verify the update
  const [updatedMeeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meeting.id));

  // console.log('🔍 Verification - Updated meeting transcriptUrl:', updatedMeeting?.transcriptUrl);

  // Check if both recording and transcript are ready, then send emails to guests
  if (updatedMeeting?.recordingUrl && updatedMeeting?.transcriptUrl) {
    await sendMeetingLinksToGuests(meeting.id);
  }
}

// Helper function to send meeting links to guests
async function sendMeetingLinksToGuests(meetingId: string) {
  try {
    // Get meeting with all necessary data
    const [meeting] = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        recordingUrl: meetings.recordingUrl,
        transcriptUrl: meetings.transcriptUrl,
        summary: meetings.summary,
        userId: meetings.userId,
      })
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!meeting) {
      // console.log('Meeting not found for sending emails:', meetingId);
      return;
    }

    // Check if both URLs are available
    if (!meeting.recordingUrl || !meeting.transcriptUrl) {
      // console.log('Not all URLs available yet for meeting:', meetingId);
      return;
    }

    // Get guests with emails
    const meetingGuests = await db
      .select()
      .from(guests)
      .where(and(eq(guests.meetingId, meetingId), isNotNull(guests.email)));

    if (meetingGuests.length === 0) {
      // console.log('No guests with emails found for meeting:', meetingId);
      return;
    }

    // Get host name
    const [host] = await db
      .select({ name: agents.name })
      .from(agents)
      .where(eq(agents.userId, meeting.userId))
      .limit(1);

    // Send emails to all guests
    const emailPromises = meetingGuests.map(guest =>
      sendMeetingLinksEmail(guest.email!, {
        guestName: guest.name,
        meetingName: meeting.name,
        summaryText: meeting.summary || undefined,
        recordingUrl: meeting.recordingUrl!,
        hostName: host?.name,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // console.log(`Email sending completed for meeting ${meetingId}: ${successful} successful, ${failed} failed`);
  } catch (error) {
    console.error('Error sending meeting links to guests:', error);
  }
}


return NextResponse.json({ status: "ok" });


}