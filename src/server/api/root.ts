import { createTRPCRouter } from "~/server/api/trpc";
import { gptRouter } from "~/server/api/routers/gpt";
import { vacanciesRouter } from "~/server/api/routers/vacancies";
import { usersRouter } from "~/server/api/routers/users";
import { cvsRouter } from "./routers/cvs";
import { storiesRouter } from "./routers/stories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  gpt: gptRouter,
  vacancies: vacanciesRouter,
  cvs: cvsRouter,
  users: usersRouter,
  stories: storiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
