"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Building2, Phone, Mail, MapPin } from "lucide-react"

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const customers = [
    {
      id: "1",
      name: "株式会社サンプル",
      industry: "製造業",
      contact: "田中太郎",
      phone: "03-1234-5678",
      email: "tanaka@sample.co.jp",
      address: "東京都千代田区",
      status: "アクティブ",
      lastOrder: "2024-01-10",
      totalValue: "¥2,500,000",
    },
    {
      id: "2",
      name: "テスト商事株式会社",
      industry: "商社",
      contact: "佐藤花子",
      phone: "06-9876-5432",
      email: "sato@test-corp.com",
      address: "大阪府大阪市",
      status: "アクティブ",
      lastOrder: "2024-01-08",
      totalValue: "¥1,800,000",
    },
    {
      id: "3",
      name: "デモ技術株式会社",
      industry: "IT",
      contact: "鈴木一郎",
      phone: "03-5555-1111",
      email: "suzuki@demo-tech.jp",
      address: "東京都渋谷区",
      status: "非アクティブ",
      lastOrder: "2023-12-15",
      totalValue: "¥950,000",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "アクティブ":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "非アクティブ":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">顧客管理</h2>
          <p className="text-slate-400">既存顧客の情報管理と関係維持</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          新規顧客
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総顧客数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">アクティブ顧客</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">142</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">今月の取引</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">28</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">総売上</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">¥45.2M</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">顧客一覧</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="顧客を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-white">{customer.name}</h3>
                    <p className="text-slate-400">
                      {customer.industry} • {customer.contact}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    <span className="text-emerald-400 font-medium">{customer.totalValue}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {customer.address}
                  </div>
                  <div>最終注文: {customer.lastOrder}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
