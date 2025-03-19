import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";
import { api } from "@/trpc/server";
import { createClient } from "@/utils/supabase/server";

export default async function ChatsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect("/auth/login")
    }

    const vaults = await api.vaults.getAll();
    if (vaults.length <= 0) return <div className="flex justify-center items-center">No Vaults Found.</div>;

    return (
        <DashboardLayoutClient
            vaults={vaults}
            user={data.user}
        >
            {children}
        </DashboardLayoutClient>
    );
}
