import { createTRPCRouter,  protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { z } from "zod";
import { and, eq, ilike, count, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schema";
import { sql } from "drizzle-orm";
import { streamVideo } from "@/lib/stream-video";
import { id } from "zod/v4/locales";
import { generateAvatarUri } from "@/lib/avatar";


export const meetingsRouter = createTRPCRouter({
  genarateToken: protectedProcedure.mutation(async ({ctx}) =>{ 
    await streamVideo.upsertUsers([
{     id:ctx.auth.user.id,
      name:ctx.auth.user.name ,
      role: "admin",
      image:generateAvatarUri({ seed:ctx.auth.user.id , variant: "initials"})}

    ]);
    //1hour
    const expirationTime= Math.floor(Date.now()/1000)+3600;
    const issuedAt = Math.floor(Date.now()/1000);

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_second:issuedAt

    })
    return token;

  }),
  
   remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removeMeeting] = await db
      .delete(meetings)
      
        .where(
            and(
              eq(meetings.id, input.id),
              eq(meetings.userId, ctx.auth.user.id)
            ),
          )
              .returning();
  
          if(!removeMeeting){
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Meeting not found',
            })
          }
          return removeMeeting;
  
        }),


   update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
      .update(meetings)
      .set(input)
        .where(
            and(
              eq(meetings.id, input.id),
              eq(meetings.userId, ctx.auth.user.id)
            ),
          )
              .returning();
  
          if(!updatedMeeting){
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Meeting not found',
            })
          }
          return updatedMeeting;
  
        }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
        
        const call =streamVideo.video.call("default", createdMeeting.id, );
        await call.create({
          data:{
            created_by_id: ctx.auth.user.id,
            custom:{
              meetingId: createdMeeting.id,
              meetingName: createdMeeting.name,
            },
            settings_override:{
              transcription:{
                language: "en",
                mode:"auto-on",
                closed_caption_mode:"auto-on"
              },
              recording:{
                quality:"1080p",
                mode:"auto-on"
              }
            }
          }
        });
        const [existingAgent] = await db
        .select()
        .from(agents).where(eq(agents.id, createdMeeting.agentId));

        if(!existingAgent){
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Agent not found',
          })
        }
        await streamVideo.upsertUsers([
  {
    id: existingAgent.id,
    name: existingAgent.name,
    role: "user",
    image: generateAvatarUri({
      seed: existingAgent.name,
      variant: "botttsNeutral",
    }),
  },
]);


      return createdMeeting;
    }),

getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input ,ctx}) => {
      const [existingmeetings] = await db
        .select({
          ...getTableColumns(meetings),
          agent:agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endTime} - ${meetings.startTime}))`.as("duration"),

        })
       .from(meetings)
       .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.auth.user.id)
        )
      );

    if (!existingmeetings) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Meeting not found',
      });
    }

    return existingmeetings;
  }),

//   getMany: protectedProcedure
//     .input(
//       z
//         .object({
//           limit: z
//             .number()
//             .min(MIN_PAGE_SIZE)
//             .max(MAX_PAGE_SIZE)
//             .default(DEFAULT_PAGE_SIZE),
//           offset: z.number().min(0).default(0),
//           search: z.string().optional(),
//         })
//         .optional()
//     )
//     .query(async ({ input, ctx }) => {
//       const limit = input?.limit ?? DEFAULT_PAGE_SIZE;
//       const offset = input?.offset ?? 0;
//       const search = input?.search?.trim();

//       const where = and(
//         eq(meetings.userId, ctx.auth.user.id),
//         search ? ilike(meetings.name, `%${search}%`) : undefined,
//       );

//       const data = await db
//         .select()
//         .from(meetings)
//         .where(where)
//         .limit(limit)
//         .offset(offset);

//       const [totalRow] = await db
//         .select({ count: count() })
//         .from(meetings)
//         .where(where);

//       const totalPages = Math.ceil((totalRow?.count ?? 0) / limit);

//       return { items: data, total: totalRow?.count ?? 0, totalPages };
//     }),


// });
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
        eq(meetings.userId, ctx.auth.user.id),
        search ? ilike(meetings.name, `%${search}%`) : undefined,
      );

      const data = await db
        .select({
          ...getTableColumns(meetings),
          // Fixed: Properly select agent data using getTableColumns with alias
          agent:agents,
          // Fixed: Use proper column names with snake_case as defined in schema
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endTime} - ${meetings.startTime}))`.as("duration"),
        })
        .from(meetings)
        // Fixed: Use leftJoin instead of innerJoin to handle cases where agent might not exist
        .leftJoin(agents, eq(meetings.agentId, agents.id))
        .where(where)
        .limit(limit)
        .offset(offset);

      // Fixed: Include the same join in count query for consistency
      const [totalRow] = await db
        .select({ count: count() })
        .from(meetings)
        .leftJoin(agents, eq(meetings.agentId, agents.id))
        .where(where);

      const totalPages = Math.ceil((totalRow?.count ?? 0) / limit);

      return { items: data, total: totalRow?.count ?? 0, totalPages };
    }),


});
