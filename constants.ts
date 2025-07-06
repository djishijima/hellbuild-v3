import { User, Approval, ApplicationCode, UserRole, UserStatus, ApplicationCategory, ApprovalStatus, PaymentRecipient, Customer, Lead, Task, OcrDocument, Transcription } from './types';

export const MOCK_USERS: User[] = [
  { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', employee_id: '850195', email: 'taro.tanaka@example.com', name: '田中 太郎', role: UserRole.User, status: UserStatus.Active, avatar_url: 'https://i.pravatar.cc/150?u=850195' },
  { id: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0', employee_id: '850210', email: 'hanako.suzuki@example.com', name: '鈴木 花子', role: UserRole.User, status: UserStatus.Active, avatar_url: 'https://i.pravatar.cc/150?u=850210' },
  { id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01', employee_id: '830001', email: 'ichiro.sato@example.com', name: '佐藤 一郎', role: UserRole.Manager, status: UserStatus.Active, avatar_url: 'https://i.pravatar.cc/150?u=830001' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890123def012', employee_id: '810001', email: 'yoko.watanabe@example.com', name: '渡辺 陽子', role: UserRole.Admin, status: UserStatus.Active, avatar_url: 'https://i.pravatar.cc/150?u=810001' },
];

export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'cust-001', name: '株式会社グローバルテック', industry: 'ITサービス', contact_name: '山田 健一', phone: '03-1111-2222', email: 'k.yamada@globaltech.co.jp', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-05-20T14:00:00Z' },
    { id: 'cust-002', name: 'ネクストステップ物流', industry: '運輸・倉庫', contact_name: '佐藤 美咲', phone: '06-3333-4444', email: 'misaki.sato@nextstep-logi.com', created_at: '2023-03-10T11:30:00Z', updated_at: '2024-06-15T09:00:00Z' },
    { id: 'cust-003', name: 'クリエイティブデザインスタジオ', industry: 'デザイン・広告', contact_name: '鈴木 浩', phone: '090-5555-6666', email: 'h.suzuki@creative-ds.jp', created_at: '2023-08-22T16:00:00Z', updated_at: '2024-04-30T18:00:00Z' },
];

export const MOCK_LEADS: Lead[] = [
    { id: 'lead-001', customer_id: 'cust-001', title: '新会計システム導入支援', status: 'open', estimated_amount: 5000000, responsible_user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', created_at: '2024-06-01T10:00:00Z', updated_at: '2024-07-01T15:00:00Z' },
    { id: 'lead-002', customer_id: 'cust-002', title: '倉庫管理システム(WMS)更新', status: 'closed', estimated_amount: 12000000, responsible_user_id: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0', created_at: '2024-03-15T14:20:00Z', updated_at: '2024-05-30T11:00:00Z' },
    { id: 'lead-003', customer_id: 'cust-003', title: 'コーポレートサイトリニューアル', status: 'lost', estimated_amount: 2500000, responsible_user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', created_at: '2024-05-20T09:00:00Z', updated_at: '2024-06-25T17:00:00Z' },
];

export const MOCK_TASKS: Task[] = [
    { id: 'task-001', title: 'A社向け提案書作成', description: '来週の打ち合わせまでに提案書を完成させる', status: 'in_progress', due_date: '2024-07-15', priority: 'high', assignee_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', created_at: '2024-07-05T10:00:00Z', updated_at: '2024-07-06T14:00:00Z' },
    { id: 'task-002', title: '経費精算システムのテスト', description: '新しい項目のバリデーションを確認する', status: 'todo', due_date: '2024-07-20', priority: 'medium', assignee_id: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0', created_at: '2024-07-04T11:00:00Z', updated_at: '2024-07-04T11:00:00Z' },
    { id: 'task-003', title: 'チーム定例の議事録作成', description: '昨日の定例会議の議事録を共有', status: 'done', due_date: '2024-07-04', priority: 'low', assignee_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', created_at: '2024-07-03T16:00:00Z', updated_at: '2024-07-04T09:30:00Z' },
];

export const MOCK_OCR_DOCUMENTS: OcrDocument[] = [
    { id: 'ocr-doc-001', project_id: 'proj-123', title: '2024年度第1四半期_取締役会議事録', page_count: 15, paper_size: 'A4', pdf_storage_url: '#', status: 'complete', created_at: '2024-04-25T10:00:00Z', updated_at: '2024-04-25T11:30:00Z' },
    { id: 'ocr-doc-002', project_id: 'proj-456', title: '新規事業企画書_v3', page_count: 32, paper_size: 'A4', pdf_storage_url: '#', status: 'processing', created_at: '2024-07-01T14:00:00Z', updated_at: '2024-07-01T14:05:00Z' },
    { id: 'ocr-doc-003', project_id: 'proj-789', title: 'RFP-2024-001_受領書類', page_count: 150, paper_size: 'A4', pdf_storage_url: '#', status: 'error', created_at: '2024-06-28T09:00:00Z', updated_at: '2024-06-28T09:15:00Z' },
];

export const MOCK_TRANSCRIPTIONS: Transcription[] = [
    { id: 'trans-001', title: '20240701_営業部定例MTG', audio_url: '#', language: 'ja', status: 'complete', created_at: '2024-07-01T10:00:00Z', updated_at: '2024-07-01T10:45:00Z' },
    { id: 'trans-002', title: '顧客ヒアリング_グローバルテック様', audio_url: '#', language: 'ja', status: 'transcribing', created_at: '2024-07-02T15:00:00Z', updated_at: '2024-07-02T15:10:00Z' },
    { id: 'trans-003', title: 'Interview with John Smith (EN)', audio_url: '#', language: 'en', status: 'waiting', created_at: '2024-07-03T11:00:00Z', updated_at: '2024-07-03T11:00:00Z' },
];

export const MOCK_PAYMENT_RECIPIENTS: PaymentRecipient[] = [
    { 
        id: '1e6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c',
        recipient_name: '株式会社サンプル商事',
        company_name: '株式会社サンプル商事',
        bank_code: '0001', bank_name: 'みずほ銀行', branch_code: '123', branch_name: '本店',
        account_type: '当座', account_number: '1234567', account_holder: 'カ)サンプルシヨウジ',
        name_reading: 'カブシキガイシャサンプルショウジ', 
        address: '東京都千代田区丸の内1-1-1', 
        phone_number: '03-1234-5678', email: 'info@sample-corp.co.jp'
    },
    { 
        id: '2f7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
        recipient_name: '有限会社デザイン工房',
        company_name: '有限会社デザイン工房',
        bank_code: '0005', bank_name: '三菱UFJ銀行', branch_code: '456', branch_name: '横浜支店',
        account_type: '普通', account_number: '7654321', account_holder: 'ユ)デザインコウボウ',
        name_reading: 'ユウゲンガイシャデザインコウボウ', 
        address: '神奈川県横浜市西区みなとみらい2-2-2', 
        phone_number: '045-987-6543', email: 'contact@design-kobo.co.jp'
    },
    { 
        id: '3a8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1e2f',
        recipient_name: 'Tech Solutions Inc.',
        company_name: 'Tech Solutions Inc.',
        bank_code: '0009', bank_name: '三井住友銀行', branch_code: '789', branch_name: '渋谷支店',
        account_type: '普通', account_number: '1122334', account_holder: 'TECH SOLUTIONS INC.',
        name_reading: 'テックソリューションズインク',
        address: '東京都渋谷区渋谷3-3-3',
        phone_number: '03-5555-8888', email: 'sales@techsolutions.com'
    },
    { 
        id: '4b9d0e1f-2a3b-4c5d-6e7f8a9b0c1e2f3a',
        recipient_name: 'JR東日本',
        company_name: '東日本旅客鉄道株式会社',
        bank_code: '9900', bank_name: 'ゆうちょ銀行', branch_code: '018', branch_name: '本店',
        account_type: '普通', account_number: '9988776', account_holder: 'ヒガシニホンリヨカクテツドウ(カ',
        name_reading: 'ジェイアールヒガシニホン',
    },
    { 
        id: '5c0e1f2a-3b4c-5d6e-7f8a9b0c1e2f3a4b',
        recipient_name: '日本交通株式会社',
        company_name: '日本交通株式会社',
        bank_code: '0001', bank_name: 'みずほ銀行', branch_code: '555', branch_name: '赤坂支店',
        account_type: '当座', account_number: '5566778', account_holder: 'ニホンコウツウ(カ',
        name_reading: 'ニホンコウツウカブシキガイシャ',
    },
];

export const MOCK_APPLICATION_CODES: ApplicationCode[] = [
  { id: 'code-exp-01', code: 'EXP-001', name: '経費', category: ApplicationCategory.EXP, is_active: true, description: '通常の経費申請' },
  { id: 'code-trp-01', code: 'TRP-001', name: '交通費', category: ApplicationCategory.TRP, is_active: true, description: '出張や移動に伴う交通費' },
  { id: 'code-lev-01', code: 'LEV-001', name: '有給休暇', category: ApplicationCategory.LEV, is_active: true, description: '有給休暇の取得申請' },
  { id: 'code-noc-01', code: 'NOC-001', name: '金額なし決裁', category: ApplicationCategory.NOC, is_active: true, description: '金額の発生しない稟議' },
];

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'appr-001',
    applicant_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    application_code_id: 'code-exp-01',
    form_data: {
      title: 'クライアントとの会食費用',
      subject: '接待交際費',
      content: 'A社様とのプロジェクト打ち上げ会食',
      recipient_id: '1e6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c',
      amount: 15000,
      billing_date: '2024-06-28',
      payment_due_date: '2024-07-31',
      receipt_url: 'https://example.com/receipt.pdf'
    },
    status: ApprovalStatus.Approved,
    submitted_at: '2024-07-01T10:00:00Z',
    approved_at: '2024-07-02T14:30:00Z',
    approver_id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01',
    remarks: 'クライアントとの重要な会食のため承認します。次回は事前に予算申請も行うようにしてください。',
    created_at: '2024-07-01T09:30:00Z',
  },
  {
    id: 'appr-002',
    applicant_id: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
    application_code_id: 'code-trp-01',
    form_data: {
      title: '大阪出張 交通費',
      departure: '東京駅',
      arrival: '新大阪駅',
      datetime: '2024-07-03T09:00',
      amount: 28500,
      recipient_id: '4b9d0e1f-2a3b-4c5d-6e7f8a9b0c1e2f3a',
    },
    status: ApprovalStatus.Submitted,
    submitted_at: '2024-07-04T09:00:00Z',
    created_at: '2024-07-04T08:55:00Z',
    remarks: 'A社への定例訪問のため。'
  },
  {
    id: 'appr-003',
    applicant_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    application_code_id: 'code-lev-01',
    form_data: {
      title: '夏季休暇申請',
      start_date: '2024-08-10',
      end_date: '2024-08-15',
      leave_type: 'full-day',
      reason: '私用のため夏季休暇を取得します。',
      alternate_contact: '鈴木 花子'
    },
    status: ApprovalStatus.Approved,
    submitted_at: '2024-06-20T17:00:00Z',
    approved_at: '2024-06-21T10:00:00Z',
    approver_id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01',
    created_at: '2024-06-20T16:58:00Z',
  },
  {
    id: 'appr-004',
    applicant_id: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
    application_code_id: 'code-noc-01',
    form_data: {
      title: '新規取引先（B社）との契約締結に関する稟議',
      content: '新規取引先であるB社との業務提携契約を締結する件について。',
      approval_reason: 'B社は当社の新規事業領域における重要なパートナーとなるため、契約を締結したい。契約書ドラフトを添付します。法務レビュー済み。',
      attachment_url: '#'
    },
    status: ApprovalStatus.Rejected,
    submitted_at: '2024-07-05T11:00:00Z',
    approver_id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01',
    remarks: 'リスク評価の項目が不足しています。再提出してください。',
    created_at: '2024-07-05T10:50:00Z',
  },
   {
    id: 'appr-005',
    applicant_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    application_code_id: 'code-exp-01',
    form_data: {
      title: 'チームビルディング用のお菓子代',
      subject: '福利厚生費',
      content: 'チーム月次定例のためのお菓子購入',
      recipient_id: '2f7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
      amount: 3500,
      billing_date: '2024-07-06',
      payment_due_date: '2024-07-06',
    },
    status: ApprovalStatus.Returned,
    submitted_at: '2024-07-06T14:00:00Z',
    approver_id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01',
    remarks: '領収書の宛名が個人名になっています。会社名で再発行してもらってください。',
    created_at: '2024-07-06T13:45:00Z',
  },
];