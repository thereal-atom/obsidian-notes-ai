import { createTRPCRouter } from "~/server/api/trpc";
import { createConversationProcedure, getAllConversationsProcedure, getConversationByIdProcedure, saveConversationMessageProcedure } from "./procedures";

export const conversationsRouter = createTRPCRouter({
    create: createConversationProcedure,
    getById: getConversationByIdProcedure,
    getAll: getAllConversationsProcedure,
    saveMessage: saveConversationMessageProcedure,
    // sendConversationMessage: protectedProcedure
    //     .input(z.object({
    //         conversationId: z.string().optional(),
    //         vaultId: z.string().optional(),
    //         message: z.string(),
    //     }))
    //     .mutation(async ({
    //         ctx,
    //         input,
    //     }) => {
    //         let conversation: Conversation;

    //         if (input.conversationId) {
    //             const {
    //                 data: existingConversation,
    //                 error,
    //             } = await ctx.db
    //                 .from("conversations")
    //                 .select("*")
    //                 .eq("id", input.conversationId)
    //                 .maybeSingle();

    //             if (error) {
    //                 throw error;
    //             }

    //             if (!existingConversation) {
    //                 throw new Error("Conversation not found");
    //             }

    //             conversation = existingConversation;

    //             const {
    //                 // data: newUserMessage,
    //                 error: userMessageInsertError,
    //             } = await ctx.db
    //                 .from("messages")
    //                 .insert({
    //                     id: newId("message"),
    //                     content: input.message,
    //                     role: "user",
    //                     conversationId: conversation.id,
    //                     vaultId: conversation.vaultId,
    //                     createdAt: new Date().toISOString(),
    //                 })
    //                 .select("*")
    //                 .maybeSingle();

    //             if (userMessageInsertError) {
    //                 throw new Error("error inserting user's message");
    //             };

    //             // userMessage = newUserMessage;
    //         } else {
    //             if (!input.vaultId) {
    //                 throw new Error("vaultId required when creating a new conversation. provide a vaultId, or an id for an existing conversation.");
    //             };

    //             const {
    //                 data: newConversation,
    //                 error,
    //             } = await ctx.db
    //                 .from("conversations")
    //                 .insert({
    //                     id: newId("conversation"),
    //                     vaultId: input.vaultId,
    //                     systemPrompt,
    //                     initialUserPrompt: input.message,
    //                 })
    //                 .select("*")
    //                 .maybeSingle();

    //             if (error) {
    //                 throw error;
    //             }

    //             if (!newConversation) {
    //                 throw new Error("Conversation not found");
    //             }

    //             conversation = newConversation;
    //         };

    //         const queryEmbedding = await generateEmbeddings(ctx.embedding, input.message);

    //         const {
    //             data: foundRelevantNotes,
    //             error,
    //         } = await ctx.db.rpc("match_note_embeddings", {
    //             query_embedding: JSON.stringify(queryEmbedding),
    //             match_count: 10,
    //         });

    //         const relevantNotes = foundRelevantNotes?.filter(note => note.similarity > 0.4)
    //             .sort((a, b) => b.similarity - a.similarity);

    //         if (error) {
    //             console.error(error);

    //             throw new Error("error calling match_note_embeddings supabase RPC function");
    //         }

    //         if (!relevantNotes) {
    //             throw new Error("no relevant notes found");
    //         }

    //         const context = relevantNotes.map((result) => `identifier: [[${result.source}]]\n\n${result.content}`).join("\n\n");

    //         const {
    //             data: conversationMessages,
    //             error: getConversationMessagesError,
    //         } = await ctx.db
    //             .from("messages")
    //             .select("*")
    //             .eq("conversationId", conversation.id)
    //             .order("createdAt", { ascending: true })
    //             .limit(100);

    //         if (getConversationMessagesError) {
    //             throw new Error("error getting conversation messages");
    //         }

    //         const fullPrompt = `Answer the following question based on these notes:\n\n${input.message}\n\nNotes:\n${context}`;

    //         const history = conversationMessages.map((msg) => ({
    //             role: msg.role.replace("llm", "model"),
    //             parts: [
    //                 {
    //                     text: msg.content,
    //                 }
    //             ],
    //         }));

    //         const geminiResult = await ctx.gemini.generateContent(
    //             history.length > 0
    //                 ? {
    //                     contents: [
    //                         {
    //                             role: "user",
    //                             parts: [
    //                                 {
    //                                     text: conversation.initialUserPrompt,
    //                                 }
    //                             ],
    //                         },
    //                         ...history,
    //                     ]
    //                 }
    //                 : fullPrompt,
    //         );
    //         const responseText = geminiResult.response.text();

    //         const {
    //             data: llmMessage,
    //             error: llmMessageInsertError,
    //         } = await ctx.db
    //             .from("messages")
    //             .insert({
    //                 id: newId("message"),
    //                 content: responseText,
    //                 role: "llm",
    //                 conversationId: conversation.id,
    //                 createdAt: new Date().toISOString(),
    //             })
    //             .select("*")
    //             .maybeSingle();

    //         if (llmMessageInsertError) {
    //             throw new Error("error inserting llm's message");
    //         };

    //         if (!llmMessage) {
    //             throw new Error("error inserting llm's message");
    //         };

    //         const inserts = relevantNotes.map((note) => ({
    //             messageId: llmMessage.id,
    //             noteId: note.id,
    //         }));

    //         const { error: insertMessageRelevantNotesError } = await ctx.db
    //             .from("message_relevant_notes")
    //             .insert(inserts);

    //         if (insertMessageRelevantNotesError) {
    //             console.error(insertMessageRelevantNotesError);

    //             throw new Error("error inserting message relevant notes");
    //         };

    //         return {
    //             responseText,
    //             conversation,
    //             llmMessage: {
    //                 relevantNotes: relevantNotes.map(note => {
    //                     return {
    //                         id: note.id,
    //                         name: note.source,
    //                         content: note.content,
    //                     };
    //                 }),
    //             },
    //         };
    //     }),
});
