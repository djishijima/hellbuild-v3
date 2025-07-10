import { createClient } from "@supabase/supabase-js"

// 環境変数の確認とエラーハンドリング
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL環境変数が設定されていません")
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY環境変数が設定されていません")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          employees: string | null
          revenue: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          employees?: string | null
          revenue?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          employees?: string | null
          revenue?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          position: string | null
          company_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          position?: string | null
          company_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          position?: string | null
          company_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          title: string
          company_id: string | null
          contact_id: string | null
          amount: number
          stage: string
          probability: number
          close_date: string | null
          owner: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company_id?: string | null
          contact_id?: string | null
          amount: number
          stage?: string
          probability?: number
          close_date?: string | null
          owner?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_id?: string | null
          contact_id?: string | null
          amount?: number
          stage?: string
          probability?: number
          close_date?: string | null
          owner?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          deal_id: string | null
          title: string
          description: string | null
          amount: number
          status: string
          priority: string
          requester_name: string
          requester_department: string | null
          approver_name: string | null
          approver_department: string | null
          submitted_date: string | null
          due_date: string | null
          approved_date: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_id?: string | null
          title: string
          description?: string | null
          amount: number
          status?: string
          priority?: string
          requester_name: string
          requester_department?: string | null
          approver_name?: string | null
          approver_department?: string | null
          submitted_date?: string | null
          due_date?: string | null
          approved_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_id?: string | null
          title?: string
          description?: string | null
          amount?: number
          status?: string
          priority?: string
          requester_name?: string
          requester_department?: string | null
          approver_name?: string | null
          approver_department?: string | null
          submitted_date?: string | null
          due_date?: string | null
          approved_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
