"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailConfirmationProps {
  meetingId: string;
  meetingName: string;
  hasRecording: boolean;
  hasTranscript: boolean;
  guestCount: number;
}

export const EmailConfirmation = ({
  meetingId,
  meetingName,
  hasRecording,
  hasTranscript,
  guestCount
}: EmailConfirmationProps) => {
  const trpc = useTRPC();
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean;
    success: boolean;
    message: string;
    sentCount?: number;
    totalGuests?: number;
  } | null>(null);

  const sendEmailsMutation = useMutation(
    trpc.meetings.sendMeetingEmails.mutationOptions({
      onSuccess: (data) => {
        setEmailStatus({
          sent: true,
          success: data.success,
          message: data.message,
          sentCount: data.sentCount,
          totalGuests: data.totalGuests
        });
      },
      onError: (error) => {
        setEmailStatus({
          sent: true,
          success: false,
          message: error.message || "Failed to send emails"
        });
      }
    })
  );

  const handleSendEmails = () => {
    sendEmailsMutation.mutate({ meetingId });
  };

  const canSendEmails = hasRecording || hasTranscript;

  if (guestCount === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">No Guests to Notify</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">
                Add guests with email addresses to send meeting links.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Mail className="size-5" />
          Guest Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p><strong>Meeting:</strong> {meetingName}</p>
          <p><strong>Guests:</strong> {guestCount} with email addresses</p>
          <p><strong>Available Resources:</strong></p>
          <ul className="ml-4 mt-1 space-y-1">
            {hasRecording && <li>✅ Meeting Recording</li>}
            {hasTranscript && <li>✅ Meeting Summary & Transcript</li>}
            {!hasRecording && !hasTranscript && <li>⏳ Resources processing...</li>}
          </ul>
        </div>

        {emailStatus ? (
          <Alert className={emailStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {emailStatus.success ? (
                <CheckCircle className="size-4 text-green-600" />
              ) : (
                <XCircle className="size-4 text-red-600" />
              )}
              <AlertDescription className={emailStatus.success ? "text-green-800" : "text-red-800"}>
                {emailStatus.message}
                {emailStatus.sentCount !== undefined && emailStatus.totalGuests && (
                  <span className="block mt-1 text-sm">
                    {emailStatus.sentCount} of {emailStatus.totalGuests} emails sent successfully
                  </span>
                )}
              </AlertDescription>
            </div>
          </Alert>
        ) : (
          <Button
            onClick={handleSendEmails}
            disabled={!canSendEmails || sendEmailsMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {sendEmailsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending Emails...
              </>
            ) : (
              <>
                <Mail className="mr-2 size-4" />
                Send Meeting Links to Guests
              </>
            )}
          </Button>
        )}

        {!canSendEmails && (
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Email sending will be available once recording and/or transcript processing is complete.
          </p>
        )}

        {emailStatus?.success && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailStatus(null)}
            className="w-full"
          >
            Send Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};