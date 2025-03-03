import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { newId } from "~/utils/id";

export const notesRouter = createTRPCRouter({
    getById: publicProcedure
        .input(z.string())
        .query(async ({
            ctx,
            input: id,
        }) => {
            const {
                data: note,
                error,
            } = await ctx.db
                .from("notes")
                .select("*")
                .eq("id", id)
                .order("createdAt", { ascending: false })
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!note) {
                throw new Error("Note not found");
            }

            return note;
        }),
    getAll: publicProcedure
        .query(async ({
            ctx,
        }) => {
            const {
                data: notes,
                error,
            } = await ctx.db
                .from("notes")
                .select("*")
                .order("createdAt", { ascending: false })
                .limit(100);

            if (error) {
                throw error;
            }

            if (!notes) {
                throw new Error("Notes not found");
            }

            return notes;
        }),
    uploadMultipleNotes: publicProcedure
        .input(
            z.array(
                z.object({
                    name: z.string(),
                    content: z.string(),
                })
            )
        )
        .mutation(async ({
            ctx,
            input,
        }) => {
            // todo: can only batch 100 at a time
            const embeddingResponse = await ctx.embedding.batchEmbedContents({
                requests: input.map((note) => ({ content: { role: "user", parts: [{ text: note.content }] } })),
            });

            const embeddings = embeddingResponse.embeddings.map(
                (embedding) => embedding.values
            );

            const {
                data: existingNotes,
                error: getExistingNotesError,
            } = await ctx.db
                .from("notes")
                .select("*")
                .in("name", input.map(note => note.name));

            if (getExistingNotesError) {
                console.error(getExistingNotesError);

                throw new Error("error getting existing notes");
            };

            const {
                data: updatedNotes,
                error,
            } = await ctx.db
                .from("notes")
                .upsert(embeddings.map((embedding, index) => {
                    const name = input[index]!.name;
                    const content = input[index]!.content;

                    const existingNote = existingNotes.find(note => note.name === name);

                    return {
                        id: existingNote ? existingNote.id : newId("note"),
                        name,
                        content,
                        embedding: JSON.stringify(embedding),
                        userId: "user_bFogjdS48x7XhYCzczv9JW",
                    }
                }), {
                    onConflict: "name,userId",
                })
                .select("*");

            if (error) {
                console.error(error);

                throw new Error("error inserting notes");
            };

            return updatedNotes;
        })
})