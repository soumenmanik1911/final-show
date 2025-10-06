'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Play } from 'lucide-react';
import { MeetMeLogo } from '@/components/logo';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ meetingId: string }>;
}

export default function GuestSummaryPage({ params }: PageProps) {
  const [meetingId, setMeetingId] = useState<string>('');
  const [meetingData, setMeetingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ meetingId: id }) => {
      setMeetingId(id);
      fetchMeetingData(id);
    });
  }, [params]);

  const fetchMeetingData = async (id: string) => {
    try {
      const response = await fetch(`/api/guest-meeting/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meeting data');
      }
      const data = await response.json();
      setMeetingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-full max-w-md mx-auto"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !meetingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <p className="text-destructive">Error: {error || 'Meeting not found'}</p>
                <Link href="/">
                  <Button className="mt-4">Back to Home</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <MeetMeLogo className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MeetMe
              </h1>
              <p className="text-sm text-muted-foreground">AI-Powered Meeting Insights</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Meeting ID */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Meeting ID:</span>
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{meetingData.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recording Download */}
        {meetingData.recordingUrl ? (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="size-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Meeting Recording</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Download your meeting recording
                    </p>
                  </div>
                </div>
                <Link href={meetingData.recordingUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Play className="size-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Recording Processing</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Your meeting recording is being processed and will be available soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {meetingData.summary ? (
          <div className="space-y-6">
            {/* AI Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">AI-Generated Summary</span>
              </div>
            </div>

            {/* Summary Content */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Meeting Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                    {meetingData.summary.summary}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Q&A Section */}
            {meetingData.summary.qa && meetingData.summary.qa.length > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="w-5 h-5 text-primary">Q&A</span>
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Questions & Answers
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meetingData.summary.qa.map((item: any, index: number) => (
                      <details
                        key={index}
                        className="group border border-border rounded-lg bg-card hover:bg-accent/50 transition-all duration-200"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-accent/30 transition-colors">
                          <span className="font-medium text-sm pr-4">{item.question}</span>
                          <span className="text-muted-foreground text-sm group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
                        </summary>
                        <div className="px-4 pb-4 border-t border-border/50">
                          <p className="text-muted-foreground text-sm leading-relaxed pt-3">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center gap-2 p-6">
              <span className="text-muted-foreground">Summary is being generated...</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}