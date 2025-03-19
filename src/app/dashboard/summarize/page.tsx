"use client";

import { useState } from "react";
// import Markdown from "@/components/Markdown";
// import ObsidianFileBadge from "@/components/ObsidianFileBadge";
// import { api } from "@/trpc/react";
import Image from "next/image";
import { api } from "~/lib/trpc/react";

// const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
//     return (
//         <div className="youtube-container">
//             <iframe
//                 width="560"
//                 height="315"
//                 src={`https://www.youtube.com/embed/${videoId}`}
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//             ></iframe>
//             <style jsx>{`
//           .youtube-container {
//             position: relative;
//             padding-bottom: 56.25%; /* 16:9 aspect ratio */
//             height: 0;
//             overflow: hidden;
//             max-width: 100%;
//           }
//           .youtube-container iframe {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//           }
//         `}</style>
//         </div>
//     );
// };

// const YoutubeSummarySection = () => {
//     const [videoId, setVideoId] = useState("");

//     const getSummaryQuery = api.learning.summarizeYoutubeVideo.useQuery({ videoId }, {
//         enabled: false,
//     });

//     const handleGetSummary = () => {
//         void getSummaryQuery.refetch();
//     };

//     return (
//         <div className="flex flex-col mt-8">
//             <h2 className="text-2xl font-bold">Summarize Youtube Video</h2>
//             <div className="flex flex-col mt-4">
//                 <input
//                     className="w-full p-3 bg-transparent border border-secondary/10 rounded-md"
//                     placeholder="Youtube Video ID"
//                     onChange={(e) => {
//                         setVideoId(e.target.value);
//                     }}
//                     type="text"
//                 />
//                 <button
//                     className="mt-4 py-3 bg-accent font-bold rounded-md disabled:opacity-50"
//                     onClick={handleGetSummary}
//                     disabled={getSummaryQuery.isLoading}
//                 >
//                     Summarize
//                 </button>
//                 <div className="mt-8">
//                     {getSummaryQuery.isLoading && <p>Loading summary...</p>}
//                     {getSummaryQuery.isError && <p>Error: {getSummaryQuery.error.message}</p>}
//                     {getSummaryQuery.data && <div>
//                         <YouTubeEmbed videoId={getSummaryQuery.data.videoMetadata.id} />
//                         <p className="font-semibold text-xl my-2">{getSummaryQuery.data.videoMetadata.title}</p>
//                         <Markdown videoId={getSummaryQuery.data.videoMetadata.id}>
//                             {getSummaryQuery.data.summary}
//                         </Markdown>
//                         <div className="flex flex-wrap mt-4">
//                             {getSummaryQuery.data.relevantNotes.map((note, noteIndex) => (
//                                 <ObsidianFileBadge
//                                     noteId={note.id}
//                                     noteName={note.source}
//                                     key={noteIndex}
//                                 />
//                             ))}
//                         </div>
//                     </div>}
//                 </div>
//             </div>
//         </div>
//     )
// };

// const PodcastSummarySection = () => {
//     const [transcript, setTranscript] = useState("");

//     return (
//         <div className="flex flex-col mt-8">
//             <h2 className="text-2xl font-bold">Summarize Podcast</h2>
//             <div className="flex flex-col mt-4">

//                 <textarea
//                     className="w-full p-3 bg-transparent border border-secondary/10 rounded-md"
//                     placeholder="Transcript"
//                     onChange={(e) => {
//                         setTranscript(e.target.value);
//                     }}
//                 ></textarea>
//                 <button
//                     className="mt-4 py-3 bg-accent font-bold rounded-md disabled:opacity-50"
//                 // onClick={handleGetSummary}
//                 // disabled={getSummaryQuery.isLoading}
//                 >
//                     Summarize
//                 </button>
//             </div>
//         </div>
//     )
// };

interface UploadSectionProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string | null;
    isUploading: boolean;
    onReset: () => void;
};

