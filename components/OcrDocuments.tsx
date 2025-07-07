"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileImage, Download, Eye } from "lucide-react"

export function OcrDocuments() {
  const [searchTerm, setSearchTerm] = useState("")

  const documents = [
    {
      id: "1",
      title: "請求書_202401_001",
      pages: 2,
      size: "A4",
      status: "完了",
      createdAt: "2024-01-15",
      processedAt: "2024-01-15 10:30",
    },
    {
      id: "2",
      title: "契約書_サンプル社",
      pages: 5,
      size: "A4",
      status: "処理中",
      createdAt: "2024-01-14",
      processedAt: "-",
    },
    {
      id: "3",
      title: "見積書_202401_003",
      pages: 1,
      size: "A4",
      status: "完了",
      createdAt: "2024-01-13",
      processedAt: "2024-01-13 14:20",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "処理中":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "エラー":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">OCR文書管理</h2>
          <p className="text-slate-400">文書のOCR処理と内容抽出</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          文書アップロード
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総文書数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">89</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">処理完了</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">76</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">処理中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">8</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">今月の処理数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">23</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">文書一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="文書を検索..."
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
                  <th className="text-left py-3 px-4 font-medium text-slate-300">文書名</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">ページ数</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">サイズ</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">作成日</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">処理完了日</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{doc.title}</td>
                    <td className="py-3 px-4 text-slate-300">{doc.pages}</td>
                    <td className="py-3 px-4 text-slate-300">{doc.size}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{doc.createdAt}</td>
                    <td className="py-3 px-4 text-slate-300">{doc.processedAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                          <Eye className="h-4 w-4" />
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
