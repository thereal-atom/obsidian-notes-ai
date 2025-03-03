"use client";

import type { Conversation, ConversationMessage } from "~/server/db";
import { api } from "~/trpc/react";
import { useState } from "react";
import { newId } from "~/utils/id";
import { useDashboardStore } from "~/store/dashboard-store";

interface Props {
    onMessageSent: (message: ConversationMessage) => void;
    onConversationStarted: (conversation: Conversation) => void;
    conversationId?: string;
}

export default function ConversationMessageForm({
    onMessageSent,
    onConversationStarted,
    conversationId,
}: Props) {
    const [prompt, setPrompt] = useState("");
    const { mutate, isPending } = api.conversations.sendConversationMessage.useMutation();
    const addConversation = useDashboardStore(state => state.addConversation);

    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();

        if (!prompt) return;

        if (conversationId) {
            onMessageSent({
                content: prompt,
                role: "user",
                conversationId,
                createdAt: new Date().toISOString(),
                id: newId("message"),
            });
        };

        mutate(
            {
                message: prompt,
                conversationId,
            },
            {
                onSuccess: (data) => {
                    if (conversationId) {
                        onMessageSent({
                            content: data.responseText,
                            role: "llm",
                            conversationId: data.conversation.id,
                            createdAt: new Date().toISOString(),
                            id: newId("message"),
                            relevantNotes: data.llmMessage.relevantNotes,
                        });
                    } else {
                        addConversation(data.conversation);

                        onConversationStarted(data.conversation);
                    }
                    setPrompt("");
                },
                onError: (error) => {
                    console.error("Error sending message:", error);
                },
            }
        );
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <form
            className="flex flex-row items-center w-full p-4 bg-[#c3c3ff11] rounded-md border border-[#c3c3ff33]"
            onSubmit={handleSendMessage}
        >
            <textarea
                className="w-full h-6 bg-transparent font-medium align-text-top resize-none focus:outline-none"
                placeholder="Summarize my notes in autoencoders.md"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
            ></textarea>
            <div className="flex flex-col h-full justify-end">
                <button
                    className="ml-2 px-3 py-2 bg-[#635BFF] text-white text-sm font-bold rounded-md hover:cursor-pointer disabled:opacity-50"
                    disabled={isPending}
                >
                    {isPending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}