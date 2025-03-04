"use client"

import type { Conversation } from "~/server/supabase";
import ConversationMessageForm from "~/components/ConversationMessageForm";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "~/store/dashboard-store";
import Link from "next/link";

export default function ChatsHome() {
    const notes = useDashboardStore(state => state.notes);
    const activeVault = useDashboardStore(state => state.activeVault);

    const router = useRouter();

    const handleConversationStarted = (conversation: Conversation) => {
        void router.push(`/dashboard/chats/${conversation.id}`);
    };

    return (
        <div className="flex justify-center w-full h-full">
            <div className="flex flex-col w-[75%] h-full pb-8 pt-16">
                <div className="flex items-center justify-center w-full h-full">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold">Hello Oscar</h1>
                        <p className="mt-2">Get started by <Link className="text-accent" href="/dashboard/vaults">creating a vault</Link> and <Link className="text-accent" href="/dashboard/notes">uploading some notes</Link>.</p>
                        <p className="mt-2">
                            {
                                activeVault
                                    ? <span>You are in vault <span className="font-bold">{activeVault?.name}</span> with <span className="font-bold">{notes ? notes.length : 0}</span> notes.</span>
                                    : <span>You are not in a vault.</span>
                            }
                        </p>
                    </div>
                </div>
                <ConversationMessageForm
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onMessageSent={() => { }}
                    onConversationStarted={handleConversationStarted}
                />
            </div>
        </div>
    );
}