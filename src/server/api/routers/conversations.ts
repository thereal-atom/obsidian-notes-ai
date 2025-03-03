import type { Conversation } from "~/server/db";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateEmbeddings } from "~/server/gemini/utils";
import { newId } from "~/utils/id";
import { systemPrompt } from "~/server/gemini";

export const conversationsRouter = createTRPCRouter({
    sendConversationMessage: publicProcedure
        .input(z.object({
            conversationId: z.string().optional(),
            message: z.string(),
        }))
        .mutation(async ({
            ctx,
            input,
        }) => {
            let conversation: Conversation;

            if (input.conversationId) {
                const {
                    data: existingConversation,
                    error,
                } = await ctx.db
                    .from("conversations")
                    .select("*")
                    .eq("id", input.conversationId)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (!existingConversation) {
                    throw new Error("Conversation not found");
                }

                conversation = existingConversation;

                const {
                    // data: newUserMessage,
                    error: userMessageInsertError,
                } = await ctx.db
                    .from("messages")
                    .insert({
                        id: newId("message"),
                        content: input.message,
                        role: "user",
                        conversationId: conversation.id,
                        createdAt: new Date().toISOString(),
                    })
                    .select("*")
                    .maybeSingle();

                if (userMessageInsertError) {
                    throw new Error("error inserting user's message");
                };

                // userMessage = newUserMessage;
            } else {
                const {
                    data: newConversation,
                    error,
                } = await ctx.db
                    .from("conversations")
                    .insert({
                        id: newId("conversation"),
                        userId: "user_bFogjdS48x7XhYCzczv9JW",
                        systemPrompt,
                        initialUserPrompt: input.message,
                    })
                    .select("*")
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (!newConversation) {
                    throw new Error("Conversation not found");
                }

                conversation = newConversation;
            };

            const queryEmbedding = await generateEmbeddings(ctx.embedding, input.message);

            const {
                data: foundRelevantNotes,
                error,
            } = await ctx.db.rpc("match_note_embeddings", {
                query_embedding: JSON.stringify(queryEmbedding),
                match_count: 10,
            });

            const relevantNotes = foundRelevantNotes?.filter(note => note.similarity > 0.4)
                .sort((a, b) => b.similarity - a.similarity);

            if (error) {
                console.error(error);

                throw new Error("error calling match_note_embeddings supabase RPC function");
            }

            if (!relevantNotes) {
                throw new Error("no relevant notes found");
            }

            const context = relevantNotes.map((result) => result.content).join("\n\n");

            const {
                data: conversationMessages,
                error: getConversationMessagesError,
            } = await ctx.db
                .from("messages")
                .select("*")
                .eq("conversationId", conversation.id)
                .order("createdAt", { ascending: true })
                .limit(100);

            if (getConversationMessagesError) {
                throw new Error("error getting conversation messages");
            }

            const fullPrompt = `Answer the following question based on these notes:\n\n${input.message}\n\nNotes:\n${context}`;

            const history = conversationMessages.map((msg) => ({
                role: msg.role.replace("llm", "model"),
                parts: [
                    {
                        text: msg.content,
                    }
                ],
            }));

            const geminiResult = await ctx.gemini.generateContent(
                history.length > 0
                    ? {
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: conversation.initialUserPrompt,
                                    }
                                ],
                            },
                            ...history,
                        ]
                    }
                    : fullPrompt,
            );
            const responseText = geminiResult.response.text();

            const {
                data: llmMessage,
                error: llmMessageInsertError,
            } = await ctx.db
                .from("messages")
                .insert({
                    id: newId("message"),
                    content: responseText,
                    role: "llm",
                    conversationId: conversation.id,
                    createdAt: new Date().toISOString(),
                })
                .select("*")
                .maybeSingle();

            if (llmMessageInsertError) {
                throw new Error("error inserting llm's message");
            };

            if (!llmMessage) {
                throw new Error("error inserting llm's message");
            };

            const inserts = relevantNotes.map((note) => ({
                messageId: llmMessage.id,
                noteId: note.id,
            }));

            const { error: insertMessageRelevantNotesError } = await ctx.db
                .from("message_relevant_notes")
                .insert(inserts);

            if (insertMessageRelevantNotesError) {
                throw new Error("error inserting message relevant notes");
            };

            return {
                responseText,
                conversation,
                llmMessage: {
                    relevantNotes: relevantNotes.map(note => {
                        return {
                            id: note.id,
                            name: note.source,
                            content: note.content,
                        };
                    }),
                },
            };
        }),
    getById: publicProcedure
        .input(z.string())
        .query(async ({
            ctx,
            input: id,
        }) => {
            const {
                data: conversation,
                error,
            } = await ctx.db
                .from("conversations")
                .select("*, messages(*, message_relevant_notes(*, notes(*)))")
                .eq("id", id)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!conversation) {
                throw new Error("Conversation not found");
            };

            return {
                ...conversation,
                messages: conversation.messages.map((msg) => ({
                    ...msg,
                    relevantNotes: msg.message_relevant_notes.map(message_notes => message_notes.notes),
                })),
            };
        }),
    getAll: publicProcedure
        .query(async ({
            ctx,
        }) => {
            const {
                data: conversations,
                error,
            } = await ctx.db
                .from("conversations")
                .select("*")
                .order("createdAt", { ascending: false })
                .limit(100);

            if (error) {
                throw error;
            }

            if (!conversations) {
                throw new Error("Conversations not found");
            }

            return conversations;
        }),
});
