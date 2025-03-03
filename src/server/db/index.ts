import type { Database } from "./types";
import { createClient } from "@supabase/supabase-js";

export const db = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type ConversationMessage = Database["public"]["Tables"]["messages"]["Row"] & {
    relevantNotes?: Pick<Note, "id" | "name" | "content">[];
};