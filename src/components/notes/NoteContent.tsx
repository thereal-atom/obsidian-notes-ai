"use client";

import type { Note } from "~/server/supabase";
import { useEffect, useState } from "react";
import { useDashboardStore } from "~/store/dashboard-store";
import Markdown from "../Markdown";

export default function NoteContent({
    note,
}: {
    note: Note;
}) {
    const [contentWithPlaceholders, setContentWithPlaceholders] = useState("");

    const notes = useDashboardStore(state => state.notes);

    useEffect(() => {
        let content = note.content;
        const noteNames = (content.match(/\[\[(.*?)\]\]/g) ?? []).map((match) =>
            match.slice(2, -2)
        );

        if (notes) {
            noteNames.forEach((name) => {
                const note = notes?.find(note => note.name === `${name}.md`);

                if (note) {
                    content = content.replace(
                        `[[${name}]]`,
                        `[${name}.md](/dashboard/notes/${note?.id})`
                    );
                }
            });
        };

        setContentWithPlaceholders(content);
    }, [note, notes]);

    return (
        <div className="flex flex-col h-full p-16 overflow-y-scroll">
            <h1 className="font-bold text-3xl">{note.name}</h1>
            <div className="flex flex-col markdown">
                <Markdown
                    parseNoteLinks={true}
                    notes={notes ?? undefined}
                >
                    {contentWithPlaceholders}
                </Markdown>
            </div>
        </div>
    );
}