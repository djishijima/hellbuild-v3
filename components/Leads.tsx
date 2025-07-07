"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, TrendingUp, Phone, Mail } from "lucide-react"

export function Leads() {
  const [searchTerm, setSearchTerm] = useState("")

  const leads = [
    {
      id: "1",
      company: "ABC商事株式会社",
      contact: "田中部長",
      phone: "03-1234-5678",
      email: "tanaka@abc-corp.com",
      status: "アクティブ",
      value: "¥500,000",
      lastContact: "2024-01-15",
      source: "ウェブサイト",
    },
    {
      id: "2",
      company: "XYZ製造業",
      contact: "佐藤課長",
      phone: "06-9876-5432",
      email: "sato@xyz-mfg.com",
      status: "商談中",
      value: "¥1,200,000",
      lastContact: "2024-01-14",
      source: "紹介",
    },
    {
      id: "3",
      company: "株式会社テクノロジー",
      contact: "鈴木社長",
      phone: "03-5555-1111",
      email: "suzuki@tech-co.jp",
      status: "クローズ",
      value: "¥800,000",
      lastContact: "2024-01-10",
      source: "展示会",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "アクティブ":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "商談中":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "クローズ":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">リード管理</h2>
          <p className="text-slate-400">見込み客の管理と営業活動の追跡</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          新規リード
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総リード数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">アクティブ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">23</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">商談中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">15</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">今月の売上予測</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">¥3.2M</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">リード一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="リードを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-white">{lead.company}</h3>
                    <p className="text-slate-400">{lead.contact}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    <span className="text-emerald-400 font-medium">{lead.value}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {lead.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {lead.email}
                  </div>
                  <div>最終接触: {lead.lastContact}</div>
                  <div>ソース: {lead.source}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
