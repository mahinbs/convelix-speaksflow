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
      bland_ai_calls: {
        Row: {
          ai_analysis: Json | null
          bland_call_id: string | null
          call_data: Json | null
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          duration: number | null
          id: string
          lead_id: string | null
          lead_score: number | null
          outcome: string | null
          phone_number: string
          qualification_status: string | null
          recording_url: string | null
          started_at: string | null
          status: string
          summary: string | null
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          bland_call_id?: string | null
          call_data?: Json | null
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          outcome?: string | null
          phone_number: string
          qualification_status?: string | null
          recording_url?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          bland_call_id?: string | null
          call_data?: Json | null
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          outcome?: string | null
          phone_number?: string
          qualification_status?: string | null
          recording_url?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bland_ai_calls_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "bland_ai_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bland_ai_calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      bland_ai_campaigns: {
        Row: {
          ai_prompt: string
          campaign_data: Json | null
          completed_calls: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          successful_calls: number | null
          total_leads: number | null
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          ai_prompt: string
          campaign_data?: Json | null
          completed_calls?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          successful_calls?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          ai_prompt?: string
          campaign_data?: Json | null
          completed_calls?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          successful_calls?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          form_type: string
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          form_type: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          form_type?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      integration_credentials: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          is_active: boolean | null
          last_validated_at: string | null
          source_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials: Json
          id?: string
          is_active?: boolean | null
          last_validated_at?: string | null
          source_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean | null
          last_validated_at?: string | null
          source_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          leads_imported: number | null
          metadata: Json | null
          source_type: string
          started_at: string
          sync_status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          leads_imported?: number | null
          metadata?: Json | null
          source_type: string
          started_at?: string
          sync_status: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          leads_imported?: number | null
          metadata?: Json | null
          source_type?: string
          started_at?: string
          sync_status?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          notes: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          notes?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_imports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_log: Json | null
          failed_imports: number
          id: string
          import_status: string
          import_type: string
          metadata: Json | null
          source_name: string
          successful_imports: number
          total_leads: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_imports?: number
          id?: string
          import_status?: string
          import_type: string
          metadata?: Json | null
          source_name: string
          successful_imports?: number
          total_leads?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_imports?: number
          id?: string
          import_status?: string
          import_type?: string
          metadata?: Json | null
          source_name?: string
          successful_imports?: number
          total_leads?: number
          user_id?: string
        }
        Relationships: []
      }
      lead_sources: {
        Row: {
          api_config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          source_name: string
          source_type: string
          total_leads: number | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          source_name: string
          source_type: string
          total_leads?: number | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          source_name?: string
          source_type?: string
          total_leads?: number | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_insights: Json | null
          ai_lead_score: number | null
          campaign_id: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          import_batch_id: string | null
          job_title: string | null
          last_analysis_at: string | null
          last_contact_at: string | null
          lead_data: Json | null
          name: string | null
          phone: string | null
          priority: string | null
          score: number | null
          source: string
          source_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          ai_lead_score?: number | null
          campaign_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          import_batch_id?: string | null
          job_title?: string | null
          last_analysis_at?: string | null
          last_contact_at?: string | null
          lead_data?: Json | null
          name?: string | null
          phone?: string | null
          priority?: string | null
          score?: number | null
          source: string
          source_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          ai_lead_score?: number | null
          campaign_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          import_batch_id?: string | null
          job_title?: string | null
          last_analysis_at?: string | null
          last_contact_at?: string | null
          lead_data?: Json | null
          name?: string | null
          phone?: string | null
          priority?: string | null
          score?: number | null
          source?: string
          source_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "lead_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_activation_status: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          created_at: string
          id: string
          notes: string | null
          profile_id: string | null
          status: Database["public"]["Enums"]["activation_status"] | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          profile_id?: string | null
          status?: Database["public"]["Enums"]["activation_status"] | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          profile_id?: string | null
          status?: Database["public"]["Enums"]["activation_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activation_status_activated_by_fkey"
            columns: ["activated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activation_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      vapi_ai_assistants: {
        Row: {
          assistant_data: Json | null
          background_sound: string | null
          created_at: string
          description: string | null
          first_message: string | null
          functions: Json | null
          id: string
          model: string
          name: string
          prompt: string
          status: string
          updated_at: string
          user_id: string
          vapi_assistant_id: string | null
          voice_settings: Json
        }
        Insert: {
          assistant_data?: Json | null
          background_sound?: string | null
          created_at?: string
          description?: string | null
          first_message?: string | null
          functions?: Json | null
          id?: string
          model?: string
          name: string
          prompt: string
          status?: string
          updated_at?: string
          user_id: string
          vapi_assistant_id?: string | null
          voice_settings?: Json
        }
        Update: {
          assistant_data?: Json | null
          background_sound?: string | null
          created_at?: string
          description?: string | null
          first_message?: string | null
          functions?: Json | null
          id?: string
          model?: string
          name?: string
          prompt?: string
          status?: string
          updated_at?: string
          user_id?: string
          vapi_assistant_id?: string | null
          voice_settings?: Json
        }
        Relationships: []
      }
      vapi_ai_calls: {
        Row: {
          assistant_id: string | null
          call_data: Json | null
          caller_phone_number: string | null
          cost: number | null
          created_at: string
          destination_phone_number: string | null
          duration: number | null
          ended_at: string | null
          id: string
          lead_id: string | null
          phone_number_id: string | null
          recording_url: string | null
          sentiment_analysis: Json | null
          started_at: string | null
          status: string
          summary: string | null
          transcript: string | null
          type: string
          updated_at: string
          user_id: string
          vapi_call_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          call_data?: Json | null
          caller_phone_number?: string | null
          cost?: number | null
          created_at?: string
          destination_phone_number?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          phone_number_id?: string | null
          recording_url?: string | null
          sentiment_analysis?: Json | null
          started_at?: string | null
          status?: string
          summary?: string | null
          transcript?: string | null
          type?: string
          updated_at?: string
          user_id: string
          vapi_call_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          call_data?: Json | null
          caller_phone_number?: string | null
          cost?: number | null
          created_at?: string
          destination_phone_number?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          phone_number_id?: string | null
          recording_url?: string | null
          sentiment_analysis?: Json | null
          started_at?: string | null
          status?: string
          summary?: string | null
          transcript?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vapi_ai_calls_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "vapi_ai_assistants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vapi_ai_calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      vapi_ai_phone_numbers: {
        Row: {
          assistant_id: string | null
          country_code: string
          created_at: string
          id: string
          monthly_cost: number | null
          name: string | null
          phone_number: string
          phone_number_data: Json | null
          status: string
          updated_at: string
          user_id: string
          vapi_phone_number_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          country_code?: string
          created_at?: string
          id?: string
          monthly_cost?: number | null
          name?: string | null
          phone_number: string
          phone_number_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
          vapi_phone_number_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          country_code?: string
          created_at?: string
          id?: string
          monthly_cost?: number | null
          name?: string | null
          phone_number?: string
          phone_number_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          vapi_phone_number_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vapi_ai_phone_numbers_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "vapi_ai_assistants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_super_admin: {
        Args: { email: string }
        Returns: undefined
      }
      check_my_activation_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: Database["public"]["Enums"]["activation_status"]
        }[]
      }
      get_admin_users_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          subscription_plan: string
          leads_count: number
          status: string
          created_at: string
        }[]
      }
      get_user_activation_statuses: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          profile_id: string
          status: Database["public"]["Enums"]["activation_status"]
          activated_by: string
          activated_at: string
          notes: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          activated_by_email: string
          activated_by_full_name: string
        }[]
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      remove_super_admin: {
        Args: { email: string }
        Returns: undefined
      }
      update_user_activation_status: {
        Args: {
          target_profile_id: string
          new_status: Database["public"]["Enums"]["activation_status"]
          status_notes?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      activation_status: "pending" | "active" | "suspended"
      user_role: "admin" | "premium" | "basic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activation_status: ["pending", "active", "suspended"],
      user_role: ["admin", "premium", "basic"],
    },
  },
} as const
