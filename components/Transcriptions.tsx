"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Mic, Download, Play } from "lucide-react"

export function Transcriptions() {
  const [searchTerm, setSearchTerm] = useState("")

  const transcriptions = [
    {
      id: "1",
      title: "会議録_2024年1月定例会",
      duration: "45:30",
      language: "日本語",
      status: "完了",
      createdAt: "2024-01-15",
      processedAt: "2024-01-15 11:45",
    },
    {
      id: "2",
      title: "顧客インタビュー_ABC社",
      duration: "28:15",
      language: "日本語",
      status: "転写中",
      createdAt: "2024-01-14",
      processedAt: "-",
    },
    {
      id: "3",
      title: "プレゼンテーション録音",
      duration: "62:20",
      language: "日本語",
      status: "完了",
      createdAt: "2024-01-13",
      processedAt: "2024-01-13 16:30",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "転写中":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "エラー":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredTranscriptions = transcriptions.filter((trans) =>
    trans.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">音声転写</h2>
          <p className="text-slate-400">音声ファイルの自動転写とテキスト化</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          音声アップロード
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総転写数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">34</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">転写完了</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">28</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">処理中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">4</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">18.5h</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">転写一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="転写を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-300">タイトル</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">時間</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">言語</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">作成日</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">完了日</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTranscriptions.map((trans) => (
                  <tr key={trans.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{trans.title}</td>
                    <td className="py-3 px-4 text-slate-300">{trans.duration}</td>
                    <td className="py-3 px-4 text-slate-300">{trans.language}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(trans.status)}>{trans.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{trans.createdAt}</td>
                    <td className="py-3 px-4 text-slate-300">{trans.processedAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
