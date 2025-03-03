import { conversationsRouter } from "~/server/api/routers/conversations";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { notesRouter } from "./routers/notes";

export const appRouter = createTRPCRouter({
    conversations: conversationsRouter,
    notes: notesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
