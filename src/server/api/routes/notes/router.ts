import { TRPCError } from "@trpc/server";
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
            const note = await ctx.prisma.notes.findFirst({
                where: {
                    id: id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            if (!note) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Note not found",
                });
            }

            return note;
        }),
    getAll: protectedProcedure
        .input(z.object({ vaultId: z.string() }))
        .query(async ({
            ctx,
            input,
        }) => {
            const notes = await ctx.prisma.notes.findMany({
                where: {
                    vaultId: input.vaultId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 100,
            });

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

            const existingNotes = await ctx.prisma.notes.findMany({
                where: {
                    vaultId: input.vaultId,
                    name: {
                        in: input.notes.map(note => note.name),
                    },
                },
            });

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

            return updatedNotes.map(note => {
                return {
                    ...note,
                    createdAt: new Date(note.createdAt),
                };
            });
        })
})