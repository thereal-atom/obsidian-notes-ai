"use client"

import type { Conversation } from "~/server/db";
import ConversationMessageForm from "~/components/ConversationMessageForm";
import { useRouter } from "next/navigation";

export default function ChatsHome() {
    const router = useRouter();

    const handleConversationStarted = (conversation: Conversation) => {
        void router.push(`/dashboard/chats/${conversation.id}`);
    };

    return (
        <div className="flex justify-center w-full h-full">
            <div className="flex flex-col w-[75%] h-full pb-8 pt-16">
                <div className="flex items-center justify-center w-full h-full">
                    <h1 className="text-3xl font-bold">Hello Oscar</h1>
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