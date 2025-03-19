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
      briefing_requests: {
        Row: {
          company_id: string
          company_logo: string | null
          company_name: string
          contact_id: string | null
          created_at: string
          focus_areas: string[] | null
          id: string
          meeting_type: string
          status: string
          user_id: string
        }
        Insert: {
          company_id: string
          company_logo?: string | null
          company_name: string
          contact_id?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          meeting_type: string
          status?: string
          user_id: string
        }
        Update: {
          company_id?: string
          company_logo?: string | null
          company_name?: string
          contact_id?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          meeting_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      briefings: {
        Row: {
          company_overview: Json
          competitor_analysis: Json | null
          created_at: string
          id: string
          insights: Json | null
          key_contacts: Json | null
          notes: string | null
          request_id: string
          sales_hypotheses: string[] | null
          status: string
          summary: string[] | null
          talking_points: string[] | null
          title: string
        }
        Insert: {
          company_overview: Json
          competitor_analysis?: Json | null
          created_at?: string
          id?: string
          insights?: Json | null
          key_contacts?: Json | null
          notes?: string | null
          request_id: string
          sales_hypotheses?: string[] | null
          status?: string
          summary?: string[] | null
          talking_points?: string[] | null
          title: string
        }
        Update: {
          company_overview?: Json
          competitor_analysis?: Json | null
          created_at?: string
          id?: string
          insights?: Json | null
          key_contacts?: Json | null
          notes?: string | null
          request_id?: string
          sales_hypotheses?: string[] | null
          status?: string
          summary?: string[] | null
          talking_points?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "briefings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "briefing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
