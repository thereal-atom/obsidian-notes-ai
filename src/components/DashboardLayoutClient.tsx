"use client"

import type { Vault } from "~/server/supabase";
import type { User } from "@supabase/supabase-js";
import ChatsLayoutClient from "./ChatsLayoutClient";
import DashboardSidebar from "./DashboardSidebar";
import { useEffect } from "react";
import { useDashboardStore } from "~/store/dashboard-store";
import { api } from "~/trpc/react";

export default function DashboardLayoutClient({
    vaults,
    children,
    user,
}: {
    vaults: Vault[];
    children: React.ReactNode;
    user: User,
}) {
    const setActiveVault = useDashboardStore(state => state.setActiveVault);
    const setConversations = useDashboardStore(state => state.setConversations);
    const setNotes = useDashboardStore(state => state.setNotes);

    const activeVault = useDashboardStore(state => state.activeVault);
    const activeVaultId = activeVault?.id ?? "";

    const conversations = useDashboardStore(state => state.conversations);
    const notes = useDashboardStore(state => state.notes);

    const conversationsQuery = api.conversations.getAll.useQuery(
        { vaultId: activeVaultId },
        { enabled: !!activeVaultId }
    );
    const notesQuery = api.notes.getAll.useQuery(
        { vaultId: activeVaultId },
        { enabled: !!activeVaultId }
    );

    useEffect(() => {
        const storedActiveVaultId = localStorage.getItem("activeVaultId");
        const storedVault = vaults.find(vault => vault.id === storedActiveVaultId);

        if (storedVault) {
            setActiveVault(storedVault);
        } else {
            const firstVault = vaults[0];
            if (!firstVault) return;

            setActiveVault(firstVault);
            localStorage.setItem("activeVaultId", firstVault.id);
        }
    }, [vaults, setActiveVault]);

    // Update conversations and notes when query data changes
    useEffect(() => {
        if (conversationsQuery.data) {
            setConversations(conversationsQuery.data);
        }
    }, [conversationsQuery.data, setConversations]);

    useEffect(() => {
        if (notesQuery.data) {
            setNotes(notesQuery.data);
        }
    }, [notesQuery.data, setNotes]);

    useEffect(() => {
        if (activeVaultId) {
            void conversationsQuery.refetch();
            void notesQuery.refetch();
        }
    });

    if (!conversations || !notes || conversationsQuery.isLoading || notesQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (!conversations || !notes) return <div>Loading...</div>;

    return (
        <div className="flex flex-row justify-center w-screen h-screen overflow-hidden bg-primary font-[family-name:var(--font-geist-sans)]">
            <ChatsLayoutClient
                conversations={conversations}
                notes={notes}
                vaults={vaults}
            >
                <DashboardSidebar user={user} />
            </ChatsLayoutClient>
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    );
}