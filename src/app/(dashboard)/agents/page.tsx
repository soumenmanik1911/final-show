import { AgentsView } from "@/modules/agents/ui/agent-views";
import { getQueryClient ,trpc} from "@/trpc/server";
import { dehydrate,HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {LoadingState} from "@/components/loading-state";
import { AgentListHeaders } from "@/modules/agents/ui/componenets/agent-list-headers";
import {headers} from 'next/headers';
import {auth} from "@/lib/auth";
import{redirect} from "next/navigation"

const page = async() =>{
  // Check authentication on server side
  const session = await auth.api.getSession({headers: await headers()});
  if(!session){
    redirect("/sign-in");
  }

  // Don't prefetch on server side - let client handle it
  // The protected procedure requires authentication context that's not available during SSR
  const queryClient = getQueryClient();
  
  return(
    <>
      <AgentListHeaders/>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingState title="Loading agents" description="Please wait while we load the agents"/>}>
          <AgentsView/>
        </Suspense>
      </HydrationBoundary> 
    </>
  )
}
export default page;
 