"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSupabaseQuery, useRealtimeSubscription } from "@/hooks/useSupabase"
import { getPaymentRecipients, deactivatePaymentRecipient } from "@/lib/database"
import { Search, Plus, Edit, Trash2, Building2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function RecipientManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: recipients, loading, error, refetch } = useSupabaseQuery(getPaymentRecipients)

  // リアルタイム更新
  useRealtimeSubscription("payment_recipients", (payload) => {
    console.log("Payment recipient updated:", payload)
    refetch()
  })

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`${name}を無効化しますか？`)) return

    try {
      await deactivatePaymentRecipient(id)
      toast.success("支払先を無効化しました")
      refetch()
    } catch (error) {
      toast.error("無効化に失敗しました")
      console.error(error)
    }
  }

  const filteredRecipients =
    recipients?.filter(
      (recipient) =>
        recipient.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipient.bank_name && recipient.bank_name.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || []

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-2">データの取得に失敗しました</p>
          <Button onClick={() => refetch()} variant="outline">
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
          <h2 className="text-3xl font-bold text-white">支払先管理</h2>
          <p className="text-slate-400">経費申請で使用する支払先の管理を行います</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="destructive" size="sm">
            NULLレコード一括削除
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="支払先を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-white">支払先一覧 ({filteredRecipients.length}件)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-slate-300">支払先名</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">会社名</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">銀行情報</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">口座情報</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">連絡先</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">ステータス</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecipients.map((recipient) => (
                    <tr key={recipient.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white font-medium">{recipient.recipient_name}</td>
                      <td className="py-3 px-4 text-slate-300">{recipient.company_name}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="text-sm">
                          <div>{recipient.bank_name}</div>
                          <div className="text-slate-500">{recipient.branch_name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="text-sm">
                          <div>
                            {recipient.account_type} {recipient.account_number}
                          </div>
                          <div className="text-slate-500">{recipient.account_holder}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="text-sm">
                          {recipient.email && <div>{recipient.email}</div>}
                          {recipient.phone_number && <div>{recipient.phone_number}</div>}
                          {!recipient.email && !recipient.phone_number && <div>-</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            recipient.is_active
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {recipient.is_active ? "有効" : "無効"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {recipient.is_active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-400 hover:text-yellow-300"
                              onClick={() => handleDeactivate(recipient.id, recipient.recipient_name)}
                            >
                              無効化
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  )
}
