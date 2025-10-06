import { MyFeedbackView } from "@/modules/feedback/ui/my-feedback-view";
import { PublicFeedbackView } from "@/modules/feedback/ui/public-feedback-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { headers } from 'next/headers';
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  // Check authentication on server side
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  // Don't prefetch on server side - let client handle it
  // The protected procedure requires authentication context that's not available during SSR
  const queryClient = getQueryClient();

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Feedback Hub
              </h1>
              <p className="text-slate-400 mt-1 text-sm sm:text-base">Your voice matters - share, manage, and explore community insights</p>
            </div>
          </div>
        </div>

        {/* User's Own Feedback */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Contributions</h2>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<LoadingState title="Loading your feedback" description="Retrieving your valuable insights..." />}>
                <MyFeedbackView />
              </Suspense>
            </HydrationBoundary>
          </div>
        </div>

        {/* All Public Feedback */}
        <div>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Community Voices</h2>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
            <Suspense fallback={<LoadingState title="Loading community feedback" description="Gathering insights from our amazing community..." />}>
              <PublicFeedbackView />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;