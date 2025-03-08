/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { newId } from "~/utils/id";
import { systemPrompt } from "~/server/gemini";
import { TRPCError } from "@trpc/server";

export const createConversationProcedure = protectedProcedure
    .input(z.object({
        vaultId: z.string(),
        prompt: z.string(),
    }))
    .mutation(async ({
        ctx,
        input,
    }) => {
        const conversation = await ctx.prisma.conversations.create({
            data: {
                id: newId("conversation"),
                vaultId: input.vaultId,
                systemPrompt,
                initialUserPrompt: input.prompt,
            },
        });

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        return conversation;
    });

export const getConversationByIdProcedure = protectedProcedure
    .input(z.string())
    .query(async ({
        ctx,
        input: id,
    }) => {
        const conversation = await ctx.prisma.conversations.findFirst({
            where: {
                id: id,
            },
            include: {
                messages: {
                    include: {
                        message_relevant_notes: {
                            include: {
                                notes: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    }
                },
            },
        });

        if (!conversation) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        };

        const conversationMessages = conversation.messages
            .map((msg) => ({
                ...msg,
                relevantNotes: msg.message_relevant_notes.map(message_notes => message_notes.notes),
                message_relevant_notes: undefined,
            }));

        return {
            ...conversation,
            messages: conversationMessages,
        };
    });

export const getAllConversationsProcedure = protectedProcedure
    .input(z.object({
        vaultId: z.string(),
    }))
    .query(async ({
        ctx,
        input,
    }) => {
        const conversations = await ctx.prisma.conversations.findMany({
            where: {
                vaultId: input.vaultId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });

        if (!conversations) {
            throw new Error("Conversations not found");
        }

        return conversations;
    });
export const saveConversationMessageProcedure = protectedProcedure
    .input(z.object({
        conversationId: z.string(),
        message: z.string(),
        role: z.union([
            z.literal("user"),
            z.literal("llm"),
        ]),
    }))
    .mutation(async ({ ctx, input }) => {
        const conversation = await ctx.prisma.conversations.findFirst({
            where: {
                id: input.conversationId,
            },
        });

        if (!conversation) {
            throw new Error("Conversation not found");
        };

        const message = await ctx.prisma.messages.create({
            data: {
                id: newId("message"),
                content: input.message,
                role: input.role,
                conversationId: conversation.id,
            },
        });

        if (!message) {
            throw new Error("error inserting message");
        };

        return message;
    });