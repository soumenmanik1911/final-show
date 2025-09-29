import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { MeetingIdView } from "@/modules/meetings/ui/meeting-id-view";

// Fixed: Corrected param name from meetingId to meetingsId to match the dynamic route [meetingsId]
interface Props {
  params: Promise<{
    meetingsId: string;
  }>;
}

// Fixed: Renamed meetingsId to meetingId in destructuring to match variable usage
const Page = async ({ params }: Props) => {
  const { meetingsId: meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>TODO</p>}>
        <ErrorBoundary fallback={<p>TODO</p>}>
          <div> 
            <MeetingIdView meetingId={meetingId}/>
          </div>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
