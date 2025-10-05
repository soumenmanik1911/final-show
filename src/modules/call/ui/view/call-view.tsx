"use client";
import Button from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../componenets/call-provide";

interface Props {
  meetingId: string;
  isGuest?: boolean;
  guestToken?: string;
  guestId?: string;
  guestName?: string;
}

export const CallView = ({
  meetingId,
  isGuest,
  guestToken,
  guestId,
  guestName
}: Props) => {
  const trpc = useTRPC();
  const { data } = isGuest
    ? useSuspenseQuery(trpc.meetings.getMeetingPublic.queryOptions({ id: meetingId }))
    : useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
  if (data.status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Completed</h2>
          <p className="text-gray-600 max-w-md">
            This meeting has already ended. The link is no longer active.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Meetings
          </Button>
        </div>
      </div>
    );
  }


  return(
  <CallProvider
    meetingId={meetingId}
    meetingName={data.name}
    meetingData={data}
    isGuest={isGuest}
    guestId={guestId}
    guestName={guestName}
    guestToken={guestToken}
  />
  )
}