const UploadYoutubeSection = ({
    onChange,
    fileName,
    isUploading,
    onReset,
}: UploadSectionProps) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Youtube Video</h2>
            <p className="opacity-70">Upload video files or transcripts for YouTube content.</p>
            <div className="flex flex-col mt-8">
                <label
                    className="font-semibold"
                    htmlFor="youtube-video"
                >
                    Video File
                </label>
                <FileUploadButton
                    id="youtube-video"
                    accept=".mp4,.mov,.avi"
                    label="Upload Video"
                    icon={
                        <Image
                            className="mr-2"
                            src="/icons/filevideo.svg"
                            alt="Youtube Video File"
                            width={24}
                            height={24}
                        />
                    }
                    onChange={onChange}
                    fileName={fileName}
                    isUploading={isUploading}
                    onReset={onReset}
                />
                <p className="mt-2 text-sm opacity-70">Supported formats: MP4, MOV, AVI (max 2GB)</p>
            </div>
            <div className="flex flex-col mt-16">
                <label
                    className="font-semibold"
                    htmlFor="youtube-transcript"
                >
                    Transcript
                </label>
                <FileUploadButton
                    id="youtube-transcript"
                    accept=".txt,.srt,.vtt"
                    label="Upload Transcript"
                    icon={
                        <Image
                            className="mr-2"
                            src="/icons/filetext.svg"
                            alt="Youtube Transcript"
                            width={24}
                            height={24}
                        />
                    }
                    onChange={onChange}
                    fileName={fileName}
                    isUploading={isUploading}
                    onReset={onReset}
                />
                <p className="mt-2 text-sm opacity-70">Supported formats: TXT, SRT, VTT</p>
            </div>
        </div>
    )
};

const UploadPodcastSection = ({
    onChange,
    fileName,
    isUploading,
    onReset,
}: UploadSectionProps) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Podcast</h2>
            <p className="opacity-70">Upload audio files or transcripts for podcast content.</p>
            <div className="flex flex-col mt-8">
                <label
                    className="font-semibold"
                    htmlFor="podcast-audio"
                >
                    Audio File
                </label>
                <FileUploadButton
                    id="podcast-audio"
                    accept=".mp3,.wav,.m4a"
                    label="Upload Audio"
                    icon={
                        <Image
                            className="mr-2"
                            src="/icons/headphones.svg"
                            alt="Podcast Audio"
                            width={24}
                            height={24}
                        />
                    }
                    onChange={onChange}
                    fileName={fileName}
                    isUploading={isUploading}
                    onReset={onReset}
                />
                <p className="mt-2 text-sm opacity-70">Supported formats: MP3, WAV, M4A</p>
            </div>
            <div className="flex flex-col mt-16">
                <label
                    className="font-semibold"
                    htmlFor="podcast-transcript"
                >
                    Transcript
                </label>
                <FileUploadButton
                    id="podcast-transcript"
                    accept=".txt,.srt,.vtt"
                    label="Upload Transcript"
                    icon={
                        <Image
                            className="mr-2"
                            src="/icons/filetext.svg"
                            alt="Podcast Audio"
                            width={24}
                            height={24}
                        />
                    }
                    onChange={onChange}
                    fileName={fileName}
                    isUploading={isUploading}
                    onReset={onReset}
                />
                <p className="mt-2 text-sm opacity-70">Supported formats: TXT, SRT, VTT</p>
            </div>
        </div>
    )
};

const UploadPaperSection = ({
    onChange,
    fileName,
    isUploading,
    onReset,
}: UploadSectionProps) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Scientific Paper</h2>
            <p className="opacity-70">Upload a scientific paper.</p>
            <div className="flex flex-col mt-8">
                <label
                    className="font-semibold"
                    htmlFor="paper-pdf"
                >
                    PDF File
                </label>
                <FileUploadButton
                    id="paper-pdf"
                    accept=".pdf"
                    label="Upload PDF"
                    icon={
                        <Image
                            className="mr-2"
                            src="/icons/filetext.svg"
                            alt="PDF File"
                            width={24}
                            height={24}
                        />
                    }
                    onChange={onChange}
                    fileName={fileName}
                    isUploading={isUploading}
                    onReset={onReset}
                />
                <p className="mt-2 text-sm opacity-70">Supported formats: PDF</p>
            </div>
        </div>
    );
};

interface FileUploadButtonProps {
    id: string;
    accept: string;
    label: string;
    icon: React.ReactNode;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileName: string | null;
    isUploading: boolean;
    onReset: () => void;
};

