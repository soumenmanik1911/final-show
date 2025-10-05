import { Suspense } from 'react';
import { MeetingSummary } from '@/components/meeting-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MeetMeLogo } from '@/components/logo';

interface PageProps {
  params: Promise<{ meetingId: string }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { meetingId } = await params;

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