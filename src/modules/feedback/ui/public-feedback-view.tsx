"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Bug, User } from "lucide-react";
import { format } from "date-fns";
import { FeedbackGetAll } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PublicFeedbackView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.feedback.getAll.queryOptions({
      limit: 50,
      offset: 0,
    })
  );

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full w-fit mx-auto mb-6">
          <MessageSquare className="w-12 h-12 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Community Voices Await</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">No feedback has been shared yet. Be the first to start the conversation and help shape MeetMe's future!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-4 sm:gap-6">
      {data.items.map((feedback: FeedbackGetAll['items'][0]) => (
        <Card key={feedback.id} className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-white/10">
                  <AvatarImage src={feedback.userImage || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
                    {feedback.userName ? feedback.userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-white text-base">
                    {feedback.userName || "Anonymous User"}
                  </div>
                  <div className="text-sm text-slate-400">
                    {format(new Date(feedback.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="flex items-center gap-2">
                  {renderStars(feedback.rating)}
                  <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {feedback.rating} star{feedback.rating > 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.comment && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-500/20 rounded-md">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Comment</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed pl-10">{feedback.comment}</p>
              </div>
            )}
            {feedback.bugReport && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-orange-500/20 rounded-md">
                    <Bug className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Bug Report</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed pl-10">{feedback.bugReport}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};