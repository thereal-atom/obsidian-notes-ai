import type { Conversation, Note, Vault } from "~/server/supabase";
import { create } from "zustand";

interface DashboardState {
    conversations: Conversation[] | null;
    notes: Note[] | null;
    vaults: Vault[] | null;
    activeVault: Vault | null;

    setConversations: (conversations: Conversation[]) => void;
    setNotes: (notes: Note[]) => void;
    setVaults: (vaults: Vault[]) => void;
    setActiveVault: (vault: Vault) => void;

    addConversation: (conversation: Conversation) => void;
    addNote: (note: Note) => void;
    addVault: (vault: Vault) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    conversations: null,
    notes: null,
    vaults: null,
    activeVault: null,

    setConversations: (conversations) => set({ conversations }),
    setNotes: (notes) => set({ notes }),
    setVaults: (vaults) => set({ vaults }),
    setActiveVault: (vault) => set({ activeVault: vault }),

    addConversation: (conversation) => set((state) => ({
        conversations: (state.conversations ? [...state.conversations, conversation] : [conversation]).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    })),
    addNote: (note) => set((state) => ({
        notes: state.notes ? [...state.notes, note] : [note],
    })),
    addVault: (vault) => set((state) => ({
        vaults: state.vaults ? [...state.vaults, vault] : [vault],
    })),
}));