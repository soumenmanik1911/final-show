"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send } from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [bugReport, setBugReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trpc = useTRPC();
  const createFeedback = useMutation(
    trpc.feedback.create.mutationOptions({
      onSuccess: () => {
        alert("Thank you for your feedback!");
        setRating(0);
        setComment("");
        setBugReport("");
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error('Failed to submit feedback:', error);
        alert("Failed to submit feedback. Please try again.");
        setIsSubmitting(false);
      },
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    createFeedback.mutate({
      rating,
      comment: comment || undefined,
      bugReport: bugReport || undefined,
    });
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-300">
            Help us improve MeetMe by sharing your thoughts and experiences.
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Feedback Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {renderStars()}
                  <span className="text-sm text-gray-400">
                    {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment (Optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 min-h-[100px]"
                />
              </div>

              {/* Bug Report */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bug Report / Issue (Optional)
                </label>
                <Textarea
                  value={bugReport}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBugReport(e.target.value)}
                  placeholder="Describe any bugs or issues you encountered..."
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}