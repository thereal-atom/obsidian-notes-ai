import type { GenerativeModel } from "@google/generative-ai";

export const generateEmbeddings = async (embeddingModel: GenerativeModel, text: string) => {
    const result = await embeddingModel.embedContent(text);

    return result.embedding.values;
};