function FileUploadButton({ id, accept, label, icon, onChange, fileName, isUploading, onReset }: FileUploadButtonProps) {
    return (
        <div className="relative">
            {!fileName ? (
                <label
                    htmlFor={id}
                    className="flex flex-row items-center justify-center py-2 mt-2 font-medium border border-secondary/10 rounded-md hover:bg-secondary/10 hover:border-transparent hover:cursor-pointer"
                >
                    {icon}
                    {label}
                    <input type="file" id={id} accept={accept} onChange={onChange} className="sr-only" />
                </label>
            ) : (
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <span className="truncate max-w-[80%]">{fileName}</span>
                    {isUploading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                        <button className="h-4 w-4 p-0" onClick={onReset}>
                            <p>X</p>
                            <span className="sr-only">Remove file</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}


export default function SummarizePage() {
    const [activeTab, setTab] = useState<"youtube" | "podcast" | "paper">("youtube");

    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);

    const {
        mutate: summarizeMutate,
    } = api.learning.summarize.useMutation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFileName(file.name)
            // setIsUploading(true)
            // setTimeout(() => {
            //     setIsUploading(false)
            // }, 2000)

            const formData = new FormData();
            formData.append("file", file);

            summarizeMutate(formData);


            // const reader = new FileReader();
            // reader.onload = (event) => {
            //     if (event.target && typeof event.target.result === "string") {
            //         console.log(event.target?.result);
            //         // setFileContent(event.target?.result as ArrayBuffer);
            //     }
            // };
            // reader.readAsDataURL(file);
        }
    }

    const resetFileInput = () => {
        setFileName(null)
    }

    return (
        <div className="flex flex-col h-full p-16 overflow-y-scroll">
            <h1 className="text-3xl font-bold">Summarize</h1>
            {/* <div className="flex flex-row my-4 w-full">
                <button
                    className={`w-full px-8 py-3 font-bold rounded-l-md ${activeTab === "youtube" ? "bg-accent" : "bg-transparent border-y border-l border-secondary/10"}`}
                    onClick={() => setTab("youtube")}
                >
                    Youtube
                </button>
                <button
                    className={`w-full px-8 py-3 font-bold rounded-r-md ${activeTab === "podcast" ? "bg-accent" : "bg-transparent border-y border-r border-secondary/10"}`}
                    onClick={() => setTab("podcast")}
                >
                    Podcast
                </button>
            </div> */}
            {/* {activeTab === "youtube"
                ? <YoutubeSummarySection />
                : activeTab === "podcast"
                    ? <PodcastSummarySection />
                    : <p>invalid tab</p>} */}

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center w-full mt-8">
                    <div className="flex flex-row w-full p-1 bg-secondary/5 rounded-md">
                        <button
                            className={`flex flex-row items-center justify-center w-full py-2 ${activeTab === "youtube" ? "bg-primary text-white" : "text-white/80"} font-semibold rounded-md transition-colors`}
                            onClick={() => setTab("youtube")}
                        >
                            <Image
                                className="mr-2"
                                src="/icons/youtube.svg"
                                alt="Youtube"
                                width={24}
                                height={24}
                            />
                            Youtube Video
                        </button>
                        <button
                            className={`flex flex-row items-center justify-center w-full py-2 ${activeTab === "podcast" ? "bg-primary text-white" : "text-white/80"} font-semibold rounded-md transition-colors`}
                            onClick={() => setTab("podcast")}
                        >
                            <Image
                                className="mr-2"
                                src="/icons/headphones.svg"
                                alt="Headphones"
                                width={24}
                                height={24}
                            />
                            Podcast
                        </button>
                        <button
                            className={`flex flex-row items-center justify-center w-full py-2 ${activeTab === "paper" ? "bg-primary text-white" : "text-white/80"} font-semibold rounded-md transition-colors`}
                            onClick={() => setTab("paper")}
                        >
                            <Image
                                className="mr-2"
                                src="/icons/filetext.svg"
                                alt="Text File"
                                width={24}
                                height={24}
                            />
                            Scientific Paper
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-full mt-4 p-8 border border-secondary/10 rounded-md">
                    {activeTab === "youtube" && <UploadYoutubeSection
                        fileName={fileName}
                        isUploading={isUploading}
                        onChange={handleFileChange}
                        onReset={resetFileInput}
                    />}
                    {activeTab === "podcast" && <UploadPodcastSection
                        fileName={fileName}
                        isUploading={isUploading}
                        onChange={handleFileChange}
                        onReset={resetFileInput}
                    />}
                    {activeTab === "paper" && <UploadPaperSection
                        fileName={fileName}
                        isUploading={isUploading}
                        onChange={handleFileChange}
                        onReset={resetFileInput}
                    />}
                </div>

                <button className="w-full py-2 mt-4 font-semibold bg-accent rounded-md">
                    Summarize
                    {activeTab === "youtube" && " Youtube Video"}
                    {activeTab === "podcast" && " Podcast"}
                    {activeTab === "paper" && " Paper"}
                </button>
            </div>
        </div>
    )
}