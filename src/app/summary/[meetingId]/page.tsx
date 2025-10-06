import { Suspense } from 'react';
import { MeetingSummary } from '@/components/meeting-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MeetMeLogo } from '@/components/logo';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface PageProps {
  params: Promise<{ meetingId: string }>;
}

async function getMeetingData(meetingId: string) {
  const [meeting] = await db
    .select({
      id: meetings.id,
      name: meetings.name,
      recordingUrl: meetings.recordingUrl,
      status: meetings.status,
    })
    .from(meetings)
    .where(eq(meetings.id, meetingId));

  return meeting;
}

export default async function SummaryPage({ params }: PageProps) {
  const { meetingId } = await params;
  const meetingData = await getMeetingData(meetingId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Logo and Navigation */}
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
          <Link href={`/meetings/${meetingId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Meeting
            </Button>
          </Link>
        </div>

        {/* Meeting ID */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Meeting ID:</span>
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{meetingData?.id || meetingId}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recording Download */}
        {meetingData?.recordingUrl ? (
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
                <Link href={meetingData.recordingUrl!} target="_blank" rel="noopener noreferrer">
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

        {/* Page Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Meeting Summary
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-generated summary and interactive Q&A derived from your meeting transcript
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-4"></div>
        </div>

      <Suspense fallback={
        <Card>
          <CardHeader>
            <CardTitle>Loading Summary...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      }>
        <MeetingSummary meetingId={meetingId} />
      </Suspense>
      </div>
    </div>
  );
}