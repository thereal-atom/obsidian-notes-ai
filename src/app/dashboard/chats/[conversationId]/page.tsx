"use client"

import type { ConversationMessage } from "~/server/supabase";
// import ConversationMessageForm from "~/components/ConversationMessageForm";
import { api } from "~/trpc/react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";
import { newId } from "~/utils/id";
import ObsidianFileBadge from "~/components/ObsidianFileBadge";
import { useCompletion } from "@ai-sdk/react";

export default function ChatPage() {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<(ConversationMessage)[]>([]);
    const [wasMessageRecentlySent, setWasMessageRecentlySent] = useState(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const { mutate, isPending } = api.conversations.sendConversationMessage.useMutation();
    const { mutate: saveMessageMutate, isPending: isSaveMessagePending } = api.conversations.saveMessage.useMutation();

    const {
        data: conversation,
        isLoading,
        isError,
        error,
    } = api.conversations.getById.useQuery(conversationId);

    const {
        completion,
        complete,
        isLoading: isCompletionLoading,
    } = useCompletion({ api: "/api/chat-stream" });

    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();

        if (!prompt) return;

        setWasMessageRecentlySent(true);

        saveMessageMutate(
            {
                conversationId,
                message: prompt,
                role: "user",
            },
            {
                onSuccess: (newMessage) => {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                },
            }
        );

        void complete(prompt);
    };

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
        };
    }, [messages, completion]);

    useEffect(() => {
        if (wasMessageRecentlySent && !isCompletionLoading) {
            saveMessageMutate(
                {
                    conversationId,
                    message: completion,
                    role: "llm",
                },
                {
                    onSuccess: (newMessage) => {
                        setWasMessageRecentlySent(false);
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                        setPrompt("");
                    },
                },
            );
        };
    }, [wasMessageRecentlySent, isCompletionLoading, completion, saveMessageMutate, conversationId]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

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
                        {
                            (isCompletionLoading || wasMessageRecentlySent) && <div
                                className="flex flex-row justify-start w-full mb-8"

                            >
                                <div className="flex flex-col p-4 rounded-md">
                                    <div className="markdown">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {completion}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="w-[75%] my-8">
                {/* <ConversationMessageForm
                    onMessageSent={handleMessageSent}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onConversationStarted={() => { }}
                    conversationId={conversationId}
                /> */}

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
                            disabled={isPending || isCompletionLoading || isSaveMessagePending}
                        >
                            {isPending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};