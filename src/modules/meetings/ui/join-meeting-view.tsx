"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Video } from "lucide-react";
import { GeneratedAvatar } from "@/components/genrated-avatar";
import { MeetMeLogo } from "@/components/logo";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export const JoinMeetingView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getMeetingPublic.queryOptions({ id: meetingId })
  );

  const generateToken = useMutation(
    trpc.meetings.generateGuestToken.mutationOptions({
      onSuccess: (data) => {
        // Redirect to call page with guest params
        const params = new URLSearchParams({
          guestToken: data.token,
          guestId: data.guestId,
          guestName: data.guestName,
        });
        router.push(`/call/${meetingId}?${params.toString()}`);
      },
    })
  );

  const handleJoin = () => {
    if (guestName.trim()) {
      generateToken.mutate({
        meetingId,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim() || undefined
      });
    }
  };

  const isLoading = generateToken.isPending;

  if (meeting.status === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Video className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Meeting Completed
            </CardTitle>
            <CardDescription className="text-gray-600">
              This meeting has already been completed. The link has expired.

              <Link href="/sign-up">
                <Button variant="outline" className="mt-4">
                  Go to Homepage
                </Button>
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MeetMeLogo className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">MeetMe</h1>
                <p className="text-sm text-gray-600">Professional Meeting Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Join Meeting
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your name to join the meeting
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Meeting Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <GeneratedAvatar
                seed={meeting.name}
                variant="botttsNeutral"
                className="w-10 h-10 border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{meeting.name}</h3>
                <p className="text-sm text-gray-600">with {meeting.agent.name}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>Meeting ID: {meetingId}</span>
            </div>
          </div>

          {/* Guest Name Input */}
          <div className="space-y-2">
            <label htmlFor="guestName" className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              id="guestName"
              type="text"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>

          {/* Guest Email Input */}
          <div className="space-y-2">
            <label htmlFor="guestEmail" className="text-sm font-medium text-gray-700">
              Your Email
            </label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="Enter your email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={!guestName.trim() || isLoading}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Join Meeting
              </>
            )}
          </Button>

          {generateToken.error && (
            <p className="text-sm text-red-600 text-center">
              Failed to join meeting. Please try again. and check the details
            </p>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};