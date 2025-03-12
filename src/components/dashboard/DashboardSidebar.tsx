"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardStore } from "~/store/dashboard-store";
import Image from "next/image";
import { useState } from "react";

export default function DashboardSidebar({ user }: {
    user: User,
}) {
    const pathname = usePathname();

    const conversations = useDashboardStore(state => state.conversations);
    const notes = useDashboardStore(state => state.notes);
    const vaults = useDashboardStore(state => state.vaults);
    const activeVault = useDashboardStore(state => state.activeVault);

    const [isNotesSectionExpanded, setIsNotesSectionExpanded] = useState(false);

    if (!conversations || !notes || !vaults) {
        return <div className="flex flex-col h-full p-6">loading...</div>;
    }

    return (
        <div className="w-[300px] min-w-[300px] h-screen max-h-screen border-r border-[#c3c3ff33]">
            <div className="flex flex-col h-full">
                <div className="flex flex-col h-full p-6 overflow-y-scroll">
                    <div className="flex flex-col">
                        <Link
                            className="text-xl font-bold"
                            href="/dashboard/chats"
                        >
                            Chats
                        </Link>
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
                    </div>
                    <div className="flex flex-col mt-8">
                        <div className="flex flex-row">
                            {/* <button
                                className="font-bold"
                                onClick={() => setIsNotesSectionExpanded(!isNotesSectionExpanded)}
                            >
                                {isNotesSectionExpanded ? "▼" : "►"}
                            </button> */}
                            <Link
                                className="text-xl font-bold"
                                href="/dashboard/notes"
                            >
                                Notes
                            </Link>
                        </div>
                        <div className="flex flex-col mt-6">
                            {isNotesSectionExpanded && notes.map((note, index) => (
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
                    <Link
                        className="text-xl font-bold"
                        href="/dashboard/summarize"
                    >
                        Summarize
                    </Link>
                </div>
                <div className="flex flex-row items-center w-full p-4 border-t border-[#c3c3ff33]">
                    <Link
                        className=""
                        href="/dashboard/account"
                    >
                        <div className="p-2 bg-[#c3c3ff11] rounded-md">
                            <Image
                                width={24}
                                height={24}
                                src="/user-icon.svg"
                                alt={user.email ?? ""}
                            />
                        </div>
                    </Link>
                    <div className="flex flex-col ml-4">
                        <a
                            className="font-bold"
                            href="/dashboard/vaults"
                        >
                            Vaults
                        </a>
                        <p className="text-sm font-medium">Active: {activeVault?.name}</p>
                    </div>
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