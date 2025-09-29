"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "./component/meetingid-view-header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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

    return (<div>
        <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={()=>{}}
        onRemove={() => removeMeeting.mutate({ id: meetingId })}

        />
        
        {isCancelled && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">This meeting has been cancelled.</div>}
        {isProcessing && <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400" role="alert">This meeting is currently being processed.</div>}
            {isUpcoming && <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">This meeting is upcoming.</div>}
            {isCompleted && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">This meeting has been completed.</div>}
             {isActive && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">This meeting is currently active.</div>}
        </div>
    );
}

      


     
      
