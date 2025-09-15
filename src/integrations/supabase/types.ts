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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_by: string | null
          candidate_id: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          message: string | null
          resume_file_url: string | null
          resume_id: string | null
          resume_link: string | null
          vacancy_id: string
        }
        Insert: {
          applied_by?: string | null
          candidate_id: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          message?: string | null
          resume_file_url?: string | null
          resume_id?: string | null
          resume_link?: string | null
          vacancy_id: string
        }
        Update: {
          applied_by?: string | null
          candidate_id?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          message?: string | null
          resume_file_url?: string | null
          resume_id?: string | null
          resume_link?: string | null
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      apply_audit: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          vacancy_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          vacancy_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apply_audit_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_log: {
        Row: {
          access_type: string
          accessed_id: string | null
          accessed_table: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_id?: string | null
          accessed_table: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_id?: string | null
          accessed_table?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          employer_email: string
          employment_type: string | null
          id: string
          location: string | null
          requirements: string | null
          salary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          employer_email: string
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          employer_email?: string
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      outbox_webhooks: {
        Row: {
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          payload: Json
          status: string
          try_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          last_error?: string | null
          payload: Json
          status?: string
          try_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
          status?: string
          try_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      resume_access: {
        Row: {
          has_access: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          has_access?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          has_access?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          candidate_id: string
          created_at: string
          education: Json | null
          email: string
          experience: Json | null
          full_name: string
          id: string
          phone: string
          raw_text: string | null
          skills: string[] | null
          summary: string | null
          views: number
        }
        Insert: {
          candidate_id: string
          created_at?: string
          education?: Json | null
          email: string
          experience?: Json | null
          full_name: string
          id?: string
          phone: string
          raw_text?: string | null
          skills?: string[] | null
          summary?: string | null
          views?: number
        }
        Update: {
          candidate_id?: string
          created_at?: string
          education?: Json | null
          email?: string
          experience?: Json | null
          full_name?: string
          id?: string
          phone?: string
          raw_text?: string | null
          skills?: string[] | null
          summary?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "resumes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vacancies: {
        Row: {
          created_at: string
          description: string | null
          employer_id: string
          employment_type: string | null
          id: string
          location: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          views: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          employer_id: string
          employment_type?: string | null
          id?: string
          location?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          views?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          employer_id?: string
          employment_type?: string | null
          id?: string
          location?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "vacancies_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      applications_employer_safe: {
        Row: {
          applicant_name: string | null
          applied_by: string | null
          candidate_id: string | null
          contact_email: string | null
          created_at: string | null
          id: string | null
          message: string | null
          resume_file_url: string | null
          resume_id: string | null
          resume_link: string | null
          vacancy_id: string | null
        }
        Insert: {
          applicant_name?: never
          applied_by?: string | null
          candidate_id?: string | null
          contact_email?: never
          created_at?: string | null
          id?: string | null
          message?: string | null
          resume_file_url?: string | null
          resume_id?: string | null
          resume_link?: string | null
          vacancy_id?: string | null
        }
        Update: {
          applicant_name?: never
          applied_by?: string | null
          candidate_id?: string | null
          contact_email?: never
          created_at?: string | null
          id?: string | null
          message?: string | null
          resume_file_url?: string | null
          resume_id?: string | null
          resume_link?: string | null
          vacancy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs_public: {
        Row: {
          company_name: string | null
          created_at: string | null
          description: string | null
          employment_type: string | null
          id: string | null
          location: string | null
          requirements: string | null
          salary: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string | null
          location?: string | null
          requirements?: string | null
          salary?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string | null
          location?: string | null
          requirements?: string | null
          salary?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resumes_public_safe: {
        Row: {
          created_at: string | null
          education: Json | null
          experience: Json | null
          id: string | null
          skills: string[] | null
          summary: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          id?: string | null
          skills?: string[] | null
          summary?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          id?: string | null
          skills?: string[] | null
          summary?: string | null
          views?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_job_contact_info: {
        Args: { job_id_param: string }
        Returns: {
          employer_email: string
        }[]
      }
      get_job_employer_email: {
        Args: { job_id: string }
        Returns: string
      }
      get_public_jobs: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          created_at: string
          description: string
          employment_type: string
          id: string
          location: string
          requirements: string
          salary: string
          title: string
          updated_at: string
        }[]
      }
      get_public_jobs_safe: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          created_at: string
          description: string
          employment_type: string
          id: string
          location: string
          requirements: string
          salary: string
          title: string
          updated_at: string
        }[]
      }
      get_public_resumes_safe: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          education: Json
          experience: Json
          id: string
          skills: string[]
          summary: string
          views: number
        }[]
      }
      get_resume_details: {
        Args: { resume_id_param: string }
        Returns: {
          candidate_id: string
          created_at: string
          education: Json
          email: string
          experience: Json
          full_name: string
          id: string
          phone: string
          raw_text: string
          skills: string[]
          summary: string
          views: number
        }[]
      }
    }
    Enums: {
      user_role: "employer" | "candidate"
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
    Enums: {
      user_role: ["employer", "candidate"],
    },
  },
} as const
