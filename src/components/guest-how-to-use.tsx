"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Users, MessageSquare, FileText } from "lucide-react";

interface GuestHowToUseProps {
  className?: string;
}

export const GuestHowToUse: React.FC<GuestHowToUseProps> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Warning Message */}
      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200 font-medium">
          Don't close the tab. If you close the tab, the summary recording details will be gone.
        </AlertDescription>
      </Alert>

      {/* How to Use MeetMe - Simplified for Guests */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              How to Use MeetMe
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Start Guide */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Join the Meeting</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter your name and click "Join Meeting" to participate in the call.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Use Audio/Video</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable your microphone and camera to communicate effectively.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Chat & Collaborate</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the chat feature to share links, files, and important notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Get AI Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    After the meeting, receive an AI-generated summary with key points.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Key Features
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Real-time transcription</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">AI-powered insights</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Screen sharing</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Meeting recordings</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pro Tips
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Keep your microphone muted when not speaking to reduce background noise</li>
              <li>• Use the raise hand feature if you have questions</li>
              <li>• Check your internet connection for the best experience</li>
              <li>• The meeting summary will be available after the call ends</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};