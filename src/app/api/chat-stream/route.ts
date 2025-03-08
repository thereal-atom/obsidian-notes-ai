import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";
import { prisma } from "~/server/api/trpc";
import { googleEmbeddingModel } from "~/server/gemini";
import { generateEmbeddings } from "~/server/gemini/utils";
import { createClient } from "~/utils/supabase/server";

export const maxDuration = 30;

export const POST = async (req: Request) => {
    const requestData = await req.json();

    const {
        data,
        error,
    } = z.object({
        prompt: z.string(),
        conversationId: z.string().optional(),
        vaultId: z.string().optional(),
    }).safeParse(requestData);

    if (!data || error) {
        return new Response("Invalid request data", { status: 400 });
    };

    const supabase = await createClient();

    const conversation = await prisma.conversations.findFirst({
        where: {
            id: data.conversationId,
        },
    });

    if (!conversation) {
        return new Response("Conversation not found", { status: 400 });
    };

    const queryEmbedding = await generateEmbeddings(googleEmbeddingModel, data.prompt);

    const {
        data: foundRelevantNotes,
        error: matchNoteEmbeddingsError,
    } = await supabase.rpc("match_note_embeddings", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_count: 10,
    });

    const relevantNotes = foundRelevantNotes?.filter(note => note.similarity > 0.4)
        .sort((a, b) => b.similarity - a.similarity);

    if (matchNoteEmbeddingsError) {
        console.error(matchNoteEmbeddingsError);

        throw new Error("error calling match_note_embeddings supabase RPC function");
    }

    if (!relevantNotes) {
        throw new Error("no relevant notes found");
    }

    const context = relevantNotes.map((result) => `identifier: [[${result.source}]]\n\n${result.content}`).join("\n\n");

    const conversationMessages = await prisma.messages.findMany({
        where: {
            conversationId: conversation.id,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!conversationMessages) {
        throw new Error("error getting conversation messages");
    };

    const fullPrompt = `Answer the following question based on these notes:\n\n${data.prompt}\n\nNotes:\n${context}`;

    const result = streamText({
        model: google("gemini-2.0-flash-001"),
        messages: [
            ...conversationMessages.map((msg) => ({
                role: msg.role.replace("llm", "assistant") as "assistant" | "user",
                content: msg.content,
            })),
            {
                role: "user",
                content: fullPrompt,
            }
        ],
    });

    return result.toDataStreamResponse();
}