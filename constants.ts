import {
  type ApplicationCode,
  ApplicationCategory,
  type PaymentRecipient,
  type User,
  UserRole,
  UserStatus,
} from "./types"

export const MOCK_APPLICATION_CODES: ApplicationCode[] = [
  {
    id: "1",
    code: "EXP001",
    name: "経費",
    category: ApplicationCategory.EXP,
    is_active: true,
    description: "一般的な経費申請",
  },
  {
    id: "2",
    code: "LEV001",
    name: "有給休暇",
    category: ApplicationCategory.LEV,
    is_active: true,
    description: "有給休暇申請",
  },
  {
    id: "3",
    code: "NOC001",
    name: "金額なし決裁",
    category: ApplicationCategory.NOC,
    is_active: true,
    description: "金額を伴わない決裁申請",
  },
]

export const MOCK_PAYMENT_RECIPIENTS: PaymentRecipient[] = [
  {
    id: "1",
    recipient_name: "東京リスマチック",
    company_name: "東京リスマチック株式会社",
    bank_code: "0001",
    bank_name: "みずほ銀行",
    branch_code: "001",
    branch_name: "本店",
    account_type: "普通",
    account_number: "1234567",
    account_holder: "トウキョウリスマチック",
    name_reading: "とうきょうりすまちっく",
    email: "info@tokyo-lis.co.jp",
    phone_number: "03-1234-5678",
  },
  {
    id: "2",
    recipient_name: "ピコシステム",
    company_name: "ピコシステム株式会社",
    bank_code: "0005",
    bank_name: "三菱UFJ銀行",
    branch_code: "002",
    branch_name: "新宿支店",
    account_type: "普通",
    account_number: "7654321",
    account_holder: "ピコシステム",
    name_reading: "ぴこしすてむ",
    email: "contact@pico-sys.com",
    phone_number: "03-9876-5432",
  },
]

export const MOCK_USERS: User[] = [
  {
    id: "1",
    employee_id: "EMP001",
    email: "tanaka@example.com",
    name: "田中太郎",
    role: UserRole.Admin,
    status: UserStatus.Active,
  },
  {
    id: "2",
    employee_id: "EMP002",
    email: "sato@example.com",
    name: "佐藤花子",
    role: UserRole.Manager,
    status: UserStatus.Active,
  },
  {
    id: "3",
    employee_id: "EMP003",
    email: "suzuki@example.com",
    name: "鈴木一郎",
    role: UserRole.User,
    status: UserStatus.Active,
  },
]

export const MOCK_TASKS = [
  {
    id: "1",
    title: "システム仕様書の作成",
    assignee_id: "1",
    status: "in_progress" as const,
    priority: "high" as const,
    due_date: "2024-01-20",
    updated_at: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    title: "データベース設計レビュー",
    assignee_id: "2",
    status: "done" as const,
    priority: "medium" as const,
    due_date: "2024-01-18",
    updated_at: "2024-01-14T15:30:00Z",
  },
]
