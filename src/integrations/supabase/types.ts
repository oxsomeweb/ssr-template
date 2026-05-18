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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_received_log: {
        Row: {
          action_type: string
          id: string
          payload: Json | null
          received_at: string
          result: Json | null
          status: string
          target_page: string | null
        }
        Insert: {
          action_type: string
          id?: string
          payload?: Json | null
          received_at?: string
          result?: Json | null
          status?: string
          target_page?: string | null
        }
        Update: {
          action_type?: string
          id?: string
          payload?: Json | null
          received_at?: string
          result?: Json | null
          status?: string
          target_page?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          service_id: string
          status: string
          updated_at: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          service_id: string
          status?: string
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          service_id?: string
          status?: string
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          source?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          initials: string
          is_featured: boolean
          location: string
          name: string
          rating: number
          review: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          initials: string
          is_featured?: boolean
          location: string
          name: string
          rating?: number
          review: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          initials?: string
          is_featured?: boolean
          location?: string
          name?: string
          rating?: number
          review?: string
        }
        Relationships: []
      }
      seo_blog_drafts: {
        Row: {
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      seo_city_pages: {
        Row: {
          body_sections: Json
          city: string | null
          city_slug: string | null
          created_at: string
          cta_text: string | null
          faq: Json
          h1: string | null
          id: string
          internal_link_suggestions: Json | null
          intro_paragraph: string | null
          local_schema: Json | null
          meta_description: string | null
          page_path: string
          status: string
          title_tag: string
          updated_at: string
        }
        Insert: {
          body_sections?: Json
          city?: string | null
          city_slug?: string | null
          created_at?: string
          cta_text?: string | null
          faq?: Json
          h1?: string | null
          id?: string
          internal_link_suggestions?: Json | null
          intro_paragraph?: string | null
          local_schema?: Json | null
          meta_description?: string | null
          page_path: string
          status?: string
          title_tag?: string
          updated_at?: string
        }
        Update: {
          body_sections?: Json
          city?: string | null
          city_slug?: string | null
          created_at?: string
          cta_text?: string | null
          faq?: Json
          h1?: string | null
          id?: string
          internal_link_suggestions?: Json | null
          intro_paragraph?: string | null
          local_schema?: Json | null
          meta_description?: string | null
          page_path?: string
          status?: string
          title_tag?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_content_updates: {
        Row: {
          action_subtype: string
          applied: boolean
          created_at: string
          id: string
          new_content: string
          page_path: string
          reason: string | null
          target_section: string | null
        }
        Insert: {
          action_subtype?: string
          applied?: boolean
          created_at?: string
          id?: string
          new_content: string
          page_path: string
          reason?: string | null
          target_section?: string | null
        }
        Update: {
          action_subtype?: string
          applied?: boolean
          created_at?: string
          id?: string
          new_content?: string
          page_path?: string
          reason?: string | null
          target_section?: string | null
        }
        Relationships: []
      }
      seo_injected_links: {
        Row: {
          anchor_text: string
          applied: boolean
          created_at: string
          href: string
          id: string
          insert_after_paragraph: number | null
          page_path: string
        }
        Insert: {
          anchor_text: string
          applied?: boolean
          created_at?: string
          href: string
          id?: string
          insert_after_paragraph?: number | null
          page_path: string
        }
        Update: {
          anchor_text?: string
          applied?: boolean
          created_at?: string
          href?: string
          id?: string
          insert_after_paragraph?: number | null
          page_path?: string
        }
        Relationships: []
      }
      seo_llmstxt_entries: {
        Row: {
          created_at: string
          entry: string
          id: string
          page_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entry: string
          id?: string
          page_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entry?: string
          id?: string
          page_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_offpage_log: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          platform: string | null
          source: string
          status: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          platform?: string | null
          source?: string
          status?: string
          type?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          platform?: string | null
          source?: string
          status?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      seo_page_map: {
        Row: {
          component_file: string | null
          created_at: string
          id: string
          page_path: string
          page_title: string
          sections: Json
          site_id: string
          updated_at: string
        }
        Insert: {
          component_file?: string | null
          created_at?: string
          id?: string
          page_path: string
          page_title?: string
          sections?: Json
          site_id: string
          updated_at?: string
        }
        Update: {
          component_file?: string | null
          created_at?: string
          id?: string
          page_path?: string
          page_title?: string
          sections?: Json
          site_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_page_meta: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          og_description: string | null
          og_title: string | null
          page_path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          page_path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          og_description?: string | null
          og_title?: string | null
          page_path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_receiver_config: {
        Row: {
          action_type: string
          created_at: string
          enabled: boolean
          field_mapping: Json
          handler_type: string
          id: string
          meta_sync: Json
          target_table: string
          updated_at: string
          upsert_key: string | null
          validation: Json
          version: string
        }
        Insert: {
          action_type: string
          created_at?: string
          enabled?: boolean
          field_mapping?: Json
          handler_type?: string
          id?: string
          meta_sync?: Json
          target_table?: string
          updated_at?: string
          upsert_key?: string | null
          validation?: Json
          version?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          enabled?: boolean
          field_mapping?: Json
          handler_type?: string
          id?: string
          meta_sync?: Json
          target_table?: string
          updated_at?: string
          upsert_key?: string | null
          validation?: Json
          version?: string
        }
        Relationships: []
      }
      seo_review_blocks: {
        Row: {
          applied: boolean
          author_schema_json: Json | null
          created_at: string
          id: string
          page_path: string
          review_html: string
        }
        Insert: {
          applied?: boolean
          author_schema_json?: Json | null
          created_at?: string
          id?: string
          page_path: string
          review_html: string
        }
        Update: {
          applied?: boolean
          author_schema_json?: Json | null
          created_at?: string
          id?: string
          page_path?: string
          review_html?: string
        }
        Relationships: []
      }
      seo_schemas: {
        Row: {
          created_at: string
          id: string
          page_path: string
          schema_json: Json
          schema_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_path?: string
          schema_json?: Json
          schema_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          schema_json?: Json
          schema_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_service_pages: {
        Row: {
          body_sections: Json
          created_at: string
          cta_text: string | null
          faq: Json
          h1: string | null
          id: string
          internal_link_suggestions: Json | null
          intro_paragraph: string | null
          meta_description: string | null
          page_path: string
          service: string | null
          service_schema: Json | null
          service_slug: string | null
          status: string
          title_tag: string
          updated_at: string
        }
        Insert: {
          body_sections?: Json
          created_at?: string
          cta_text?: string | null
          faq?: Json
          h1?: string | null
          id?: string
          internal_link_suggestions?: Json | null
          intro_paragraph?: string | null
          meta_description?: string | null
          page_path: string
          service?: string | null
          service_schema?: Json | null
          service_slug?: string | null
          status?: string
          title_tag?: string
          updated_at?: string
        }
        Update: {
          body_sections?: Json
          created_at?: string
          cta_text?: string | null
          faq?: Json
          h1?: string | null
          id?: string
          internal_link_suggestions?: Json | null
          intro_paragraph?: string | null
          meta_description?: string | null
          page_path?: string
          service?: string | null
          service_schema?: Json | null
          service_slug?: string | null
          status?: string
          title_tag?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: string
          feature_groups: Json | null
          id: string
          image_url: string | null
          is_active: boolean
          note: string | null
          price_label: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: string
          feature_groups?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          note?: string | null
          price_label?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string
          feature_groups?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          note?: string | null
          price_label?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
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
