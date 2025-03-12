import { createTRPCRouter } from "../../trpc";
import { summarizeYoutubeVideo } from "./procedures";

export const learningRouter = createTRPCRouter({
    summarizeYoutubeVideo: summarizeYoutubeVideo,
});