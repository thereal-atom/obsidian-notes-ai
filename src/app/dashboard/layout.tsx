import ChatsLayoutClient from "~/components/ChatsLayoutClient";
import DashboardSidebar from "~/components/DashboardSidebar";
import { api } from "~/trpc/server";

export default async function ChatsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const conversations = await api.conversations.getAll();
    const notes = await api.notes.getAll();

    return (
        <div className="flex flex-row justify-center w-screen h-screen overflow-hidden bg-[#15131C] font-[family-name:var(--font-geist-sans)]">
            <ChatsLayoutClient
                conversations={conversations}
                notes={notes}
            >
                <DashboardSidebar />
            </ChatsLayoutClient>
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    );
}
