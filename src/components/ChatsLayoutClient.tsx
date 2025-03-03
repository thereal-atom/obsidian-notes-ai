"use client";

import type { Conversation, Note } from "~/server/db";
import { useDashboardStore } from "~/store/dashboard-store";
import { useEffect } from "react";

interface ChatsLayoutClientProps {
    conversations: Conversation[];
    notes: Note[];
    children: React.ReactNode;
}

export default function ChatsLayoutClient({ conversations, notes, children }: ChatsLayoutClientProps) {
    const setConversations = useDashboardStore(state => state.setConversations);
    const setNotes = useDashboardStore(state => state.setNotes);

    useEffect(() => {
        setConversations(conversations);
        setNotes(notes);
    }, [conversations, notes, setConversations, setNotes]);

    return <>{children}</>;
}