import { systemPrompt } from "~/server/gemini";

export default function DebugPage() {
    return <div className="p-16">
        <h1 className="text-3xl font-bold">Debug</h1>
        <div className="flex flex-col mt-4">
            <h2 className="text-2xl font-bold">System Prompt</h2>
            <p className="w-[800px]">{systemPrompt.split("\n").map((line, index) => <span key={index}>{line}<br /></span>)}</p>
        </div>
    </div>;
}