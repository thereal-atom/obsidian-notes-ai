"use server"

import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";

export async function signout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);

        return;
    }
    // invalidate conversations, vaults, notes, etc cache/dashboard store
    redirect("/auth/login");
};