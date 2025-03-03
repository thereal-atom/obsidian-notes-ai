"use client"

import type { ConversationMessage } from "~/server/db";
import ConversationMessageForm from "~/components/ConversationMessageForm";
import { api } from "~/trpc/react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";
import { newId } from "~/utils/id";
import ObsidianFileBadge from "~/components/ObsidianFileBadge";

export default function ChatPage() {
    const { conversationId } = useParams<{ conversationId: string }>();

    const [messages, setMessages] = useState<(ConversationMessage)[]>([]);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const {
        data: conversation,
        isLoading,
        isError,
        error,
    } = api.conversations.getById.useQuery(conversationId);

    useEffect(() => {
        if (conversation) {
            setMessages([
                {
                    id: newId("message"),
                    content: conversation.initialUserPrompt,
                    role: "user",
                    conversationId: conversation.id,
                    createdAt: new Date().toISOString(),
                },
                ...conversation.messages,
            ]);
        }
    }, [conversation]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleMessageSent = (newMessage: ConversationMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="flex flex-col items-center flex-1 overflow-y-auto w-full">
                <div className="flex flex-col w-[75%] h-full pt-16">
                    <div className="mb-4">
                        {messages.map((message, index) => (
                            <div
                                className={`flex flex-row ${message.role === "user" ? "justify-end" : "justify-start"} w-full mb-8`}
                                key={index}
                                ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to last message
                            >
                                <div className={`flex flex-col p-4 rounded-md ${message.role === "user" ? "bg-[#c3c3ff11] border border-[#c3c3ff33]" : ""}`}>
                                    <div className={message.role === "user" ? "font-semibold" : "markdown"}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                    {message.role === "llm" && message.relevantNotes && message.relevantNotes.length > 0 && (
                                        <div className="flex flex-wrap mt-4">
                                            {message.relevantNotes.map((note, noteIndex) => (
                                                <ObsidianFileBadge
                                                    noteId={note.id}
                                                    noteName={note.name}
                                                    key={noteIndex}
                                                />
                                            ))}
                                        </div>

                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-[75%] my-8">
                <ConversationMessageForm
                    onMessageSent={handleMessageSent}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onConversationStarted={() => { }}
                    conversationId={conversationId}
                />
            </div>
        </div>
    );
};