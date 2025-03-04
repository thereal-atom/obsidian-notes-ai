// import { googleGeminiModel } from "~/server/gemini"
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";

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

    const { prompt } = data;

    /**
     * todo:
     * generate embeddings
     * find relevant notes
     * add as context to prompt
     * prefix/add system prompt
     * fetch conversation history and add to prompt
     * insert message relevant notes into database
     */

    const result = streamText({
        model: google("gemini-2.0-flash-001"),
        prompt,
    });

    return result.toDataStreamResponse();
}