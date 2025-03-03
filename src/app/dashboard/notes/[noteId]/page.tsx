import { api } from "~/trpc/server";
import NotePageClient from "./NotePageClient";

export default async function NotePage({
    params,
}: {
    params: Promise<{ noteId: string }>
}) {
    const note = await api.notes.getById((await params).noteId);

    return (
        <NotePageClient note={note} />
    );
}