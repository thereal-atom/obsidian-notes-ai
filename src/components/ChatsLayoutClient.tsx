"use client";

import type { Conversation, Note, Vault } from "~/server/supabase";
import { useDashboardStore } from "~/store/dashboard-store";
import { useEffect } from "react";

interface ChatsLayoutClientProps {
    conversations: Conversation[];
    notes: Note[];
    vaults: Vault[];
    children: React.ReactNode;
}

export default function ChatsLayoutClient({ conversations, notes, vaults, children }: ChatsLayoutClientProps) {
    const setConversations = useDashboardStore(state => state.setConversations);
    const setNotes = useDashboardStore(state => state.setNotes);
    const setVaults = useDashboardStore(state => state.setVaults);

    useEffect(() => {
        setConversations(conversations);
        setNotes(notes);
        setVaults(vaults);
    }, [conversations, notes, setConversations, setNotes, vaults, setVaults]);

    return <>{children}</>;
}