import { create } from "zustand";
import { Conversation, Note } from "~/server/db";

interface DashboardState {
    conversations: Conversation[] | null;
    notes: Note[] | null;
    setConversations: (conversations: Conversation[]) => void;
    setNotes: (notes: Note[]) => void;
    addConversation: (conversation: Conversation) => void;
    addNote: (note: Note) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    conversations: null,
    notes: null,
    setConversations: (conversations) => set({ conversations }),
    setNotes: (notes) => set({ notes }),
    addConversation: (conversation) => set((state) => ({
        conversations: state.conversations ? [...state.conversations, conversation] : [conversation],
    })),
    addNote: (note) => set((state) => ({
        notes: state.notes ? [...state.notes, note] : [note],
    })),
}));