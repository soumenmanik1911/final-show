import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { JoinMeetingView } from "@/modules/meetings/ui/join-meeting-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMeetingPublic.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JoinMeetingView meetingId={meetingId} />
    </HydrationBoundary>
  );
};

export default Page;