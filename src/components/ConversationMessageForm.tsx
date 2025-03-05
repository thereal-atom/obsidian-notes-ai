"use client";

interface Props {
    onMessageSent: (prompt: string) => void;
    prompt: string;
    setPrompt: (value: string) => void;
    isCompletionLoading?: boolean;
    isDisabled?: boolean;
}

export default function ConversationMessageForm({
    onMessageSent,
    prompt,
    setPrompt,
    isCompletionLoading,
    isDisabled,
}: Props) {
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isCompletionLoading || isDisabled || !prompt) return;

        onMessageSent(prompt);
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
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    disabled={isDisabled || isCompletionLoading}
                >
                    {isCompletionLoading ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}