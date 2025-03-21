import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { vaultsRouter } from "./routes/vaults";
import { notesRouter } from "./routes/notes";
import { conversationsRouter } from "./routes/conversations/router";
import { learningRouter } from "./routes/learning/router";

export const appRouter = createTRPCRouter({
    vaults: vaultsRouter,
    conversations: conversationsRouter,
    notes: notesRouter,
    learning: learningRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
