import { agentsRouter } from '@/modules/agents/server/procedure';
import { createTRPCRouter } from '../init';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { feedbackRouter } from '@/modules/feedback/server/procedures';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  feedback: feedbackRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;