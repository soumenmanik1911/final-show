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
    return (<div>
        <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={()=>{}}
        onRemove={() => removeMeeting.mutate({ id: meetingId })}

        />
        
         {JSON.stringify(data,null,2)}
         </div>)
}