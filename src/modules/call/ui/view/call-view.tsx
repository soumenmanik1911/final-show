"use client";
import Button from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../componenets/call-provide";

interface Props {
  meetingId: string;
}

export const CallView = ({
  meetingId
}: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
  if (data.status =="completed"){
    return (
          //a button for returnnig meeting page
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            meeting is cmpleted 

           <Button className="bg-white" onClick={() => window.history.back()}>Return to Meeting Page</Button>
           
                
        </div>
    )
  }


  return(
  <CallProvider meetingId={meetingId}  meetingName={data.name}/>
  )
}
