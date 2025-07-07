"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, User, CheckSquare } from "lucide-react"

export function Tasks() {
  const [searchTerm, setSearchTerm] = useState("")

  const tasks = [
    {
      id: "1",
      title: "システム仕様書の作成",
      assignee: "田中太郎",
      status: "進行中",
      priority: "高",
      dueDate: "2024-01-20",
      progress: 60,
      project: "Webシステム開発",
    },
    {
      id: "2",
      title: "データベース設計レビュー",
      assignee: "佐藤花子",
      status: "完了",
      priority: "中",
      dueDate: "2024-01-18",
      progress: 100,
      project: "Webシステム開発",
    },
    {
      id: "3",
      title: "ユーザーテスト実施",
      assignee: "鈴木一郎",
      status: "未開始",
      priority: "低",
      dueDate: "2024-01-25",
      progress: 0,
      project: "モバイルアプリ開発",
    },
    {
      id: "4",
      title: "セキュリティ監査",
      assignee: "山田次郎",
      status: "進行中",
      priority: "高",
      dueDate: "2024-01-22",
      progress: 30,
      project: "インフラ整備",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "進行中":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "完了":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "未開始":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "中":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "低":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">タスク管理</h2>
          <p className="text-slate-400">プロジェクトタスクの管理と進捗追跡</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          新規タスク
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">進行中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">8</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">完了</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">14</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">未開始</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-400">2</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">タスク一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="タスクを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{task.title}</h3>
                    <p className="text-sm text-slate-400">{task.project}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {task.assignee}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {task.dueDate}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">進捗: {task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
