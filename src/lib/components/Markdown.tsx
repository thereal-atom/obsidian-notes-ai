import type { Note } from "@/server/supabase";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const replaceTimestampsWithLinks = (markdownString: string, videoId: string): string => {
    const timestampRegex = /\[(\d{2}):(\d{2}):(\d{2})\]/g;

    return markdownString.replace(timestampRegex, (match, hours: string, minutes: string, seconds: string) => {
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

        return `[${match}](https://youtube.com/watch?v=${videoId}&t=${totalSeconds}s)`;
    });
};

const replaceNotelinks = (markdownString: string) => {
    return markdownString.replace(/\[\[(.+?)\.md\]\]/g, (_, noteName) => {
        return `[${noteName}](${window.location.origin}/dashboard/notes/${encodeURIComponent((noteName as string).toString())}?isNoteLink=true)`;
    })
};

export default function Markdown({
    parseNoteLinks = false,
    notes,
    videoId,
    children,
}: {
    parseNoteLinks?: boolean;
    notes?: Note[];
    videoId?: string;
    children: string;
}) {
    return (
        <div className="markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: (props) => {
                        if (!parseNoteLinks) return <a {...props} target="_blank">{props.children}</a>;

                        const isNoteLink = typeof props.children === "string" && props.href?.endsWith("?isNoteLink=true");
                        const noteName = props.href?.split("/").pop()?.replace("?isNoteLink=true", "") ?? "";
                        const note = notes?.find(note => note.name === `${decodeURI(noteName)}.md`);
                        const href = note ? `/dashboard/notes/${note.id}` : props.href;

                        return <a {...props} href={href} target="_blank">
                            {isNoteLink && typeof props.children === "string"
                                ? <span className="h-6 font-mono rounded-md">
                                    {props.children.toString()}.md
                                </span>
                                : props.children}
                        </a>;
                    }
                }}
            >
                {replaceTimestampsWithLinks(replaceNotelinks(children), videoId ?? "")}
            </ReactMarkdown>
        </div>
    );
};