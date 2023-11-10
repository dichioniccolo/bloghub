import { projectRouter } from "./router/project";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
