export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      game_state: {
        Row: {
          match_id: string
          p1_locked: boolean
          p1_score: number
          p1_sequence: Json | null
          p2_locked: boolean
          p2_score: number
          p2_sequence: Json | null
          phase: string
          round_results: Json | null
          sd_p1_card: string | null
          sd_p2_card: string | null
          sd_round: number
          updated_at: string
        }
        Insert: {
          match_id: string
          p1_locked?: boolean
          p1_score?: number
          p1_sequence?: Json | null
          p2_locked?: boolean
          p2_score?: number
          p2_sequence?: Json | null
          phase?: string
          round_results?: Json | null
          sd_p1_card?: string | null
          sd_p2_card?: string | null
          sd_round?: number
          updated_at?: string
        }
        Update: {
          match_id?: string
          p1_locked?: boolean
          p1_score?: number
          p1_sequence?: Json | null
          p2_locked?: boolean
          p2_score?: number
          p2_sequence?: Json | null
          phase?: string
          round_results?: Json | null
          sd_p1_card?: string | null
          sd_p2_card?: string | null
          sd_round?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_state_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_sequences: {
        Row: {
          match_id: string
          player_id: string
          sequence: Json
          submitted_at: string
        }
        Insert: {
          match_id: string
          player_id: string
          sequence: Json
          submitted_at?: string
        }
        Update: {
          match_id?: string
          player_id?: string
          sequence?: Json
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_sequences_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_sequences_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_sequences_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          entry_fee_ore: number
          game: string
          id: string
          moves: Json | null
          player1_id: string
          player2_id: string
          purse_ore: number
          settled_at: string | null
          stake_kr: number
          status: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          entry_fee_ore: number
          game: string
          id?: string
          moves?: Json | null
          player1_id: string
          player2_id: string
          purse_ore: number
          settled_at?: string | null
          stake_kr: number
          status?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          entry_fee_ore?: number
          game?: string
          id?: string
          moves?: Json | null
          player1_id?: string
          player2_id?: string
          purse_ore?: number
          settled_at?: string | null
          stake_kr?: number
          status?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          handle: string
          id: string
          initials: string
          member_since: string
          mitid_verified: boolean
        }
        Insert: {
          handle: string
          id: string
          initials: string
          member_since?: string
          mitid_verified?: boolean
        }
        Update: {
          handle?: string
          id?: string
          initials?: string
          member_since?: string
          mitid_verified?: boolean
        }
        Relationships: []
      }
      queue: {
        Row: {
          created_at: string
          game: string
          id: string
          match_id: string | null
          stake_kr: number
          status: string
          tier_id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          game: string
          id?: string
          match_id?: string | null
          stake_kr: number
          status?: string
          tier_id: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          game?: string
          id?: string
          match_id?: string | null
          stake_kr?: number
          status?: string
          tier_id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sd_picks: {
        Row: {
          card: string
          match_id: string
          player_id: string
          sd_round: number
          submitted_at: string
        }
        Insert: {
          card: string
          match_id: string
          player_id: string
          sd_round: number
          submitted_at?: string
        }
        Update: {
          card?: string
          match_id?: string
          player_id?: string
          sd_round?: number
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sd_picks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sd_picks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sd_picks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stake_tiers: {
        Row: {
          entry_fee_ore: number
          id: string
          purse_ore: number
          stake_kr: number
        }
        Insert: {
          entry_fee_ore: number
          id: string
          purse_ore: number
          stake_kr: number
        }
        Update: {
          entry_fee_ore?: number
          id?: string
          purse_ore?: number
          stake_kr?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_ore: number
          balance_after_ore: number
          created_at: string
          description: string | null
          id: string
          mangopay_fee_ore: number | null
          mangopay_txn_id: string | null
          match_id: string | null
          payment_method: string | null
          settled_at: string | null
          status: string
          tournament_id: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount_ore: number
          balance_after_ore: number
          created_at?: string
          description?: string | null
          id?: string
          mangopay_fee_ore?: number | null
          mangopay_txn_id?: string | null
          match_id?: string | null
          payment_method?: string | null
          settled_at?: string | null
          status?: string
          tournament_id?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount_ore?: number
          balance_after_ore?: number
          created_at?: string
          description?: string | null
          id?: string
          mangopay_fee_ore?: number | null
          mangopay_txn_id?: string | null
          match_id?: string | null
          payment_method?: string | null
          settled_at?: string | null
          status?: string
          tournament_id?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_ore: number
          created_at: string
          currency: string
          id: string
          mangopay_wallet_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_ore?: number
          created_at?: string
          currency?: string
          id?: string
          mangopay_wallet_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_ore?: number
          created_at?: string
          currency?: string
          id?: string
          mangopay_wallet_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          handle: string | null
          id: string | null
          initials: string | null
          member_since: string | null
        }
        Insert: {
          handle?: string | null
          id?: string | null
          initials?: string | null
          member_since?: string | null
        }
        Update: {
          handle?: string | null
          id?: string | null
          initials?: string | null
          member_since?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      fn_current_streak: { Args: { p_user_id: string }; Returns: number }
      fn_h2h_streak: {
        Args: { p_opp_id: string; p_user_id: string }
        Returns: number
      }
      rpc_cancel_queue: { Args: { p_queue_id: string }; Returns: undefined }
      rpc_create_profile_and_wallet: {
        Args: { p_handle: string; p_initials: string }
        Returns: undefined
      }
      rpc_get_board: { Args: never; Returns: Json }
      rpc_get_game_live_counts: { Args: never; Returns: Json }
      rpc_get_leaderboard: { Args: { p_period?: string }; Returns: Json }
      rpc_get_live_counts: { Args: never; Returns: Json }
      rpc_get_rivals: { Args: never; Returns: Json }
      rpc_get_stats_strip: { Args: never; Returns: Json }
      rpc_get_ticker: { Args: never; Returns: Json }
      rpc_get_user_stats: { Args: never; Returns: Json }
      rpc_join_queue: {
        Args: { p_game: string; p_stake_kr: number; p_tier_id: string }
        Returns: Json
      }
      rpc_resolve_card_duel: {
        Args: { p_match_id: string; p_player1: string; p_player2: string }
        Returns: undefined
      }
      rpc_settle_match: {
        Args: { p_match_id: string; p_winner_id: string }
        Returns: undefined
      }
      rpc_submit_sequence: {
        Args: { p_match_id: string; p_sequence: Json }
        Returns: Json
      }
      rpc_submit_sudden_death: {
        Args: { p_card: string; p_match_id: string }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
