"use client";

import Image from "next/image";
import { useState } from "react";
import Markdown from "~/components/Markdown";
import ObsidianFileBadge from "~/components/ObsidianFileBadge";
import { api } from "~/trpc/react";

// components/YouTubeEmbed.jsx
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
    return (
        <div className="youtube-container">
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            <style jsx>{`
          .youtube-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
            max-width: 100%;
          }
          .youtube-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
        </div>
    );
};

export default function SummarizePage() {
    const [videoId, setVideoId] = useState("");

    const getSummaryQuery = api.learning.summarizeYoutubeVideo.useQuery({ videoId }, {
        enabled: false,
    });

    const handleGetSummary = () => {
        void getSummaryQuery.refetch();
    };

    return (
        <div className="flex flex-col h-full p-16 overflow-y-scroll">
            <h1 className="text-3xl font-bold">Summarize</h1>
            {/* <p>youtube, articles, tweets</p> */}

            <div className="flex flex-col mt-8">
                <h2 className="text-2xl font-bold">Summarize Youtube Video</h2>
                <div className="flex flex-col mt-4">
                    <input
                        className="w-full p-3 bg-transparent border border-secondary/10 rounded-md"
                        placeholder="Youtube Video ID"
                        onChange={(e) => {
                            setVideoId(e.target.value);
                        }}
                        type="text"
                    />
                    <button
                        className="mt-4 py-3 bg-accent font-bold rounded-md disabled:opacity-50"
                        onClick={handleGetSummary}
                        disabled={getSummaryQuery.isLoading}
                    >
                        Summarize
                    </button>
                    <div className="mt-8">
                        {getSummaryQuery.isLoading && <p>Loading summary...</p>}
                        {getSummaryQuery.isError && <p>Error: {getSummaryQuery.error.message}</p>}
                        {getSummaryQuery.data && <div>
                            <YouTubeEmbed videoId={getSummaryQuery.data.videoMetadata.id} />
                            <Markdown>
                                {getSummaryQuery.data.summary}
                            </Markdown>
                            <div className="flex flex-wrap mt-4">
                                {getSummaryQuery.data.relevantNotes.map((note, noteIndex) => (
                                    <ObsidianFileBadge
                                        noteId={note.id}
                                        noteName={note.source}
                                        key={noteIndex}
                                    />
                                ))}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}