"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string
  const industry = formData.get("industry") as string
  const employees = formData.get("employees") as string
  const revenue = Number.parseInt(formData.get("revenue") as string) || 0

  const { error } = await supabase.from("companies").insert([{ name, industry, employees, revenue }])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/companies")
  return { success: true }
}

export async function createContact(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const position = formData.get("position") as string
  const company_id = formData.get("company_id") as string

  const { error } = await supabase.from("contacts").insert([{ name, email, phone, position, company_id }])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/contacts")
  return { success: true }
}

export async function createDeal(formData: FormData) {
  const title = formData.get("title") as string
  const company_id = formData.get("company_id") as string
  const contact_id = formData.get("contact_id") as string
  const amount = Number.parseInt(formData.get("amount") as string)
  const stage = formData.get("stage") as string
  const probability = Number.parseInt(formData.get("probability") as string)
  const close_date = formData.get("close_date") as string
  const owner = formData.get("owner") as string
  const description = formData.get("description") as string

  const { error } = await supabase.from("deals").insert([
    {
      title,
      company_id,
      contact_id,
      amount,
      stage,
      probability,
      close_date,
      owner,
      description,
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/deals")
  return { success: true }
}

export async function createApproval(formData: FormData) {
  const deal_id = formData.get("deal_id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const amount = Number.parseInt(formData.get("amount") as string)
  const priority = formData.get("priority") as string
  const requester_name = formData.get("requester_name") as string
  const requester_department = formData.get("requester_department") as string
  const approver_name = formData.get("approver_name") as string
  const due_date = formData.get("due_date") as string

  const { error } = await supabase.from("approvals").insert([
    {
      deal_id,
      title,
      description,
      amount,
      priority,
      requester_name,
      requester_department,
      approver_name,
      due_date,
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/approvals")
  return { success: true }
}

export async function updateApprovalStatus(
  approvalId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updateData.approved_date = new Date().toISOString().split("T")[0]
  } else if (status === "rejected" && rejectionReason) {
    updateData.rejection_reason = rejectionReason
  }

  const { error } = await supabase.from("approvals").update(updateData).eq("id", approvalId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/approvals")
  return { success: true }
}

export async function updateDealStage(dealId: string, stage: string, probability: number) {
  const { error } = await supabase
    .from("deals")
    .update({ stage, probability, updated_at: new Date().toISOString() })
    .eq("id", dealId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/deals")
  return { success: true }
}
