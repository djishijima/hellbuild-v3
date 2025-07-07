export interface ParsedFileData {
  application_code_id?: string
  title?: string
  project_name?: string
  remarks?: string
  subject?: string
  content?: string
  recipient_id?: string
  amount?: number
  billing_date?: string
  payment_due_date?: string
  departure?: string
  arrival?: string
  via?: string
  datetime?: string
  start_date?: string
  end_date?: string
  leave_type?: string
  alternate_contact?: string
  reason?: string
  approval_content?: string
  approval_reason?: string
  [key: string]: any
}

export async function parseFileWithAI(file: File): Promise<ParsedFileData> {
  // Simulate AI parsing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock parsed data based on file name or content
  const fileName = file.name.toLowerCase()

  if (fileName.includes("経費") || fileName.includes("expense")) {
    return {
      application_code_id: "1", // 経費
      title: "出張費用申請",
      subject: "旅費交通費",
      content: "AI解析により抽出された経費内容",
      amount: 50000,
      billing_date: "2024-01-15",
      payment_due_date: "2024-01-30",
    }
  }

  if (fileName.includes("有給") || fileName.includes("休暇") || fileName.includes("leave")) {
    return {
      application_code_id: "2", // 有給休暇
      title: "有給休暇申請",
      start_date: "2024-02-01",
      end_date: "2024-02-02",
      leave_type: "full-day",
      reason: "AI解析により抽出された休暇理由",
    }
  }

  // Default return for other files
  return {
    title: "AI解析による申請",
    content: "ファイルから抽出された内容",
  }
}
