import { MeetingsView } from "@/modules/meetings/ui/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { MeetingsListHeader } from "@/modules/meetings/ui/component/meeting-list-header";
import { LoadingState } from "@/components/loading-state";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
    // Check authentication on server side
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();

    // Prefetch meetings data on server to prevent client-side auth issues
    await queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div className="space-y-4 w-full">
            <div className="w-full">
                <MeetingsListHeader />
            </div>
            <div className="w-full">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<LoadingState title="Loading meetings" description="Please wait while we load your meetings" />}>
                        <MeetingsView />
                    </Suspense>
                </HydrationBoundary>
            </div>
        </div>
    );
}
export default page;