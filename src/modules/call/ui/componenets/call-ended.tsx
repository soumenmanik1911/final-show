import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, Download, Play } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  meetingData?: any;
  isGuest?: boolean;
}

export const CallEnded = ({ meetingData, isGuest }: Props) => {
  return (
    // Enhanced: Used semantic section with proper ARIA attributes for accessibility
    // Enhanced: Ensured responsive design with min-h-screen and padding
    // Enhanced: Improved visual hierarchy with Card component and better spacing
    <section
      className="flex min-h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar p-4"
      aria-live="polite"
      aria-label="Call ended"
    >
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="size-12 text-green-500" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl font-semibold">Call Ended</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              You have successfully ended the call.
            </p>
            <div className="space-y-4">
              {meetingData?.recordingUrl && meetingData?.transcriptUrl ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Meeting resources are now available:
                  </p>
                  <div className="space-y-3">
                    {meetingData.recordingUrl && (
                      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Play className="size-4 text-blue-600" />
                            <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">Meeting Recording</p>
                          </div>
                          <Button
                            onClick={() => window.open(meetingData.recordingUrl, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            size="sm"
                          >
                            <Download className="w-3 h-3 mr-2" />
                            Download Recording
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                    {meetingData.transcriptUrl && (
                      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircleIcon className="size-4 text-purple-600" />
                            <p className="font-medium text-purple-800 dark:text-purple-200 text-sm">Meeting Summary</p>
                          </div>
                          <Button
                            onClick={() => window.open(`/summary/${meetingData.id}`, '_blank')}
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                            size="sm"
                          >
                            View Summary
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Meeting resources are being processed.
                  </p>
                  {isGuest ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Summary and recording links will be emailed to you when ready.
                      </p>
                      <Button
                        onClick={() => window.open(`/guest-summary/${meetingData?.id}`, '_blank')}
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        size="sm"
                      >
                        <CheckCircleIcon className="w-3 h-3 mr-2" />
                        View Meeting Summary
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Summary and recording links will be available in your meetings dashboard.
                    </p>
                  )}
                </div>
              )}

              {/* Always show summary access for guests */}
              {isGuest && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    onClick={() => window.open(`/guest-summary/${meetingData?.id}`, '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                    size="sm"
                  >
                    <CheckCircleIcon className="w-3 h-3 mr-2" />
                    Access Meeting Summary
                  </Button>
                  <div className="text-red-700 font-bold">Don't close the tab. If you close the tab, the summary recording details will be gone.</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href={isGuest ? "/" : "/meetings"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeftIcon className="mr-2 size-4" aria-hidden="true" />
              {isGuest ? "Back to Home" : "Back to Meetings"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
