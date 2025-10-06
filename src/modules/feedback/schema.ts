import { z } from "zod";

export const feedbackInsertSchema = z.object({
  rating: z.number().int().min(1).max(5, { message: "Rating must be between 1 and 5" }),
  comment: z.string().optional(),
  bugReport: z.string().optional(),
});

export const feedbackUpdateSchema = feedbackInsertSchema.extend({
  id: z.string().min(1, { message: "id is required" }),
});