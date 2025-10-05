import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check if Vapi is configured
    if (!process.env.VAPI_API_KEY || !process.env.VAPI_ASSISTANT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Vapi not configured. Please set VAPI_API_KEY and VAPI_ASSISTANT_ID in .env'
      }, { status: 500 });
    }

    // Test API connection by fetching the assistant
    const response = await fetch(`https://api.vapi.ai/assistant/${process.env.VAPI_ASSISTANT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vapi API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: 'Vapi API connection successful',
      assistant: {
        id: data.id,
        name: data.name,
        model: data.model,
        voice: data.voice,
      }
    });
  } catch (error) {
    console.error('Vapi test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}