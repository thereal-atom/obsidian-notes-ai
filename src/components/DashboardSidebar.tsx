"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardStore } from "~/store/dashboard-store";

export default function DashboardSidebar() {
    const pathname = usePathname();

    const conversations = useDashboardStore(state => state.conversations);
    const notes = useDashboardStore(state => state.notes);

    if (!conversations || !notes) return <div>Loading...</div>;

    return (
        <div className="w-[300px] h-screen p-6 border-r border-[#c3c3ff33] overflow-y-scroll">
            <div className="">
                <Link
                    className="text-xl font-bold"
                    href="/dashboard/chats"
                >
                    Chats
                </Link>
            </div>
            <div className="flex flex-col my-6">
                {conversations.map((conversation, index) => (
                    <SidebarLink
                        href={`/dashboard/chats/${conversation.id}`}
                        isActive={pathname.includes(`/dashboard/chats/${conversation.id}`)}
                        key={index}
                    >
                        {conversation.initialUserPrompt}
                    </SidebarLink>
                ))}
            </div>
            <div className="flex flex-col mt-8">
                <Link
                    className="text-xl font-bold"
                    href="/dashboard/notes"
                >
                    Notes
                </Link>
                <div className="flex flex-col mt-6">
                    {notes.map((note, index) => (
                        <SidebarLink
                            href={`/dashboard/notes/${note.id}`}
                            isActive={pathname.includes(`/dashboard/notes/${note.id}`)}
                            key={index}
                        >
                            {note.name}
                        </SidebarLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

function SidebarLink({
    href,
    isActive,
    children,
}: {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            className={`mb-2 px-3 py-2 ${isActive ? "bg-[#c3c3ff22] border border-[#c3c3ff33]" : ""} font-semibold truncate rounded-md hover:bg-[#c3c3ff11] transition-all`}
            href={href}
        >
            {children}
        </Link>
    );
}