export enum UserRole {
  Admin = "admin",
  Manager = "manager",
  User = "user",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface User {
  id: string
  employee_id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  phone?: string
  notes?: string
}

export interface PaymentRecipient {
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
  contact_person?: string
  email?: string
  phone_number?: string
  name_reading?: string
  address?: string
}

export interface Customer {
  id: string
  name: string
  industry: string
  contact_name: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  customer_id: string
  title: string
  status: "open" | "closed" | "lost"
  estimated_amount: number
  responsible_user_id: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  due_date: string
  priority: "low" | "medium" | "high"
  assignee_id: string
  created_at: string
  updated_at: string
}

export interface OcrDocument {
  id: string
  project_id: string
  title: string
  page_count: number
  paper_size: string
  pdf_storage_url: string
  status: "pending" | "processing" | "complete" | "error"
  created_at: string
  updated_at: string
}

export interface Transcription {
  id: string
  title: string
  audio_url: string
  language: "ja" | "en"
  status: "waiting" | "transcribing" | "complete" | "error"
  transcript?: string
  filler_removed_transcript?: string
  created_at: string
  updated_at: string
}

export enum ApplicationCategory {
  EXP = "EXP",
  TRP = "TRP",
  LEV = "LEV",
  NOC = "NOC",
  APP = "APP",
  ABS = "ABS",
}

export interface ApplicationCode {
  id: string
  code: string
  name: string
  category: ApplicationCategory
  is_active: boolean
  description?: string
}

export enum ApprovalStatus {
  Draft = "draft",
  Submitted = "submitted",
  Approved = "approved",
  Rejected = "rejected",
  Returned = "returned",
}

interface BaseFormData {
  title: string
  project_name?: string
  remarks?: string
}

export interface ExpFormData extends BaseFormData {
  subject: string
  content: string
  recipient_id: string
  amount: number
  billing_date: string
  payment_due_date: string
  receipt_url?: string
}

export interface TrpFormData extends BaseFormData {
  departure: string
  arrival: string
  via?: string
  datetime: string
  amount: number
  recipient_id: string
  receipt_url?: string
}

export interface LevFormData extends BaseFormData {
  start_date: string
  end_date: string
  leave_type: "full-day" | "am-half" | "pm-half"
  alternate_contact?: string
  reason: string
}

export interface NocFormData extends BaseFormData {
  content: string
  approval_reason: string
  attachment_url?: string
}

export type FormData = ExpFormData | TrpFormData | LevFormData | NocFormData

export interface Approval {
  id: string
  applicant_id: string
  application_code_id: string
  form_data: FormData
  status: ApprovalStatus
  submitted_at: string
  approved_at?: string
  approver_id?: string
  remarks?: string
  created_at: string
}

export enum Page {
  Dashboard = "dashboard",
  Approvals = "approvals",
  Customers = "customers",
  Leads = "leads",
  Tasks = "tasks",
  OcrDocuments = "ocr_documents",
  Transcriptions = "transcriptions",
  Manual = "manual",
  Users = "users",
  Subjects = "subjects",
  Recipients = "recipients",
}
