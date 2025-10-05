'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronDown, FileText, MessageSquare, Sparkles } from 'lucide-react';

interface QAItem {
  question: string;
  answer: string;
}

interface SummaryData {
  summary: string;
  qa: QAItem[];
}

interface MeetingSummaryProps {
  meetingId: string;
}

export function MeetingSummary({ meetingId }: MeetingSummaryProps) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/transcript/${meetingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        const summaryData = await response.json();
        setData(summaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [meetingId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Meeting Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center gap-2 p-6">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-destructive">Error loading summary: {error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* AI Badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Generated Summary</span>
        </div>
      </div>

      {/* Summary Section */}
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
              {data.summary}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Q&A Section */}
      {data.qa.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Questions & Answers
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.qa.map((item, index) => (
                <details
                  key={index}
                  className="group border border-border rounded-lg bg-card hover:bg-accent/50 transition-all duration-200"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-accent/30 transition-colors">
                    <span className="font-medium text-sm pr-4">{item.question}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
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
  );
}