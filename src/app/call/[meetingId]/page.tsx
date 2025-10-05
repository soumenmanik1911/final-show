import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CallView } from "@/modules/call/ui/view/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
  searchParams: Promise<{
    guestToken?: string;
    guestId?: string;
    guestName?: string;
  }>;
}

export const Page = async ({ params, searchParams }: Props) => {
  const { meetingId } = await params;
  const { guestToken, guestId, guestName } = await searchParams;

  // Check if this is a guest join
  const isGuest = !!(guestToken && guestId && guestName);

  let session = null;
  if (!isGuest) {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/sign-in");
    }
  }

  const queryClient = getQueryClient();

  if (isGuest) {
    // For guests, prefetch public meeting info
    void queryClient.prefetchQuery(
      trpc.meetings.getMeetingPublic.queryOptions({ id: meetingId })
    );
  } else {
    // For authenticated users, prefetch full meeting info
    void queryClient.prefetchQuery(
      trpc.meetings.getOne.queryOptions({ id: meetingId })
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CallView
        meetingId={meetingId}
        isGuest={isGuest}
        guestToken={guestToken}
        guestId={guestId}
        guestName={guestName}
      />
    </HydrationBoundary>
  );
};
export default Page;
