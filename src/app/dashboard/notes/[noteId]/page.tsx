import { api } from "~/trpc/server";
import NoteContent from "~/components/notes/NoteContent";
import { TRPCError } from "@trpc/server";

export default async function NotePage({
    params,
}: {
    params: Promise<{ noteId: string }>
}) {
    try {
        const note = await api.notes.getById((await params).noteId);

        return (
            <NoteContent note={note} />
        );
    } catch (error: unknown) {
        if (error instanceof TRPCError && error.code === "NOT_FOUND") {
            return <div className="flex flex-col justify-center items-center w-full h-full">Note not found</div>;
        } else {
            return <div className="flex flex-col justify-center items-center w-full h-full">Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
        }
    }
}