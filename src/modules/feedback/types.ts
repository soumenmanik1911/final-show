import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type FeedbackGetOne = inferRouterOutputs<AppRouter>["feedback"]["getOne"];
export type FeedbackGetMany = inferRouterOutputs<AppRouter>["feedback"]["getMany"];
export type FeedbackGetAll = inferRouterOutputs<AppRouter>["feedback"]["getAll"];