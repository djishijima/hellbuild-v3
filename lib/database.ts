import { supabase } from "./supabase"
import type { Database } from "@/types/database"

type Tables = Database["public"]["Tables"]

// Users
export async function getUsers() {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createUser(user: Tables["users"]["Insert"]) {
  const { data, error } = await supabase.from("users").insert(user).select().single()

  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: Tables["users"]["Update"]) {
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) throw error
}

// Payment Recipients
export async function getPaymentRecipients() {
  const { data, error } = await supabase
    .from("payment_recipients")
    .select("*")
    .eq("is_active", true)
    .order("recipient_name")

  if (error) throw error
  return data
}

export async function createPaymentRecipient(recipient: Tables["payment_recipients"]["Insert"]) {
  const { data, error } = await supabase.from("payment_recipients").insert(recipient).select().single()

  if (error) throw error
  return data
}

export async function updatePaymentRecipient(id: string, updates: Tables["payment_recipients"]["Update"]) {
  const { data, error } = await supabase
    .from("payment_recipients")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deactivatePaymentRecipient(id: string) {
  const { data, error } = await supabase
    .from("payment_recipients")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Approvals
export async function getApprovals() {
  const { data, error } = await supabase
    .from("approvals")
    .select(`
      *,
      applicant:users!approvals_applicant_id_fkey(name, employee_id),
      approver:users!approvals_approver_id_fkey(name, employee_id),
      application_code:application_codes(name, code, category)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createApproval(approval: Tables["approvals"]["Insert"]) {
  const { data, error } = await supabase.from("approvals").insert(approval).select().single()

  if (error) throw error
  return data
}

export async function updateApproval(id: string, updates: Tables["approvals"]["Update"]) {
  const { data, error } = await supabase
    .from("approvals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function approveApproval(id: string, approverId: string, remarks?: string) {
  const { data, error } = await supabase
    .from("approvals")
    .update({
      status: "approved",
      approver_id: approverId,
      approved_at: new Date().toISOString(),
      remarks,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function rejectApproval(id: string, approverId: string, remarks: string) {
  const { data, error } = await supabase
    .from("approvals")
    .update({
      status: "rejected",
      approver_id: approverId,
      remarks,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Application Codes
export async function getApplicationCodes() {
  const { data, error } = await supabase.from("application_codes").select("*").eq("is_active", true).order("code")

  if (error) throw error
  return data
}

export async function createApplicationCode(code: Tables["application_codes"]["Insert"]) {
  const { data, error } = await supabase.from("application_codes").insert(code).select().single()

  if (error) throw error
  return data
}

// Customers
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createCustomer(customer: Tables["customers"]["Insert"]) {
  const { data, error } = await supabase.from("customers").insert(customer).select().single()

  if (error) throw error
  return data
}

// Tasks
export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      assignee:users!tasks_assignee_id_fkey(name, employee_id)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createTask(task: Tables["tasks"]["Insert"]) {
  const { data, error } = await supabase.from("tasks").insert(task).select().single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Tables["tasks"]["Update"]) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Dashboard Statistics
export async function getDashboardStats() {
  const [
    { count: totalUsers },
    { count: totalApprovals },
    { count: pendingApprovals },
    { count: totalCustomers },
    { count: totalTasks },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("approvals").select("*", { count: "exact", head: true }),
    supabase.from("approvals").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
  ])

  return {
    totalUsers: totalUsers || 0,
    totalApprovals: totalApprovals || 0,
    pendingApprovals: pendingApprovals || 0,
    totalCustomers: totalCustomers || 0,
    totalTasks: totalTasks || 0,
  }
}
