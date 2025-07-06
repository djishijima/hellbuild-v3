export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export interface User {
  id: string; // uuid
  employee_id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone?: string;
  notes?: string;
}

export interface PaymentRecipient {
  id: string; // uuid
  recipient_name: string;
  company_name: string;
  bank_code: string;
  bank_name: string;
  branch_code: string;
  branch_name: string;
  account_type: string;
  account_number: string;
  account_holder: string;
  contact_person?: string;
  email?: string;
  phone_number?: string;
  // Kept for search compatibility and display
  name_reading?: string; 
  address?: string;
}

export interface Customer {
  id: string; // uuid
  name: string;
  industry: string;
  contact_name: string;
  phone: string;
  email: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Lead {
  id: string; // uuid
  customer_id: string; // FK to Customer
  title: string;
  status: 'open' | 'closed' | 'lost';
  estimated_amount: number;
  responsible_user_id: string; // FK to User
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string; // uuid
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  assignee_id: string; // FK to User
  created_at: string;
  updated_at: string;
}

export interface OcrDocument {
  id: string; // uuid
  project_id: string; // FK
  title: string;
  page_count: number;
  paper_size: string;
  pdf_storage_url: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  created_at: string;
  updated_at: string;
}

export interface Transcription {
  id: string; // uuid
  title: string;
  audio_url: string;
  language: 'ja' | 'en';
  status: 'waiting' | 'transcribing' | 'complete' | 'error';
  transcript?: string;
  filler_removed_transcript?: string;
  created_at: string;
  updated_at: string;
}


export enum ApplicationCategory {
  EXP = 'EXP', // 経費
  TRP = 'TRP', // 交通費
  LEV = 'LEV', // 有休
  NOC = 'NOC', // 金額なし決裁
  APP = 'APP',
  ABS = 'ABS'
}

export interface ApplicationCode {
  id: string; // uuid
  code: string;
  name: string;
  category: ApplicationCategory;
  is_active: boolean;
  description?: string;
}

export enum ApprovalStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  Approved = 'approved',
  Rejected = 'rejected',
  Returned = 'returned'
}

// Form Data Structures
// Base fields common to all forms
interface BaseFormData {
  title: string;
  project_name?: string;
  remarks?: string;
}

export interface ExpFormData extends BaseFormData {
  subject: string; // 科目
  content: string; // 内容
  recipient_id: string; // 支払先 UUID
  amount: number; // 金額
  billing_date: string; // YYYY-MM-DD
  payment_due_date: string; // YYYY-MM-DD
  receipt_url?: string; // URL to the attached receipt
}

export interface TrpFormData extends BaseFormData {
  departure: string; // 出発地
  arrival: string; // 到着地
  via?: string; // 経由
  datetime: string; // YYYY-MM-DDTHH:mm
  amount: number;
  recipient_id: string; // 支払先 UUID (JR/交通機関など)
  receipt_url?: string;
}

export interface LevFormData extends BaseFormData {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  leave_type: 'full-day' | 'am-half' | 'pm-half'; // 全日／午前／午後
  alternate_contact?: string; // 代理対応者名
  reason: string;
}

export interface NocFormData extends BaseFormData {
  content: string; // 決裁内容
  approval_reason: string; // 承認理由
  attachment_url?: string;
}

export type FormData = ExpFormData | TrpFormData | LevFormData | NocFormData;

export interface Approval {
  id: string; // uuid
  applicant_id: string; // uuid of user
  application_code_id: string; // uuid from application_codes
  form_data: FormData;
  status: ApprovalStatus;
  submitted_at: string; // ISO 8601 string
  approved_at?: string; // ISO 8601 string
  approver_id?: string; // uuid of user
  remarks?: string;
  created_at: string; // ISO 8601 string
}

export enum Page {
  Dashboard = 'dashboard',
  Approvals = 'approvals',
  Customers = 'customers',
  Leads = 'leads',
  Tasks = 'tasks',
  OcrDocuments = 'ocr_documents',
  Transcriptions = 'transcriptions',
  // System Management
  Manual = 'manual',
  Users = 'users',
  Subjects = 'subjects',
  Recipients = 'recipients',
}