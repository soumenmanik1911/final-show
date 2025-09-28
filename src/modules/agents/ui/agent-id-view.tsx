"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { AgentIdViewHeader } from "./componenets/agent-id-view-headwe";
import { GeneratedAvatar } from "@/components/genrated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {UpdateAgentDialog} from "./componenets/update-agent-dialog";
interface  Props{
    agentId:string 
};

export const AgentIdView = ({agentId}:Props) => {

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [updateDialogOpen,setUpdateDialogOpen] = useState(false);


    const {data} = useSuspenseQuery(trpc.agents.getOne.queryOptions({id:agentId}));
    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () =>{
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            
            router.push("/agents");
            },
        

        })
    )
   
    return(
        <div>
            <UpdateAgentDialog
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            agent={data}
            />
            <AgentIdViewHeader
            agentId={agentId}
            agentName={data.name}
            onEdit={() => setUpdateDialogOpen(true)}
            onRemove ={() => removeAgent .mutate({id:agentId})}
            />
            <div className=" bg-white rounded-lg border"
            >
                <div className=" px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar
                        variant="botttsNeutral"
                         seed={data.name}
                         className="size-10"
                         />
                        <div className="font-medium text-2xl">{data.name}</div>
                        <Badge
                        variant ="outline"
                        className="flex items-center gap-x-2">
                            <VideoIcon className="size-4"/>

                        </Badge>
                        <div>
                            <p> instruction</p>
                            <p>{data.instructions}</p>

                        </div>
                    </div>
                </div>
            </div>
            </div>
    )
}