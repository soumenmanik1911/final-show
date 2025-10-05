import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CallEnded = () => {
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
            <p className="text-sm text-muted-foreground">
              A summary will appear in a few minutes.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href="/meetings"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeftIcon className="mr-2 size-4" aria-hidden="true" />
              Back to Meetings
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
