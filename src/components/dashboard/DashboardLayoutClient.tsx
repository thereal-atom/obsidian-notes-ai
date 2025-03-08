"use client"

import type { Vault } from "~/server/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { useDashboardStore } from "~/store/dashboard-store";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayoutClient({
    vaults,
    children,
    user,
}: {
    vaults: Vault[];
    children: React.ReactNode;
    user: User;
}) {
    const setActiveVault = useDashboardStore(state => state.setActiveVault);
    const setConversations = useDashboardStore(state => state.setConversations);
    const setNotes = useDashboardStore(state => state.setNotes);
    const setVaults = useDashboardStore(state => state.setVaults);

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
        if (vaults.length === 0) return;

        const storedActiveVaultId = localStorage.getItem("activeVaultId");
        const storedVault = vaults.find(vault => vault.id === storedActiveVaultId);

        if (storedVault) {
            setActiveVault(storedVault);
        } else {
            const firstVault = vaults[0]!;
            setActiveVault(firstVault);
            localStorage.setItem("activeVaultId", firstVault.id);
        }
    }, [vaults, setActiveVault]);

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
        setVaults(vaults);
    }, [vaults, setVaults]);

    useEffect(() => {
        if (activeVaultId) {
            void conversationsQuery.refetch();
            void notesQuery.refetch();
        }
    }, [activeVaultId]);

    const isLoading = !conversations || !notes || conversationsQuery.isLoading || notesQuery.isLoading;
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-row justify-center w-screen h-screen overflow-hidden bg-primary font-[family-name:var(--font-geist-sans)]">
            <DashboardSidebar user={user} />
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    );
}