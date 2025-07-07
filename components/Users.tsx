"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NewUserModal } from "./NewUserModal"
import { useSupabaseQuery, useRealtimeSubscription } from "@/hooks/useSupabase"
import { getUsers, updateUser, deleteUser } from "@/lib/database"
import { Search, Plus, Edit, Trash2, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function Users() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: users, loading, error, refetch } = useSupabaseQuery(getUsers)

  // リアルタイム更新
  useRealtimeSubscription("users", (payload) => {
    console.log("User updated:", payload)
    refetch()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "manager":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "user":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "管理者"
      case "manager":
        return "マネージャー"
      case "user":
        return "ユーザー"
      default:
        return role
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "アクティブ"
      case "inactive":
        return "非アクティブ"
      default:
        return status
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      await updateUser(id, { status: newStatus as any })
      toast.success(`ユーザーを${newStatus === "active" ? "アクティブ" : "非アクティブ"}にしました`)
      refetch()
    } catch (error) {
      toast.error("ステータスの更新に失敗しました")
      console.error(error)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name}を削除しますか？この操作は取り消せません。`)) return

    try {
      await deleteUser(id)
      toast.success("ユーザーを削除しました")
      refetch()
    } catch (error) {
      toast.error("削除に失敗しました")
      console.error(error)
    }
  }

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employee_id.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const activeUsers = users?.filter((user) => user.status === "active").length || 0
  const adminUsers = users?.filter((user) => user.role === "admin").length || 0

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
          <h2 className="text-3xl font-bold text-white">ユーザー管理</h2>
          <p className="text-slate-400">システムユーザーの管理と権限設定</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          新規ユーザー
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総ユーザー数</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-white">{users?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">アクティブ</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-green-400">{activeUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">管理者</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <div className="text-2xl font-bold text-purple-400">{adminUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">今日のログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {filteredUsers.filter((u) => new Date(u.updated_at).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">ユーザー一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="ユーザーを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
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
                    <th className="text-left py-3 px-4 font-medium text-slate-300">社員ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">名前</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">メールアドレス</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">役職</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">ステータス</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">作成日</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">{user.employee_id}</td>
                      <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-slate-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(user.status)}>{getStatusLabel(user.status)}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(user.created_at).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                          >
                            {user.status === "active" ? "無効化" : "有効化"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:text-red-400"
                            onClick={() => handleDelete(user.id, user.name)}
                          >
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

      <NewUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          setIsModalOpen(false)
          refetch()
        }}
      />
    </div>
  )
}
