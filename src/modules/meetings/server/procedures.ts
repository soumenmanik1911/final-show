import { createTRPCRouter,  protectedProcedure, baseProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings, guests } from "@/db/schema";

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { z } from "zod";
import { and, eq, ilike, count, getTableColumns, not, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema, guestInsertSchema, guestUpdateSchema } from "../schema";
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
      iat: issuedAt

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
       // If cancelling the meeting, end the Stream call and mark as completed
       if (input.status === 'cancelled') {
         try {
           const call = streamVideo.video.call("default", input.id);
           await call.end();
           console.log('Stream call ended for cancelled meeting:', input.id);

           // Set status to completed and add end time since we're ending the call
           input.status = 'completed';
           input.endTime = new Date();
         } catch (error) {
           console.error('Failed to end Stream call for cancelled meeting:', error);
           // Continue with database update even if Stream call end fails
         }
       }

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
      const { guests: guestList, ...meetingData } = input;
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...meetingData,
          userId: ctx.auth.user.id,
        })
        .returning();

      // Insert guests if provided
      if (guestList && guestList.length > 0) {
        await db
          .insert(guests)
          .values(
            guestList.map(guestData => ({
              meetingId: createdMeeting.id,
              name: guestData.name,
              email: guestData.email,
            }))
          );
      }
        
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

        // Start recording immediately when meeting is created
        try {
          await call.startRecording();
          console.log('Recording started for meeting:', createdMeeting.id);
        } catch (error) {
          console.error('Failed to start recording for new meeting:', error);
        }
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

      // Get guests for this meeting
      const guestsList = await db
        .select()
        .from(guests)
        .where(eq(guests.meetingId, input.id));

      return {
        ...existingmeetings,
        guests: guestsList,
      };

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

 getMeetingPublic: baseProcedure
   .input(z.object({ id: z.string() }))
   .query(async ({ input }) => {
     const [existingMeeting] = await db
       .select({
         id: meetings.id,
         name: meetings.name,
         status: meetings.status,
         agent: agents,
       })
       .from(meetings)
       .innerJoin(agents, eq(meetings.agentId, agents.id))
       .where(eq(meetings.id, input.id));

     if (!existingMeeting) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'Meeting not found',
       });
     }

     return existingMeeting;
   }),

 generateGuestToken: baseProcedure
   .input(z.object({ meetingId: z.string(), guestName: z.string().min(1), guestEmail: z.string().email() }))
   .mutation(async ({ input }) => {
     // Check if meeting exists
     const [existingMeeting] = await db
       .select()
       .from(meetings)
       .where(eq(meetings.id, input.meetingId));

     if (!existingMeeting) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'Meeting not found',
       });
     }

     // Create guest user in Stream Video
     const guestId = `guest_${input.meetingId}_${Date.now()}`;
     await streamVideo.upsertUsers([
       {
         id: guestId,
         name: input.guestName,
         role: "user",
         image: generateAvatarUri({ seed: guestId, variant: "initials" })
       }
     ]);

     // Store guest in database
     const [guest] = await db
       .insert(guests)
       .values({
         meetingId: input.meetingId,
         name: input.guestName,
         email: input.guestEmail,
       })
       .returning();

     // Generate token
     const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
     const issuedAt = Math.floor(Date.now() / 1000);

     const token = streamVideo.generateUserToken({
       user_id: guestId,
       exp: expirationTime,
       iat: issuedAt
     });

     return { token, guestId, guestName: input.guestName, guest };
   }),

 updateGuest: baseProcedure
   .input(guestUpdateSchema)
   .mutation(async ({ input }) => {
     const [updatedGuest] = await db
       .update(guests)
       .set(input)
       .where(eq(guests.id, input.id))
       .returning();

     if (!updatedGuest) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'Guest not found',
       });
     }

     return updatedGuest;
   }),

 getGuests: protectedProcedure
   .input(z.object({ meetingId: z.string() }))
   .query(async ({ input, ctx }) => {
     // First check if the user owns the meeting
     const [meeting] = await db
       .select()
       .from(meetings)
       .where(and(eq(meetings.id, input.meetingId), eq(meetings.userId, ctx.auth.user.id)));

     if (!meeting) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'Meeting not found',
       });
     }

     const guestsList = await db
       .select()
       .from(guests)
       .where(eq(guests.meetingId, input.meetingId));

     return guestsList;
   }),

 sendMeetingEmails: protectedProcedure
   .input(z.object({ meetingId: z.string() }))
   .mutation(async ({ input, ctx }) => {
     // First check if the user owns the meeting
     const [meeting] = await db
       .select()
       .from(meetings)
       .where(and(eq(meetings.id, input.meetingId), eq(meetings.userId, ctx.auth.user.id)));

     if (!meeting) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'Meeting not found',
       });
     }

     // Get guests with emails
     const guestsWithEmails = await db
       .select()
       .from(guests)
       .where(and(eq(guests.meetingId, input.meetingId), isNotNull(guests.email)));

     if (guestsWithEmails.length === 0) {
       return {
         success: false,
         message: 'No guests with email addresses found',
         sentCount: 0,
         totalGuests: 0
       };
     }

     // Get host name and meeting summary
     const [host] = await db
       .select({ name: agents.name })
       .from(agents)
       .where(eq(agents.userId, meeting.userId))
       .limit(1);

     // Import sendMeetingLinksEmail function
     const { sendMeetingLinksEmail } = await import('@/lib/email');

     // Send emails to all guests
     const emailPromises = guestsWithEmails.map(async (guest) => {
       try {
         const result = await sendMeetingLinksEmail(guest.email!, {
           guestName: guest.name,
           meetingName: meeting.name,
           summaryText: meeting.summary || undefined,
           recordingUrl: meeting.recordingUrl || undefined,
           hostName: host?.name,
         });
         return { success: result.success, guestId: guest.id, guestName: guest.name };
       } catch (error) {
         console.error(`Failed to send email to ${guest.email}:`, error);
         return { success: false, guestId: guest.id, guestName: guest.name, error: error instanceof Error ? error.message : 'Unknown error' };
       }
     });

     const results = await Promise.allSettled(emailPromises);
     const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
     const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

     return {
       success: successful > 0,
       message: `Emails sent: ${successful} successful, ${failed} failed`,
       sentCount: successful,
       totalGuests: guestsWithEmails.length,
       results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
     };
   }),


});
