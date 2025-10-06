import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Get the meeting data for guests
    const [meeting] = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        recordingUrl: meetings.recordingUrl,
        transcriptUrl: meetings.transcriptUrl,
        status: meetings.status,
        summary: meetings.summary,
      })
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    // Return the meeting data
    return NextResponse.json({
      id: meeting.id,
      name: meeting.name,
      recordingUrl: meeting.recordingUrl,
      status: meeting.status,
      summary: meeting.summary ? JSON.parse(meeting.summary) : null,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Error fetching guest meeting data:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}