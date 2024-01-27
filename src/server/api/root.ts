import { createTRPCRouter } from "~/server/api/trpc";
import { vacanciesRouter } from "~/server/api/routers/vacancies";
import { usersRouter } from "~/server/api/routers/users";
import { hfRouter } from "./routers/hf";
import { draftsRouter } from "./routers/drafts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  vacancies: vacanciesRouter,
  users: usersRouter,
  hf: hfRouter,
  drafts: draftsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
