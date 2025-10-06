"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Bug, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { FeedbackGetMany } from "../types";

export const MyFeedbackView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.feedback.getMany.queryOptions({
      limit: 20,
      offset: 0,
    })
  );

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full w-fit mx-auto mb-6">
          <MessageSquare className="w-12 h-12 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Share Your Thoughts</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Your feedback helps us improve MeetMe. Be the first to share your experience!</p>
        <Button
          onClick={() => window.open('/feedback', '_blank')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Submit Your Feedback
        </Button>
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
      {data.items.map((feedback: FeedbackGetMany['items'][0]) => (
        <Card key={feedback.id} className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {renderStars(feedback.rating)}
                  <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    {feedback.rating} star{feedback.rating > 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <div className="text-xs sm:text-sm text-slate-400 sm:hidden">
                  {format(new Date(feedback.createdAt), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 p-2 h-8 w-8"
                    title="Edit feedback"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 h-8 w-8"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-sm text-slate-400">
              {format(new Date(feedback.createdAt), "PPP 'at' p")}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.comment && (
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-500/20 rounded">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Comment</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed pl-7">{feedback.comment}</p>
              </div>
            )}
            {feedback.bugReport && (
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-orange-500/20 rounded">
                    <Bug className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Bug Report</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed pl-7">{feedback.bugReport}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};