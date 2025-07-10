"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, CheckCircle, XCircle, User, Calendar, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { updateApprovalStatus } from "@/app/actions"

interface Approval {
  id: string
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
  deal_id: string | null
  deal_title?: string
  company_name?: string
}

export default function ApprovalTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null)
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setError(null)

      // Get approvals
      const { data: approvalsData, error: approvalsError } = await supabase
        .from("approvals")
        .select(`
        id,
        title,
        description,
        amount,
        status,
        priority,
        requester_name,
        requester_department,
        approver_name,
        approver_department,
        submitted_date,
        due_date,
        approved_date,
        rejection_reason,
        created_at,
        deal_id
      `)
        .order("created_at", { ascending: false })

      if (approvalsError) throw approvalsError

      // Get deals separately
      const { data: dealsData, error: dealsError } = await supabase.from("deals").select("id, title, company_id")

      if (dealsError) throw dealsError

      // Get companies separately
      const { data: companiesData, error: companiesError } = await supabase.from("companies").select("id, name")

      if (companiesError) throw companiesError

      // Combine the data
      const approvalsWithDetails = (approvalsData || []).map((approval) => {
        const deal = dealsData?.find((d) => d.id === approval.deal_id)
        const company = deal ? companiesData?.find((c) => c.id === deal.company_id) : null

        return {
          ...approval,
          deal_title: deal?.title,
          company_name: company?.name,
        }
      })

      setApprovals(approvalsWithDetails)
    } catch (error: any) {
      console.error("Error loading approvals:", error)
      setError(error.message || "稟議の読み込みに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalAction = async (approvalId: string, action: "approved" | "rejected") => {
    try {
      const result = await updateApprovalStatus(approvalId, action)
      if (result.success) {
        await loadApprovals() // Reload data
      } else {
        alert("エラーが発生しました: " + result.error)
      }
    } catch (error) {
      console.error("Error updating approval:", error)
      alert("エラーが発生しました")
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">高</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            中
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            低
          </Badge>
        )
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  }

  const filteredApprovals = approvals.filter(
    (approval) =>
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requester_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingApprovals = filteredApprovals.filter((a) => a.status === "pending")
  const completedApprovals = filteredApprovals.filter((a) => a.status !== "pending")

  if (loading) {
    return <div className="p-8">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <Button onClick={loadApprovals}>再試行</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">稟議・承認</h2>
          <p className="text-gray-600">承認が必要な案件を管理します</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規申請
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">承認待ち ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="completed">完了済み ({completedApprovals.length})</TabsTrigger>
        </TabsList>

        {/* 検索・フィルター */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="稟議を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </div>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length > 0 ? (
            pendingApprovals.map((approval) => (
              <Card key={approval.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{approval.title}</h3>
                        {getPriorityBadge(approval.priority)}
                        {getStatusBadge(approval.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{approval.description}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          申請者: {approval.requester_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          期限: {approval.due_date || "未設定"}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {formatCurrency(approval.amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApproval(approval.id)}>
                      詳細を見る
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={() => handleApprovalAction(approval.id, "rejected")}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        却下
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprovalAction(approval.id, "approved")}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        承認
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">承認待ちの稟議はありません</div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApprovals.length > 0 ? (
            completedApprovals.map((approval) => (
              <Card key={approval.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{approval.title}</h3>
                        {getStatusBadge(approval.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{approval.description}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          申請者: {approval.requester_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          申請日: {approval.submitted_date || "未設定"}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {formatCurrency(approval.amount)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApproval(approval.id)}>
                      詳細を見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">完了済みの稟議はありません</div>
          )}
        </TabsContent>
      </Tabs>

      {/* 詳細モーダル */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>稟議詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const approval = approvals.find((a) => a.id === selectedApproval)
                if (!approval) return null

                return (
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">{approval.title}</h3>
                      <p className="text-sm text-gray-600">{approval.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">金額</p>
                        <p className="text-lg font-bold">{formatCurrency(approval.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ステータス</p>
                        {getStatusBadge(approval.status)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">契約詳細</p>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">企業:</span> {approval.company_name || "不明"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">案件:</span> {approval.deal_title || "不明"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">申請者:</span> {approval.requester_name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">部署:</span> {approval.requester_department || "未設定"}
                        </p>
                        {approval.rejection_reason && (
                          <p className="text-sm">
                            <span className="font-medium">却下理由:</span> {approval.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedApproval(null)}>
                        閉じる
                      </Button>
                      {approval.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-200 bg-transparent"
                            onClick={() => {
                              handleApprovalAction(approval.id, "rejected")
                              setSelectedApproval(null)
                            }}
                          >
                            却下
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              handleApprovalAction(approval.id, "approved")
                              setSelectedApproval(null)
                            }}
                          >
                            承認
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
