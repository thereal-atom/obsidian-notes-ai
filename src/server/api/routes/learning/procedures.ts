import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

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
            return acc + curr.text;
        }, "");

        const result = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Summarize the following transcript from a youtube video:\n\n${fullTranscriptString}`,
        });

        const summaryText = result.text;

        // TODO: include relevant notes?
        // generate embeddings for summary
        // search notes from these embeddings
        // return relevant notes.

        return summaryText;
    })