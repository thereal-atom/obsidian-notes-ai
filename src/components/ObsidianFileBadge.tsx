import Image from "next/image";
import Link from "next/link";

export default function ObsidianFileBadge({
    noteId,
    noteName,
}: {
    noteId?: string;
    noteName: string;
}) {
    return (
        <Link
            className="flex flex-row items-center mr-2 mb-2 pr-3 pl-2 py-2 bg-[#0F0F0F] rounded-md"
            href={noteId ? `/dashboard/notes/${noteId}` : "/dashboard/notes"}
        >
            <Image
                src="/obsidian-icon.svg"
                alt="Obsidian icon"
                width={16}
                height={16}
            />
            <p className="ml-1 text-xs font-medium">{noteName}</p>
        </Link>
    );
}