import { redirect } from "next/navigation";
import DashboardLayoutClient from "~/components/DashboardLayoutClient";
import { api } from "~/trpc/server";
import { createClient } from "~/utils/supabase/server";

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

    return (
        <DashboardLayoutClient
            vaults={vaults}
            user={data.user}
        >
            {children}
        </DashboardLayoutClient>
    );
}
