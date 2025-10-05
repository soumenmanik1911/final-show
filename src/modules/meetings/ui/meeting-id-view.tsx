"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "./component/meetingid-view-header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MeetingUpcomingState } from "./component/meeting-upcoming-state";
import { MeetingActiveState } from "./component/meeting-active-state";
import { MeetingCancelledState } from "./component/meeting-cancelled-state";
import { MeetingCompletedState } from "./component/meeting-completed-state";
import { MeetingProcessingState } from "./component/meeting-processing-state";

interface Props{
    meetingId:string
};

// Fixed: Removed async from client component to resolve "async Client Component" error in Next.js 15
export const MeetingIdView = ({meetingId}:Props) => {
const trpc = useTRPC();
const router= useRouter();
const queryClient = useQueryClient();
const{data} =useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({id:meetingId})
)
    const removeMeeting= useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['meetings', 'getMany'] });
                router.push("/meetings");
            }
        })
    )

    const cancelMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['meetings', 'getOne', meetingId] });
                queryClient.invalidateQueries({ queryKey: ['meetings', 'getMany'] });
            }
        })
    )
    const isActive = data.status === "active";
const isUpcoming =data.status === "upcoming";
const isCancelled =data.status === "cancelled";
const isCompleted =data.status === "completed";
const isProcessing =data.status === "processing";

    // Special case: Show completed state if recording is available, even if status is not completed
    const hasRecording = data.recordingUrl;
    const shouldShowCompleted = isCompleted || (hasRecording && !isActive && !isUpcoming && !isCancelled);

    /**
     * MeetingIdView Component
     *
     * Main component for displaying a specific meeting's details.
     * Handles fetching meeting data, state determination, and rendering appropriate UI based on meeting status.
     *
     * Props:
     * - meetingId: string - The unique identifier for the meeting to display
     *
     * State Logic:
     * - Fetches meeting data using TRPC and React Query
     * - Determines meeting state based on data.status (processing, upcoming, cancelled, completed, active)
     * - Conditionally renders state-specific components for better modularity and maintainability
     *
     * Integration Points:
     * - Uses MeetingIdViewHeader for navigation and actions
     * - Renders modular state components (MeetingUpcomingState, etc.) based on current status
     * - Supports responsive design and smooth transitions
     * - Compatible with Next.js 15 client-side rendering
     */
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header component with breadcrumb, status badge, and action buttons */}
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          status={data.status}
          onEdit={() => {}}
          onRemove={() => removeMeeting.mutate({ id: meetingId })}
          onCancel={() => cancelMeeting.mutate({ id: meetingId, status: "cancelled" })}
        />

        {/* Conditional rendering of state-specific components for better modularity */}
        {isCancelled && <MeetingCancelledState meeting={data} />}
        {isProcessing && !shouldShowCompleted && <MeetingProcessingState meeting={data} />}
        {isUpcoming && <MeetingUpcomingState meeting={data} />}
        {(isCompleted || shouldShowCompleted) && <MeetingCompletedState meeting={data} />}
        {isActive && !shouldShowCompleted && <MeetingActiveState meeting={data} />}
      </div>
    );
}

      


     
      
