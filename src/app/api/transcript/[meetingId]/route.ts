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
      try {
        const data = JSON.parse(meeting.summary);
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          },
        });
      } catch {
        // Fallback for old text summaries
        return NextResponse.json({ summary: meeting.summary, qa: [] }, {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
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

    // Generate summary and Q&A using Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Analyze the following meeting transcript and provide:
1. A concise summary
2. 3-5 key questions and answers derived from the transcript

Format your response as:
Summary: [summary text]

Q&A:
Q1: [question]
A1: [answer]
Q2: [question]
A2: [answer]
...

Transcript: ${content}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const rawText = response.text;

      if (!rawText) {
        throw new Error('No response from Gemini');
      }

      // Parse the response
      const parts = rawText.split('\n\nQ&A:');
      const summary = parts[0].replace('Summary:', '').trim();

      const qaSection = parts[1] || '';
      const qaLines = qaSection.split('\n').filter(line => line.trim());
      const qa = [];
      for (let i = 0; i < qaLines.length; i += 2) {
        const qLine = qaLines[i];
        const aLine = qaLines[i + 1];
        if (qLine?.startsWith('Q') && aLine?.startsWith('A')) {
          const question = qLine.replace(/^Q\d+:\s*/, '').trim();
          const answer = aLine.replace(/^A\d+:\s*/, '').trim();
          if (question && answer) {
            qa.push({ question, answer });
          }
        }
      }

      const data = { summary, qa };

      // Store the data in the database as JSON
      await db.update(meetings).set({ summary: JSON.stringify(data) }).where(eq(meetings.id, meetingId));

      console.log(`Generated and stored summary with Q&A for meeting ${meetingId}`);

      // Return the data
      return NextResponse.json(data, {
        headers: {
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