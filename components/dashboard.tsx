"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Database,
  RefreshCw,
  Play,
  Settings,
} from "lucide-react"
import ContactsTab from "./contacts-tab"
import DealsTab from "./deals-tab"
import ApprovalTab from "./approval-tab"
import CompaniesTab from "./companies-tab"

interface DashboardStats {
  totalContacts: number
  totalCompanies: number
  activeDeals: number
  pendingApprovals: number
  monthlyRevenue: number
}

interface RecentApproval {
  id: string
  title: string
  amount: number
  status: string
  requester_name: string
  submitted_date: string
}

// モックデータ
const mockStats: DashboardStats = {
  totalContacts: 25,
  totalCompanies: 12,
  activeDeals: 8,
  pendingApprovals: 3,
  monthlyRevenue: 15420000,
}

const mockRecentApprovals: RecentApproval[] = [
  {
    id: "1",
    title: "株式会社ABC - 年間保守契約",
    amount: 2400000,
    status: "pending",
    requester_name: "営業担当A",
    submitted_date: "2024-01-15",
  },
  {
    id: "2",
    title: "XYZ商事 - システム導入",
    amount: 8500000,
    status: "pending",
    requester_name: "営業担当B",
    submitted_date: "2024-01-14",
  },
  {
    id: "3",
    title: "グローバル企業 - セキュリティ強化",
    amount: 3500000,
    status: "approved",
    requester_name: "営業担当E",
    submitted_date: "2024-01-10",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentApprovals, setRecentApprovals] = useState<RecentApproval[]>(mockRecentApprovals)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  useEffect(() => {
    checkSupabaseConfiguration()
  }, [])

  const checkSupabaseConfiguration = async () => {
    try {
      setLoading(true)
      setError(null)
      setDebugInfo("Supabase設定を確認中...")

      // 環境変数の確認
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setNeedsSetup(true)
        setSupabaseConfigured(false)
        setError("Supabase環境変数が設定されていません")
        setDebugInfo(`
環境変数の設定状況:
- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "設定済み" : "未設定"}
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "設定済み" : "未設定"}

Supabaseプロジェクトを作成し、環境変数を設定してください。
        `)
        return
      }

      setSupabaseConfigured(true)
      setDebugInfo("Supabase設定確認完了")

      // Supabaseが設定されている場合のみデータベース確認
      await checkDatabaseAndLoadData()
    } catch (error: any) {
      console.error("Supabase configuration error:", error)
      setError(`Supabase設定エラー: ${error.message}`)
      setNeedsSetup(true)
    } finally {
      setLoading(false)
    }
  }

  const checkDatabaseAndLoadData = async () => {
    try {
      // Supabaseクライアントを動的にインポート
      const { supabase } = await import("@/lib/supabase")

      setDebugInfo("データベース接続を確認中...")

      // データベース接続確認
      const { data, error: dbError } = await supabase.from("companies").select("id", { count: "exact", head: true })

      if (dbError) {
        console.error("Database error:", dbError)
        setDebugInfo(`データベースエラー: ${dbError.message} (コード: ${dbError.code})`)

        if (
          dbError.message.includes("does not exist") ||
          dbError.message.includes("relation") ||
          dbError.code === "42P01" ||
          dbError.message.includes("table") ||
          dbError.message.includes("schema")
        ) {
          setNeedsSetup(true)
          setError("データベーステーブルが存在しません。")
          return
        }
        throw dbError
      }

      setDebugInfo("テーブルが存在します。データを読み込み中...")
      await loadDashboardData()
      setDebugInfo("データ読み込み完了！")
      setNeedsSetup(false)
    } catch (error: any) {
      console.error("Error in checkDatabaseAndLoadData:", error)
      setDebugInfo(`エラー詳細: ${error.message}`)

      if (
        error.message?.includes("does not exist") ||
        error.code === "42P01" ||
        error.message?.includes("relation") ||
        error.message?.includes("table")
      ) {
        setNeedsSetup(true)
        setError("データベーステーブルが存在しません。")
      } else {
        setError(error.message || "データベースエラーが発生しました")
      }
    }
  }

  const createTablesDirectly = async () => {
    try {
      setLoading(true)
      setError(null)
      setDebugInfo("データベースを初期化中...")

      // Supabaseクライアントを動的にインポート
      const { supabase } = await import("@/lib/supabase")

      setDebugInfo("サンプルデータを直接挿入中...")
      await insertSampleData()

      setDebugInfo("データベース初期化完了！")
      await loadDashboardData()
      setNeedsSetup(false)
    } catch (error: any) {
      console.error("Database initialization error:", error)
      setError(`データベース初期化エラー: ${error.message}`)
      setDebugInfo(`
エラー詳細: ${error.message}

注意: このエラーは以下の理由で発生する可能性があります:
1. Supabaseプロジェクトでテーブルが作成されていない
2. Row Level Security (RLS) が有効になっている
3. 適切な権限が設定されていない

解決方法:
1. Supabase Dashboard でテーブルを手動作成
2. RLS を無効化
3. 適切な権限を設定
      `)
    } finally {
      setLoading(false)
    }
  }

  const insertSampleData = async () => {
    try {
      const { supabase } = await import("@/lib/supabase")

      setDebugInfo("企業データを挿入中...")
      // サンプル企業データ挿入
      const { data: companiesData, error: companiesInsertError } = await supabase
        .from("companies")
        .insert([
          {
            name: "株式会社ABC",
            industry: "IT・ソフトウェア",
            employees: "500-1000",
            revenue: 5000000000,
            status: "customer",
          },
          { name: "XYZ商事", industry: "商社・卸売", employees: "100-500", revenue: 2000000000, status: "prospect" },
          { name: "株式会社DEF", industry: "製造業", employees: "1000+", revenue: 10000000000, status: "customer" },
          {
            name: "テクノロジー株式会社",
            industry: "IT・ソフトウェア",
            employees: "50-100",
            revenue: 500000000,
            status: "prospect",
          },
          {
            name: "グローバル企業",
            industry: "金融・保険",
            employees: "500-1000",
            revenue: 8000000000,
            status: "customer",
          },
        ])
        .select()

      if (companiesInsertError) {
        console.error("Companies insert error:", companiesInsertError)
        throw new Error(`企業データ挿入エラー: ${companiesInsertError.message}`)
      }

      if (!companiesData || companiesData.length === 0) {
        throw new Error("企業データの挿入に失敗しました")
      }

      setDebugInfo("連絡先データを挿入中...")
      // サンプル連絡先データ挿入
      const { data: contactsData, error: contactsInsertError } = await supabase
        .from("contacts")
        .insert([
          {
            name: "田中太郎",
            email: "tanaka@abc.com",
            phone: "03-1234-5678",
            position: "営業部長",
            company_id: companiesData.find((c) => c.name === "株式会社ABC")?.id,
            status: "active",
          },
          {
            name: "佐藤花子",
            email: "sato@xyz.com",
            phone: "03-2345-6789",
            position: "マネージャー",
            company_id: companiesData.find((c) => c.name === "XYZ商事")?.id,
            status: "active",
          },
          {
            name: "山田次郎",
            email: "yamada@def.co.jp",
            phone: "03-3456-7890",
            position: "取締役",
            company_id: companiesData.find((c) => c.name === "株式会社DEF")?.id,
            status: "active",
          },
          {
            name: "鈴木一郎",
            email: "suzuki@tech.co.jp",
            phone: "03-4567-8901",
            position: "CTO",
            company_id: companiesData.find((c) => c.name === "テクノロジー株式会社")?.id,
            status: "prospect",
          },
          {
            name: "高橋美咲",
            email: "takahashi@global.com",
            phone: "03-5678-9012",
            position: "部長",
            company_id: companiesData.find((c) => c.name === "グローバル企業")?.id,
            status: "customer",
          },
        ])
        .select()

      if (contactsInsertError) {
        console.error("Contacts insert error:", contactsInsertError)
        throw new Error(`連絡先データ挿入エラー: ${contactsInsertError.message}`)
      }

      if (!contactsData || contactsData.length === 0) {
        throw new Error("連絡先データの挿入に失敗しました")
      }

      setDebugInfo("案件データを挿入中...")
      // サンプル案件データ挿入
      const { data: dealsData, error: dealsInsertError } = await supabase
        .from("deals")
        .insert([
          {
            title: "年間保守契約",
            company_id: companiesData.find((c) => c.name === "株式会社ABC")?.id,
            contact_id: contactsData.find((c) => c.name === "田中太郎")?.id,
            amount: 2400000,
            stage: "negotiation",
            probability: 75,
            close_date: "2024-02-15",
            owner: "営業担当A",
            description: "年間保守契約の更新案件",
          },
          {
            title: "システム導入プロジェクト",
            company_id: companiesData.find((c) => c.name === "XYZ商事")?.id,
            contact_id: contactsData.find((c) => c.name === "佐藤花子")?.id,
            amount: 8500000,
            stage: "proposal",
            probability: 50,
            close_date: "2024-03-01",
            owner: "営業担当B",
            description: "新システム導入の提案",
          },
          {
            title: "追加ライセンス",
            company_id: companiesData.find((c) => c.name === "株式会社DEF")?.id,
            contact_id: contactsData.find((c) => c.name === "山田次郎")?.id,
            amount: 320000,
            stage: "closed-won",
            probability: 100,
            close_date: "2024-01-20",
            owner: "営業担当C",
            description: "追加ユーザーライセンス",
          },
          {
            title: "クラウド移行支援",
            company_id: companiesData.find((c) => c.name === "テクノロジー株式会社")?.id,
            contact_id: contactsData.find((c) => c.name === "鈴木一郎")?.id,
            amount: 1200000,
            stage: "qualification",
            probability: 25,
            close_date: "2024-04-01",
            owner: "営業担当D",
            description: "クラウドインフラ移行支援",
          },
          {
            title: "セキュリティ強化",
            company_id: companiesData.find((c) => c.name === "グローバル企業")?.id,
            contact_id: contactsData.find((c) => c.name === "高橋美咲")?.id,
            amount: 3500000,
            stage: "negotiation",
            probability: 80,
            close_date: "2024-02-28",
            owner: "営業担当E",
            description: "セキュリティシステム強化",
          },
        ])
        .select()

      if (dealsInsertError) {
        console.error("Deals insert error:", dealsInsertError)
        throw new Error(`案件データ挿入エラー: ${dealsInsertError.message}`)
      }

      if (!dealsData || dealsData.length === 0) {
        throw new Error("案件データの挿入に失敗しました")
      }

      setDebugInfo("稟議データを挿入中...")
      // サンプル稟議データ挿入
      const { error: approvalsInsertError } = await supabase.from("approvals").insert([
        {
          deal_id: dealsData.find((d) => d.title === "年間保守契約")?.id,
          title: "株式会社ABC - 年間保守契約",
          description: "年間保守契約の承認をお願いします。継続顧客との重要な契約です。",
          amount: 2400000,
          status: "pending",
          priority: "high",
          requester_name: "営業担当A",
          requester_department: "営業部",
          approver_name: "営業部長",
          approver_department: "営業部",
          due_date: "2024-02-01",
        },
        {
          deal_id: dealsData.find((d) => d.title === "システム導入プロジェクト")?.id,
          title: "XYZ商事 - システム導入",
          description: "システム導入プロジェクトの承認をお願いします。大型案件のため慎重な検討が必要です。",
          amount: 8500000,
          status: "pending",
          priority: "high",
          requester_name: "営業担当B",
          requester_department: "営業部",
          approver_name: "営業部長",
          approver_department: "営業部",
          due_date: "2024-02-15",
        },
        {
          deal_id: dealsData.find((d) => d.title === "セキュリティ強化")?.id,
          title: "グローバル企業 - セキュリティ強化",
          description: "セキュリティシステム強化の承認をお願いします。",
          amount: 3500000,
          status: "approved",
          priority: "medium",
          requester_name: "営業担当E",
          requester_department: "営業部",
          approver_name: "営業部長",
          approver_department: "営業部",
          due_date: "2024-01-25",
        },
      ])

      if (approvalsInsertError) {
        console.error("Approvals insert error:", approvalsInsertError)
        throw new Error(`稟議データ挿入エラー: ${approvalsInsertError.message}`)
      }

      setDebugInfo("サンプルデータ挿入完了")
    } catch (error: any) {
      console.error("Sample data insertion error:", error)
      throw error
    }
  }

  const loadDashboardData = async () => {
    try {
      const { supabase } = await import("@/lib/supabase")

      // 統計データを並列取得
      const [contactsResult, companiesResult, dealsResult, approvalsResult, recentApprovalsResult] = await Promise.all([
        supabase.from("contacts").select("id", { count: "exact" }),
        supabase.from("companies").select("id", { count: "exact" }),
        supabase.from("deals").select("id, amount").neq("stage", "closed-lost"),
        supabase.from("approvals").select("id", { count: "exact" }).eq("status", "pending"),
        supabase
          .from("approvals")
          .select("id, title, amount, status, requester_name, submitted_date")
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      // エラーチェック
      if (contactsResult.error) throw contactsResult.error
      if (companiesResult.error) throw companiesResult.error
      if (dealsResult.error) throw dealsResult.error
      if (approvalsResult.error) throw approvalsResult.error
      if (recentApprovalsResult.error) throw recentApprovalsResult.error

      const totalContacts = contactsResult.count || 0
      const totalCompanies = companiesResult.count || 0
      const activeDeals = dealsResult.data?.length || 0
      const pendingApprovals = approvalsResult.count || 0

      // 案件の総額を計算
      const monthlyRevenue =
        dealsResult.data?.filter((deal) => deal.amount)?.reduce((sum, deal) => sum + deal.amount, 0) || 0

      setStats({
        totalContacts,
        totalCompanies,
        activeDeals,
        pendingApprovals,
        monthlyRevenue,
      })

      setRecentApprovals(recentApprovalsResult.data || [])
    } catch (error: any) {
      console.error("Error loading dashboard data:", error)
      throw error
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            承認待ち
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            承認済み
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            却下
          </Badge>
        )
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  }

  const statsCards = [
    {
      title: "総企業数",
      value: stats.totalCompanies.toString(),
      change: "+5.2%",
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "総連絡先数",
      value: stats.totalContacts.toString(),
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "進行中案件",
      value: stats.activeDeals.toString(),
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "承認待ち",
      value: stats.pendingApprovals.toString(),
      change: "+3",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{debugInfo || "設定を確認中..."}</p>
        </div>
      </div>
    )
  }

  if (needsSetup && !supabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-2xl">
          <Card className="p-8">
            <div className="mb-6">
              <Settings className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase設定が必要です</h1>
              <p className="text-gray-600">環境変数を設定してください</p>
            </div>

            {debugInfo && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-left">
                <pre className="text-sm text-orange-700 whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">設定手順:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Supabaseプロジェクトを作成</li>
                <li>2. プロジェクトのURLとAnon Keyを取得</li>
                <li>3. 環境変数を設定:</li>
                <li className="ml-4">- NEXT_PUBLIC_SUPABASE_URL</li>
                <li className="ml-4">- NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>4. アプリケーションを再起動</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button onClick={checkSupabaseConfiguration} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                設定を再確認
              </Button>
              <p className="text-xs text-gray-500">環境変数設定後、このボタンをクリックしてください</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (needsSetup && supabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-2xl">
          <Card className="p-8">
            <div className="mb-6">
              <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">データベース初期化</h1>
              <p className="text-gray-600">テーブルの作成とサンプルデータの挿入が必要です</p>
            </div>

            {debugInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <pre className="text-sm text-blue-700 whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">必要な手順:</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Supabase Dashboardでテーブルを作成</li>
                <li>2. Row Level Security (RLS) を無効化</li>
                <li>3. 適切な権限を設定</li>
                <li>4. 下のボタンでサンプルデータを挿入</li>
              </ol>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">テーブル作成SQL:</h3>
              <div className="text-xs text-red-700 font-mono bg-white p-2 rounded border overflow-x-auto">
                <pre>{`-- 企業テーブル
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  employees VARCHAR(50),
  revenue BIGINT,
  status VARCHAR(50) DEFAULT 'prospect',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 連絡先テーブル
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  position VARCHAR(100),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 案件テーブル
CREATE TABLE deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL,
  stage VARCHAR(50) DEFAULT 'qualification',
  probability INTEGER DEFAULT 0,
  close_date DATE,
  owner VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 稟議テーブル
CREATE TABLE approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  requester_name VARCHAR(255) NOT NULL,
  requester_department VARCHAR(100),
  approver_name VARCHAR(255),
  approver_department VARCHAR(100),
  submitted_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  approved_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS無効化
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE approvals DISABLE ROW LEVEL SECURITY;`}</pre>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={createTablesDirectly} className="w-full bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                サンプルデータを挿入
              </Button>
              <Button onClick={checkDatabaseAndLoadData} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                データベース確認
              </Button>
              <p className="text-xs text-gray-500">
                上記SQLでテーブル作成後、「サンプルデータを挿入」ボタンをクリックしてください
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-2xl">
          <Card className="p-6">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
            <p className="text-red-600 mb-4">{error}</p>
            {debugInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                <pre className="text-xs text-red-700 whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
            <div className="space-y-2">
              {supabaseConfigured ? (
                <>
                  <Button onClick={createTablesDirectly} className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    サンプルデータを挿入
                  </Button>
                  <Button onClick={checkDatabaseAndLoadData} variant="outline" className="w-full bg-transparent">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    再試行
                  </Button>
                </>
              ) : (
                <Button onClick={checkSupabaseConfiguration} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  設定を再確認
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">CRM System</h1>
          <p className="text-sm text-gray-600">営業支援システム</p>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              ダッシュボード
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-1 ${
                activeTab === "companies"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Building2 className="mr-3 h-5 w-5" />
              企業
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-1 ${
                activeTab === "contacts"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              連絡先
            </button>
            <button
              onClick={() => setActiveTab("deals")}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-1 ${
                activeTab === "deals"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              案件
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-1 ${
                activeTab === "approvals"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <CheckCircle className="mr-3 h-5 w-5" />
              稟議・承認
            </button>
          </div>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">ダッシュボード</h2>
              <p className="text-gray-600">営業活動の概要を確認できます</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 案件総額カード */}
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">案件総額</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                      <p className="text-sm text-green-600">+15.3%</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 最近の稟議 */}
            <Card>
              <CardHeader>
                <CardTitle>最近の稟議申請</CardTitle>
                <CardDescription>承認が必要な案件を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApprovals.length > 0 ? (
                    recentApprovals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{approval.title}</h4>
                          <p className="text-sm text-gray-600">
                            申請者: {approval.requester_name} • {approval.submitted_date || "未設定"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-900">{formatCurrency(approval.amount)}</span>
                          {getStatusBadge(approval.status)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">稟議申請がありません</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "companies" && <CompaniesTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "deals" && <DealsTab />}
        {activeTab === "approvals" && <ApprovalTab />}
      </div>
    </div>
  )
}
