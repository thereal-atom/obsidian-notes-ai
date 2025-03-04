export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          createdAt: string
          id: string
          initialUserPrompt: string
          systemPrompt: string
          vaultId: string
        }
        Insert: {
          createdAt?: string
          id: string
          initialUserPrompt: string
          systemPrompt: string
          vaultId: string
        }
        Update: {
          createdAt?: string
          id?: string
          initialUserPrompt?: string
          systemPrompt?: string
          vaultId?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_vaultId_fkey"
            columns: ["vaultId"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      message_relevant_notes: {
        Row: {
          createdAt: string
          messageId: string
          noteId: string
        }
        Insert: {
          createdAt?: string
          messageId: string
          noteId: string
        }
        Update: {
          createdAt?: string
          messageId?: string
          noteId?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_relevant_notes_messageId_fkey"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_relevant_notes_noteId_fkey"
            columns: ["noteId"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversationId: string
          createdAt: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversationId: string
          createdAt?: string
          id: string
          role: string
        }
        Update: {
          content?: string
          conversationId?: string
          createdAt?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          createdAt: string
          embedding: string
          id: string
          name: string
          vaultId: string
        }
        Insert: {
          content: string
          createdAt?: string
          embedding: string
          id: string
          name: string
          vaultId: string
        }
        Update: {
          content?: string
          createdAt?: string
          embedding?: string
          id?: string
          name?: string
          vaultId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_vaultId_fkey"
            columns: ["vaultId"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          id: string
          username: string
        }
        Insert: {
          createdAt?: string
          id: string
          username: string
        }
        Update: {
          createdAt?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      vaults: {
        Row: {
          createdAt: string
          id: string
          name: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          userId?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_note_embeddings: {
        Args: {
          query_embedding: string
          match_count: number
        }
        Returns: {
          id: string
          source: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
