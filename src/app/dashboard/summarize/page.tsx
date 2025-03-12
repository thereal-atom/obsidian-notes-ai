"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function SummarizePage() {
    const [videoId, setVideoId] = useState("");

    const getSummaryQuery = api.learning.summarizeYoutubeVideo.useQuery({ videoId }, {
        enabled: false,
    });

    const handleGetSummary = () => {
        void getSummaryQuery.refetch();
    };

    return (
        <div className="p-16">
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
                        {getSummaryQuery.data && <div>{getSummaryQuery.data}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}