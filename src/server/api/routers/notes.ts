import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { newId } from "~/utils/id";

export const notesRouter = createTRPCRouter({
    getById: protectedProcedure
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
    getAll: protectedProcedure
        .input(z.object({ vaultId: z.string() }))
        .query(async ({
            ctx,
            input,
        }) => {
            const {
                data: notes,
                error,
            } = await ctx.db
                .from("notes")
                .select("*")
                .eq("vaultId", input.vaultId)
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
    uploadMultipleNotes: protectedProcedure
        .input(
            z.object({
                notes: z.array(
                    z.object({
                        name: z.string(),
                        content: z.string(),
                    })
                ),
                vaultId: z.string(),
            })
        )
        .mutation(async ({
            ctx,
            input,
        }) => {
            // todo: can only batch 100 at a time
            const embeddingResponse = await ctx.embedding.batchEmbedContents({
                requests: input.notes.map((note) => ({ content: { role: "user", parts: [{ text: note.content }] } })),
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
                .eq("vaultId", input.vaultId)
                .in("name", input.notes.map(note => note.name));

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
                    const name = input.notes[index]!.name;
                    const content = input.notes[index]!.content;

                    const existingNote = existingNotes.find(note => note.name === name);

                    return {
                        id: existingNote
                            ? existingNote.id
                            : newId("note"),
                        name,
                        content,
                        embedding: JSON.stringify(embedding),
                        vaultId: input.vaultId,
                    }
                }), {
                    onConflict: "name,vaultId",
                })
                .select("*");

            if (error) {
                console.error(error);

                throw new Error("error inserting notes");
            };

            return updatedNotes;
        })
})