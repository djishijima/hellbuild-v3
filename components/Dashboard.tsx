"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, CheckSquare, TrendingUp, CreditCard } from "lucide-react"

export function Dashboard() {
  const stats = [
    { title: "承認待ち申請", value: "12", icon: FileText, color: "text-blue-500" },
    { title: "今月の申請数", value: "45", icon: FileText, color: "text-green-500" },
    { title: "アクティブユーザー", value: "28", icon: Users, color: "text-purple-500" },
    { title: "完了タスク", value: "156", icon: CheckSquare, color: "text-emerald-500" },
    { title: "新規リード", value: "8", icon: TrendingUp, color: "text-orange-500" },
    { title: "支払先", value: "644", icon: CreditCard, color: "text-cyan-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">ダッシュボード</h2>
        <p className="text-slate-400">システム全体の概要と統計情報</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">最近の申請</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "No.00012", title: "出張費用申請", status: "承認待ち", date: "2024-01-15" },
                { id: "No.00011", title: "研修参加申請", status: "承認済み", date: "2024-01-14" },
                { id: "No.00010", title: "備品購入申請", status: "承認待ち", date: "2024-01-13" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-slate-400 text-sm">
                      {item.id} - {item.date}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "承認済み" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">今週のタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "システム仕様書の作成", progress: 75, dueDate: "1月20日" },
                { title: "データベース設計レビュー", progress: 100, dueDate: "1月18日" },
                { title: "ユーザーテスト実施", progress: 30, dueDate: "1月25日" },
              ].map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium">{task.title}</p>
                    <span className="text-slate-400 text-sm">{task.dueDate}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">{task.progress}% 完了</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
