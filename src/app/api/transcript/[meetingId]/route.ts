import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

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

    // Get the meeting with transcript URL and summary
    const [meeting] = await db
      .select({
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

    if (!meeting.transcriptUrl) {
      return NextResponse.json(
        { error: "Transcript not available yet. The meeting may still be processing." },
        { status: 404 }
      );
    }

    // Check if summary already exists
    if (meeting.summary) {
      console.log(`Returning existing summary for meeting ${meetingId}`);
      return new NextResponse(meeting.summary, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }

    console.log(`Fetching transcript for meeting ${meetingId} from URL: ${meeting.transcriptUrl.substring(0, 100)}...`);

    // Fetch the transcription content from the URL
    const response = await fetch(meeting.transcriptUrl);

    if (!response.ok) {
      console.error(`Failed to fetch transcript for meeting ${meetingId}:`, response.status, response.statusText);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json(
        { error: "Failed to fetch transcript content from external service" },
        { status: 500 }
      );
    }

    const content = await response.text();

    console.log(`Successfully fetched transcript for meeting ${meetingId}, content length: ${content.length}`);

    // Generate summary using Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Summarize the following meeting transcript in a concise manner:\n\n${content}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const summary = response.text;

      // Store the summary in the database
      await db.update(meetings).set({ summary }).where(eq(meetings.id, meetingId));

      console.log(`Generated and stored summary for meeting ${meetingId}`);

      // Return the summary
      return new NextResponse(summary, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } catch (error) {
      console.error('Error generating summary with Gemini:', error);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}