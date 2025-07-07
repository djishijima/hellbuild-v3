export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          employee_id: string
          email: string
          name: string
          role: "admin" | "manager" | "user"
          status: "active" | "inactive"
          avatar_url: string | null
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          email: string
          name: string
          role: "admin" | "manager" | "user"
          status?: "active" | "inactive"
          avatar_url?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          email?: string
          name?: string
          role?: "admin" | "manager" | "user"
          status?: "active" | "inactive"
          avatar_url?: string | null
          phone?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      payment_recipients: {
        Row: {
          id: string
          recipient_name: string
          company_name: string
          bank_code: string
          bank_name: string
          branch_code: string
          branch_name: string
          account_type: string
          account_number: string
          account_holder: string
          contact_person: string | null
          email: string | null
          phone_number: string | null
          name_reading: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_name: string
          company_name: string
          bank_code: string
          bank_name: string
          branch_code: string
          branch_name: string
          account_type: string
          account_number: string
          account_holder: string
          contact_person?: string | null
          email?: string | null
          phone_number?: string | null
          name_reading?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipient_name?: string
          company_name?: string
          bank_code?: string
          bank_name?: string
          branch_code?: string
          branch_name?: string
          account_type?: string
          account_number?: string
          account_holder?: string
          contact_person?: string | null
          email?: string | null
          phone_number?: string | null
          name_reading?: string | null
          address?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          applicant_id: string
          application_code_id: string
          form_data: any
          status: "draft" | "submitted" | "approved" | "rejected" | "returned"
          submitted_at: string | null
          approved_at: string | null
          approver_id: string | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          applicant_id: string
          application_code_id: string
          form_data: any
          status?: "draft" | "submitted" | "approved" | "rejected" | "returned"
          submitted_at?: string | null
          approved_at?: string | null
          approver_id?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          applicant_id?: string
          application_code_id?: string
          form_data?: any
          status?: "draft" | "submitted" | "approved" | "rejected" | "returned"
          submitted_at?: string | null
          approved_at?: string | null
          approver_id?: string | null
          remarks?: string | null
          updated_at?: string
        }
      }
      application_codes: {
        Row: {
          id: string
          code: string
          name: string
          category: "EXP" | "TRP" | "LEV" | "NOC" | "APP" | "ABS"
          is_active: boolean
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          category: "EXP" | "TRP" | "LEV" | "NOC" | "APP" | "ABS"
          is_active?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          category?: "EXP" | "TRP" | "LEV" | "NOC" | "APP" | "ABS"
          is_active?: boolean
          description?: string | null
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          industry: string
          contact_name: string
          phone: string
          email: string
          address: string | null
          status: "active" | "inactive"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry: string
          contact_name: string
          phone: string
          email: string
          address?: string | null
          status?: "active" | "inactive"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          contact_name?: string
          phone?: string
          email?: string
          address?: string | null
          status?: "active" | "inactive"
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "todo" | "in_progress" | "done"
          due_date: string | null
          priority: "low" | "medium" | "high"
          assignee_id: string
          project_name: string | null
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "todo" | "in_progress" | "done"
          due_date?: string | null
          priority?: "low" | "medium" | "high"
          assignee_id: string
          project_name?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: "todo" | "in_progress" | "done"
          due_date?: string | null
          priority?: "low" | "medium" | "high"
          assignee_id?: string
          project_name?: string | null
          progress?: number
          updated_at?: string
        }
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
  }
}
