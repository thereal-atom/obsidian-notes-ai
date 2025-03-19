import { createTRPCRouter } from "@/server/api/trpc";
import { createConversationProcedure, getAllConversationsProcedure, getConversationByIdProcedure, saveConversationMessageProcedure } from "./procedures";

export const conversationsRouter = createTRPCRouter({
    create: createConversationProcedure,
    getById: getConversationByIdProcedure,
    getAll: getAllConversationsProcedure,
    saveMessage: saveConversationMessageProcedure,
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
