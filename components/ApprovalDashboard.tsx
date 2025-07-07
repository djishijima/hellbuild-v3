"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NewApprovalModal } from "./NewApprovalModal"
import { useSupabaseQuery, useRealtimeSubscription } from "@/hooks/useSupabase"
import { getApprovals, getDashboardStats, updateApproval } from "@/lib/database"
import type { Page } from "@/types"
import { Search, Plus, Eye, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ApprovalDashboardProps {
  setCurrentPage: (page: Page) => void
}

export function ApprovalDashboard({ setCurrentPage }: ApprovalDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const {
    data: approvals,
    loading: approvalsLoading,
    error: approvalsError,
    refetch: refetchApprovals,
  } = useSupabaseQuery(getApprovals)
  const { data: stats, loading: statsLoading } = useSupabaseQuery(getDashboardStats)

  // リアルタイム更新
  useRealtimeSubscription("approvals", (payload) => {
    console.log("Approval updated:", payload)
    refetchApprovals()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "draft":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "承認待ち"
      case "approved":
        return "承認済み"
      case "rejected":
        return "却下"
      case "draft":
        return "下書き"
      default:
        return status
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await updateApproval(id, {
        status: "approved",
        approved_at: new Date().toISOString(),
        approver_id: "current-user-id", // TODO: 実際のユーザーIDを取得
      })
      toast.success("承認しました")
      refetchApprovals()
    } catch (error) {
      toast.error("承認に失敗しました")
      console.error(error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateApproval(id, {
        status: "rejected",
        approver_id: "current-user-id", // TODO: 実際のユーザーIDを取得
      })
      toast.success("却下しました")
      refetchApprovals()
    } catch (error) {
      toast.error("却下に失敗しました")
      console.error(error)
    }
  }

  const filteredApprovals =
    approvals?.filter((approval) => {
      const matchesSearch =
        approval.form_data?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.application_code?.name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "all" || approval.status === selectedStatus

      return matchesSearch && matchesStatus
    }) || []

  if (approvalsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-2">データの取得に失敗しました</p>
          <Button onClick={() => refetchApprovals()} variant="outline">
            再試行
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">上申書管理</h2>
          <p className="text-slate-400">上申書の作成・承認・管理を行います</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          新規申請
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総申請数</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-white">{stats?.totalApprovals || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">承認待ち</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">{stats?.pendingApprovals || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">承認済み</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-green-400">
                {(stats?.totalApprovals || 0) - (stats?.pendingApprovals || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">今月の申請</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {filteredApprovals.filter((a) => new Date(a.created_at).getMonth() === new Date().getMonth()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">上申書一覧 ({filteredApprovals.length}件)</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="申請を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">すべて</option>
                <option value="draft">下書き</option>
                <option value="submitted">承認待ち</option>
                <option value="approved">承認済み</option>
                <option value="rejected">却下</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {approvalsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-slate-300">申請番号</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">件名</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">申請者</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">カテゴリ</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">金額</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">ステータス</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">申請日</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map((approval) => (
                    <tr key={approval.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">{approval.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-white font-medium">{approval.form_data?.title || "無題"}</td>
                      <td className="py-3 px-4 text-slate-300">{approval.applicant?.name || "不明"}</td>
                      <td className="py-3 px-4 text-slate-300">{approval.application_code?.name || "不明"}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {approval.form_data?.amount ? `¥${approval.form_data.amount.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(approval.status)}>{getStatusLabel(approval.status)}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(approval.created_at).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {approval.status === "submitted" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-400 hover:text-green-300"
                                onClick={() => handleApprove(approval.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleReject(approval.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <NewApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          setIsModalOpen(false)
          refetchApprovals()
        }}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}
