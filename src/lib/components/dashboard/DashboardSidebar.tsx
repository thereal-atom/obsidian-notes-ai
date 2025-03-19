"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDashboardStore } from "@/stores/dashboard-store";
import Image from "next/image";
import { useState } from "react";

export default function DashboardSidebar({ user }: {
    user: User,
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const pathname = usePathname();

    const conversations = useDashboardStore(state => state.conversations);
    const notes = useDashboardStore(state => state.notes);
    const vaults = useDashboardStore(state => state.vaults);
    const activeVault = useDashboardStore(state => state.activeVault);

    if (!conversations || !notes || !vaults) {
        return <div className="flex flex-col h-full p-6">loading...</div>;
    }

    return (
        isExpanded ? <div className="w-[300px] min-w-[300px] h-screen max-h-screen border-r border-[#c3c3ff33]">
            <div className="flex flex-col h-full">
                <div className="flex flex-row items-center justify-between w-full p-4 border-b border-[#c3c3ff33]">
                    <div className="flex flex-row items-center">
                        <Image
                            src="/logo.png"
                            alt="Obsidian"
                            width={24}
                            height={24}
                        />
                        <p className="font font-bold text-lg ml-2">Notes AI</p>
                    </div>
                    <button onClick={() => setIsExpanded(false)}>
                        <Image
                            className="opacity-70"
                            src="/icons/collapse-horizontal.svg"
                            alt="Collapse"
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
                <div className="flex flex-col h-full pl-3 pr-6 py-6 overflow-y-scroll">
                    <div className="flex flex-col">
                        <SidebarLink
                            href="/dashboard/notes"
                            isActive={pathname.includes("/dashboard/notes")}
                        >
                            <Image
                                src="/icons/notes.svg"
                                alt="Notes"
                                width={20}
                                height={20}
                            />
                            <p className="font-semibold ml-2">Notes</p>
                        </SidebarLink>
                        <SidebarLink
                            href="/dashboard/summarize"
                            isActive={pathname.includes("/dashboard/summarize")}
                        >
                            <Image
                                src="/icons/summarize.svg"
                                alt="Summarize"
                                width={20}
                                height={20}
                            />
                            <p className="font-semibold ml-2">Summarize</p>
                        </SidebarLink>
                    </div>
                    <hr className="w-full bg-secondary/10 border-none h-[1px] my-4" />
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-between px-3">
                            <p className="text-sm font-medium opacity-70">Recent Chats</p>
                            <Link
                                className="text-xl font-medium"
                                href="/dashboard/chats"
                            >
                                +
                            </Link>
                        </div>
                        <div className="flex flex-col my-6">
                            {conversations.map((conversation, index) => (
                                <SidebarLink
                                    href={`/dashboard/chats/${conversation.id}`}
                                    isActive={pathname.includes(`/dashboard/chats/${conversation.id}`)}
                                    key={index}
                                >
                                    <Image
                                        src="/icons/conversation.svg"
                                        alt="Conversation"
                                        width={20}
                                        height={20}
                                    />
                                    <p className="ml-2">{conversation.initialUserPrompt}</p>
                                </SidebarLink>
                            ))}
                        </div>
                    </div>
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
        </div> : <div className="absolute left-0 top-0 flex flex-col p-6">
            <button onClick={() => setIsExpanded(true)}>
                <Image
                    className="opacity-70"
                    src="/icons/expand-horizontal.svg"
                    alt="Expand"
                    width={24}
                    height={24}
                />
            </button>
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
            className={`flex flex-row mb-2 px-3 py-2 ${isActive ? "bg-[#c3c3ff22] border border-[#c3c3ff33]" : ""} font-semibold text-sm truncate rounded-md hover:bg-[#c3c3ff11] transition-all`}
            href={href}
        >
            {children}
        </Link>
    );
}