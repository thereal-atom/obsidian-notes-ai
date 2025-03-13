import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { generateEmbeddings } from "~/server/gemini/utils";
import { googleEmbeddingModel } from "~/server/gemini";
import { createClient } from "~/utils/supabase/server";

const formatTimestamp = (seconds: number): string => {
    const roundedSeconds = Math.round(seconds);

    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const remainingSeconds = roundedSeconds % 60;

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = remainingSeconds.toString().padStart(2, "0");

    return `[${hours > 1 ? `${hoursStr}:` : ""}${minutesStr}:${secondsStr}]`;
};

export const summarizeYoutubeVideo = protectedProcedure
    .input(z.object({
        videoId: z.string(),
    }))
    .query(async ({
        ctx,
        input
    }) => {
        const res = await fetch(`https://transcriptapi.com/api/v1/youtube/transcript?video_id=${input.videoId}&send_metadata=true`, {
            headers: {
                "Authorization": `Bearer ${process.env.YTTRANSCRIPT_API_KEY}`,
            },
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                });
            };

            throw new Error("Failed to fetch transcript");
        };

        const data = await res.json();
        const transcript = z.array(z.object({
            text: z.string(),
            start: z.number(),
            duration: z.number(),
        })).parse(data.transcript);

        const fullTranscriptString = transcript.reduce((acc, curr) => {
            return acc + curr.text + formatTimestamp(curr.start);
        }, "");

        const result = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: "You will be provided with a full transcript of a youtube video.\n" +
                "First include a concise summary of the overall video, or an introduction, in 1-2 paragraphs." +
                "Then, break down the video into sections, and write a 2-3 paragraph summary for each section. Make sure to highlight the key points." +
                "Finally, include a 1-2 paragraph summary." +
                "For each point, include the timestamp of where in the video you got that point from. If it is a quote taken directly from the video, use speech marks around it." +
                "In terms of formatting, make teach title a heading 1." +
                "Do not include any introductory phrases like 'Here's a breakdown' or references to following instructions—just provide the summary directly." +
                `\n\n${fullTranscriptString}`,
        });

        const summaryText = result.text;

        const supabase = await createClient();

        const summaryEmbedding = await generateEmbeddings(googleEmbeddingModel, summaryText);

        const {
            data: foundRelevantNotes,
            error: matchNoteEmbeddingsError,
        } = await supabase.rpc("match_note_embeddings", {
            query_embedding: JSON.stringify(summaryEmbedding),
            match_count: 10,
        });

        const relevantNotes = foundRelevantNotes?.filter(note => note.similarity > 0.4)
            .sort((a, b) => b.similarity - a.similarity);

        if (matchNoteEmbeddingsError) {
            console.error(matchNoteEmbeddingsError);

            throw new Error("error calling match_note_embeddings supabase RPC function");
        };

        if (!relevantNotes) {
            throw new Error("no relevant notes found");
        };

        const videoMetadata = z.object({
            title: z.string(),
            author_name: z.string(),
            author_url: z.string().url(),
            thumbnail_url: z.string().url(),
        }).safeParse(data.metadata).data;

        console.log(videoMetadata);

        return {
            summary: summaryText,
            transcript: fullTranscriptString,
            relevantNotes,
            videoMetadata: {
                ...videoMetadata,
                id: input.videoId,
            },
        };
    })