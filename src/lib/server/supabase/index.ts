import type { conversations, messages, notes, vaults } from "@prisma/client";
import type { Database } from "./types";
import { createClient } from "@supabase/supabase-js";

export const db = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export type Note = notes;
export type ConversationMessage = messages;
export type Conversation = conversations;
export type Vault = vaults;