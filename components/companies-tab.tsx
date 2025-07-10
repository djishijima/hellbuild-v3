"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Building2, Users, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import CompanyForm from "./company-form"

interface Company {
  id: string
  name: string
  industry: string | null
  employees: string | null
  revenue: number | null
  status: string
  created_at: string
  contacts_count: number
  deals_count: number
}

export default function CompaniesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from("companies")
        .select(`
          id,
          name,
          industry,
          employees,
          revenue,
          status,
          created_at
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // 各企業の連絡先数と案件数を取得
      const companiesWithCounts = await Promise.all(
        (data || []).map(async (company) => {
          const [contactsResult, dealsResult] = await Promise.all([
            supabase.from("contacts").select("id", { count: "exact" }).eq("company_id", company.id),
            supabase.from("deals").select("id", { count: "exact" }).eq("company_id", company.id),
          ])

          return {
            ...company,
            contacts_count: contactsResult.count || 0,
            deals_count: dealsResult.count || 0,
          }
        }),
      )

      setCompanies(companiesWithCounts)
    } catch (error: any) {
      console.error("Error loading companies:", error)
      setError(error.message || "企業の読み込みに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "customer":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            顧客
          </Badge>
        )
      case "prospect":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            見込み客
          </Badge>
        )
      case "partner":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            パートナー
          </Badge>
        )
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "未設定"
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.industry || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="p-8">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <Button onClick={loadCompanies}>再試行</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">企業</h2>
          <p className="text-gray-600">取引先企業の情報を管理します</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規企業
        </Button>
      </div>

      {/* 検索・フィルター */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="企業を検索..."
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

      {/* 企業リスト */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-sm text-gray-600">{company.industry || "業界未設定"}</p>
                    </div>
                  </div>
                  {getStatusBadge(company.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">従業員数</p>
                      <p className="text-sm text-gray-900">{company.employees || "未設定"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">年商</p>
                      <p className="text-sm text-gray-900">{formatCurrency(company.revenue)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-1 h-4 w-4" />
                        {company.contacts_count} 連絡先
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        {company.deals_count} 案件
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    登録日: {new Date(company.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-8">企業が見つかりません</div>
        )}
      </div>

      {showForm && (
        <CompanyForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadCompanies()
          }}
        />
      )}
    </div>
  )
}
