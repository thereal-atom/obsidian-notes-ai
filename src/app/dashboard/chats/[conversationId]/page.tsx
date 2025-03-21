"use client"

import type { ConversationMessage } from "@/server/supabase";
import type { notes } from "@prisma/client";
import { api } from "@/trpc/react";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { newId } from "@/utils/id";
import ObsidianFileBadge from "@/components/ObsidianFileBadge";
import { useCompletion } from "@ai-sdk/react";
import { z } from "zod";
import ConversationMessageForm from "@/components/chats/ConversationMessageForm";
import { useDashboardStore } from "@/stores/dashboard-store";
import Markdown from "@/components/Markdown";

export default function ChatPage() {
    const { conversationId } = useParams<{ conversationId: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const notes = useDashboardStore(state => state.notes);

    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<(ConversationMessage & {
        relevantNotes?: notes[];
    })[]>([]);
    const [wasMessageRecentlySent, setWasMessageRecentlySent] = useState(false);
    const [startedCompletion, setStartedCompletion] = useState(false);

    const lastMessageRef = useRef<HTMLDivElement>(null);

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

    const handleSendMessage = (prompt: string) => {
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
                    createdAt: conversation.createdAt,
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
        if (startedCompletion) return;

        if (wasMessageRecentlySent && !isCompletionLoading) {
            setStartedCompletion(true);

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
    }, [startedCompletion, setStartedCompletion, wasMessageRecentlySent, isCompletionLoading, completion, saveMessageMutate, conversationId]);

    useEffect(() => {
        const searchParamsData = Object.fromEntries(searchParams);
        if (!searchParamsData) return;

        const params = z.object({
            isNew: z.coerce.boolean(),
            prompt: z.string(),
        }).safeParse(searchParamsData);

        if (params.success && params.data) {
            if (!params.data.isNew) return;

            void router.replace(window.location.pathname);

            setWasMessageRecentlySent(true);

            setPrompt(params.data.prompt);
            void complete(params.data.prompt);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    if (isLoading) return <div className="flex flex-col justify-center items-center w-full h-full">Loading...</div>;
    if (isError) return <div className="flex flex-col justify-center items-center w-full h-full">Error: {error?.message}</div>;

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="flex flex-col items-center flex-1 overflow-y-auto w-full">
                <div className="flex flex-col w-[75%] h-full pt-16">
                    <div className="mb-4">
                        {messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((message, index) => (
                            <div
                                className={`flex flex-row ${message.role === "user" ? "justify-end" : "justify-start"} w-full mb-8`}
                                key={index}
                            >
                                <div className={`flex flex-col p-4 rounded-md ${message.role === "user" ? "bg-[#c3c3ff11] border border-[#c3c3ff33] w-2/3" : ""}`}>
                                    <div className={message.role === "user" ? "font-semibold" : "markdown"}>
                                        <Markdown
                                            parseNoteLinks={true}
                                            notes={notes ?? undefined}
                                        >
                                            {message.content}
                                        </Markdown>
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
                                        <Markdown
                                            parseNoteLinks={true}
                                            notes={notes ?? undefined}
                                        >
                                            {completion}
                                        </Markdown>
                                    </div>
                                </div>
                            </div>
                        }
                        <p ref={lastMessageRef}></p>
                    </div>
                </div>
            </div>
            <div className="w-[75%] my-8">
                <ConversationMessageForm
                    onMessageSent={handleSendMessage}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isCompletionLoading={isCompletionLoading}
                    isDisabled={isSaveMessagePending}
                />
            </div>
        </div>
    );
};