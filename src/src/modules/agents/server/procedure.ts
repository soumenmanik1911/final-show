import { createTRPCRouter,  protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentsInsertSchema } from "../schema";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { z } from "zod";
import { and, eq, ilike, count } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgents] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgents;
    }),

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
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const limit = input?.limit ?? DEFAULT_PAGE_SIZE;
      const offset = input?.offset ?? 0;
      const search = input?.search?.trim();

      const where = and(
        eq(agents.userId, ctx.auth.user.id),
        search ? ilike(agents.name, `%${search}%`) : undefined,
      );

      const data = await db
        .select()
        .from(agents)
        .where(where)
        .limit(limit)
        .offset(offset);

      const [totalRow] = await db
        .select({ count: count() })
        .from(agents)
        .where(where);

      const totalPages = Math.ceil((totalRow?.count ?? 0) / limit);

      return { items: data, total: totalRow?.count ?? 0, totalPages };
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          name: input.name,
          instructions: input.instruction,
          userId: ctx.auth.user.id,
        })
        .returning();
      return createdAgent;
    }),
});
