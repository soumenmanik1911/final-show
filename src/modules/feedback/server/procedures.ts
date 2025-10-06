import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { feedback, user } from "@/db/schema";
import { feedbackInsertSchema, feedbackUpdateSchema } from "../schema";
import { z } from "zod";
import { and, eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const feedbackRouter = createTRPCRouter({
  // Public procedure to create feedback (for guests and authenticated users)
  create: baseProcedure
    .input(feedbackInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdFeedback] = await db
        .insert(feedback)
        .values({
          rating: input.rating,
          comment: input.comment,
          bugReport: input.bugReport,
          userId: ctx.auth?.user?.id, // Will be null for guests
        })
        .returning();
      return createdFeedback;
    }),

  // Public procedure to get all feedback with user names
  getAll: baseProcedure
    .input(
      z
        .object({
          limit: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? DEFAULT_PAGE_SIZE;
      const offset = input?.offset ?? 0;

      const data = await db
        .select({
          id: feedback.id,
          rating: feedback.rating,
          comment: feedback.comment,
          bugReport: feedback.bugReport,
          createdAt: feedback.createdAt,
          updatedAt: feedback.updatedAt,
          userName: user.name,
          userImage: user.image,
        })
        .from(feedback)
        .leftJoin(user, eq(feedback.userId, user.id))
        .limit(limit)
        .offset(offset)
        .orderBy(feedback.createdAt);

      const [totalRow] = await db
        .select({ count: count() })
        .from(feedback);

      const totalPages = Math.ceil((totalRow?.count ?? 0) / limit);

      return { items: data, total: totalRow?.count ?? 0, totalPages };
    }),

  // Protected procedure to get user's own feedback
  getMany: protectedProcedure
    .input(
      z
        .object({
          limit: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const limit = input?.limit ?? DEFAULT_PAGE_SIZE;
      const offset = input?.offset ?? 0;

      const data = await db
        .select()
        .from(feedback)
        .where(eq(feedback.userId, ctx.auth.user.id))
        .limit(limit)
        .offset(offset)
        .orderBy(feedback.createdAt);

      const [totalRow] = await db
        .select({ count: count() })
        .from(feedback)
        .where(eq(feedback.userId, ctx.auth.user.id));

      const totalPages = Math.ceil((totalRow?.count ?? 0) / limit);

      return { items: data, total: totalRow?.count ?? 0, totalPages };
    }),

  // Protected procedure to get one feedback entry
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingFeedback] = await db
        .select()
        .from(feedback)
        .where(
          and(
            eq(feedback.id, input.id),
            eq(feedback.userId, ctx.auth.user.id)
          )
        );

      if (!existingFeedback) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Feedback not found',
        });
      }

      return existingFeedback;
    }),

  // Protected procedure to update feedback
  update: protectedProcedure
    .input(feedbackUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedFeedback] = await db
        .update(feedback)
        .set({
          rating: input.rating,
          comment: input.comment,
          bugReport: input.bugReport,
        })
        .where(
          and(
            eq(feedback.id, input.id),
            eq(feedback.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!updatedFeedback) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Feedback not found',
        });
      }

      return updatedFeedback;
    }),

  // Protected procedure to delete feedback
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedFeedback] = await db
        .delete(feedback)
        .where(
          and(
            eq(feedback.id, input.id),
            eq(feedback.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!removedFeedback) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Feedback not found',
        });
      }

      return removedFeedback;
    }),
});