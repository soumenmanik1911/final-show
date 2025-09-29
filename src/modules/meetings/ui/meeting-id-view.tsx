"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "./component/meetingid-view-header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, Calendar, X, CheckCircle, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    const isActive = data.status === "active";
const isUpcoming =data.status === "upcoming";
const isCancelled =data.status === "cancelled";
const isCompleted =data.status === "completed";
const isProcessing =data.status === "processing";

    const getStatusAlert = () => {
      if (isCancelled) {
        return (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 transition-all duration-300 ease-in-out">
            <CardContent className="flex items-center gap-3 p-4">
              <X className="size-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Meeting Cancelled</p>
                <p className="text-sm text-red-600 dark:text-red-300">This meeting has been cancelled.</p>
              </div>
            </CardContent>
          </Card>
        );
      }
      if (isProcessing) {
        return (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 transition-all duration-300 ease-in-out">
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="size-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Processing</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">This meeting is currently being processed.</p>
              </div>
            </CardContent>
          </Card>
        );
      }
      if (isUpcoming) {
        return (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 transition-all duration-300 ease-in-out">
            <CardContent className="flex items-center gap-3 p-4">
              <Calendar className="size-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Upcoming Meeting</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">This meeting is scheduled for the future.</p>
              </div>
            </CardContent>
          </Card>
        );
      }
      if (isCompleted) {
        return (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 transition-all duration-300 ease-in-out">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle className="size-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Meeting Completed</p>
                <p className="text-sm text-green-600 dark:text-green-300">This meeting has been successfully completed.</p>
              </div>
            </CardContent>
          </Card>
        );
      }
      if (isActive) {
        return (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 transition-all duration-300 ease-in-out">
            <CardContent className="flex items-center gap-3 p-4">
              <Play className="size-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Meeting Active</p>
                <p className="text-sm text-green-600 dark:text-green-300">This meeting is currently in progress.</p>
              </div>
            </CardContent>
          </Card>
        );
      }
      return null;
    };

    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          status={data.status}
          onEdit={() => {}}
          onRemove={() => removeMeeting.mutate({ id: meetingId })}
        />
        {getStatusAlert()}
      </div>
    );
}

      


     
      
