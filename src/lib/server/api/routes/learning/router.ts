import { createTRPCRouter } from "../../trpc";
import { summarize, summarizeYoutubeVideo } from "./procedures";

export const learningRouter = createTRPCRouter({
    summarizeYoutubeVideo,
    summarize,
});