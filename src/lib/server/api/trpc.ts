import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
import { googleEmbeddingModel, googleGeminiModel } from "../gemini";
import { createClient } from "@/utils/supabase/server";

export const prisma = new PrismaClient();

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    return {
        db: supabase,
        prisma,
        user,
        gemini: googleGeminiModel,
        embedding: googleEmbeddingModel,
        ...opts,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
    sse: {
        maxDurationMs: 5 * 60 * 1_000, // 5 minutes
        ping: {
            enabled: true,
            intervalMs: 3_000,
        },
        client: {
            reconnectAfterInactivityMs: 5_000,
        },
    }
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();

    if (t._config.isDev) {
        const waitMs = Math.floor(Math.random() * 400) + 100;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const result = await next();

    const end = Date.now();
    console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

    return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== "authenticated") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});

export const protectedProcedure = t.procedure.use(isAuthed);