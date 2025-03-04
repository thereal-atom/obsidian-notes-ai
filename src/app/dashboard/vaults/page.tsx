"use client"

import { useEffect } from "react";
import { z } from "zod";
import { useDashboardStore } from "~/store/dashboard-store";
import { api } from "~/trpc/react";
import { validateFormData } from "~/utils/forms";

export default function VaultsPage() {
    const vaults = useDashboardStore(state => state.vaults);

    const { mutate, isPending } = api.vaults.create.useMutation();

    const activeVaultId = useDashboardStore((state) => state.activeVault?.id ?? "");
    const setConversations = useDashboardStore((state) => state.setConversations);
    const setNotes = useDashboardStore((state) => state.setNotes);

    const notesQuery = api.notes.getAll.useQuery(
        { vaultId: activeVaultId },
        { enabled: !!activeVaultId }
    );
    const conversationsQuery = api.conversations.getAll.useQuery(
        { vaultId: activeVaultId },
        { enabled: !!activeVaultId }
    );

    const setActiveVault = (vaultId: string) => {
        if (!vaults) return;

        const vault = vaults.find(vault => vault.id === vaultId);

        if (vault) {
            useDashboardStore.getState().setActiveVault(vault);

            localStorage.setItem("activeVaultId", vault.id);
        };
    };

    const handleCreateVault = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { data, error } = validateFormData(
            z.object({
                name: z
                    .string()
                    .min(1)
                    .max(128),
            }),
            new FormData(event.currentTarget),
        );

        if (error || !data) return;

        mutate(
            data,
            {
                onSuccess: (newVault) => {
                    useDashboardStore.getState().addVault(newVault);
                },
                onError: (error) => {
                    console.error("Error creating vault:", error);
                },
            },
        );
    };

    useEffect(() => {
        if (notesQuery.data) {
            setNotes(notesQuery.data);
        }
    }, [notesQuery.data, setNotes]);

    useEffect(() => {
        if (conversationsQuery.data) {
            setConversations(conversationsQuery.data);
        }
    }, [conversationsQuery.data, setConversations]);

    if (!vaults) return <div>Loading...</div>;

    return (
        <div className="flex flex-col p-16">
            <h1 className="text-3xl font-bold">Vaults</h1>
            <div className="flex flex-col mt-4">
                {vaults.map(vault => (
                    <div
                        key={vault.id}
                        className="flex flex-row items-center justify-between w-full mb-2 p-4 border border-[#c3c3ff33] rounded-md"
                    >
                        <p className="font-semibold">{vault.name}</p>
                        <button
                            className="font-semibold"
                            onClick={() => setActiveVault(vault.id)}
                        >
                            Set Active
                        </button>
                        <button
                            className="font-semibold"
                        // onClick={() => { }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {vaults.length <= 0 && (
                    <p>No vaults found</p>
                )}
            </div>
            <div className="flex flex-col mt-8">
                <h1 className="text-3xl font-bold">Create Vault</h1>
                <form onSubmit={handleCreateVault}>
                    <div className="flex flex-col">
                        <label
                            className="font-medium"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="w-full mt-1 p-3 bg-transparent border border-[#c3c3ff33] rounded-md"
                            placeholder="My Vault"
                        />
                    </div>
                    <button
                        className="w-full mt-2 py-3 bg-accent text-xl font-bold rounded-md disabled:opacity-50"
                        disabled={isPending}
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    )
}