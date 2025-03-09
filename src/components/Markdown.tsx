import type { Note } from "~/server/supabase";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({
    children,
    parseNoteLinks = false,
    notes,
}: {
    children: string;
    parseNoteLinks?: boolean;
    notes?: Note[];
}) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                a: (props) => {
                    if (!parseNoteLinks) return <a {...props}>{props.children}</a>;

                    const isNoteLink = typeof props.children === "string" && props.href?.endsWith("?isNoteLink=true");
                    const noteName = props.href?.split("/").pop()?.replace("?isNoteLink=true", "") ?? "";
                    const note = notes?.find(note => note.name === `${decodeURI(noteName)}.md`);
                    const href = note ? `/dashboard/notes/${note.id}` : props.href;

                    return <a {...props} href={href}>
                        {isNoteLink && typeof props.children === "string"
                            ? <span className="h-6 font-mono rounded-md">
                                {props.children.toString()}.md
                            </span>
                            : props.children}
                    </a>;
                }
            }}
        >
            {children.replace(/\[\[(.+?)\.md\]\]/g, (_, noteName) => {
                return `[${noteName}](${window.location.origin}/dashboard/notes/${encodeURIComponent((noteName as string).toString())}?isNoteLink=true)`;
            })}
        </ReactMarkdown>
    );
};