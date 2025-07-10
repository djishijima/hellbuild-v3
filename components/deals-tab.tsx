"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Filter, MoreHorizontal, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import DealForm from "./deal-form"

interface Deal {
  id: string
  title: string
  amount: number
  stage: string
  probability: number
  close_date: string | null
  owner: string | null
  description: string | null
  created_at: string
  company_id: string | null
  contact_id: string | null
  company_name?: string
  contact_name?: string
}

export default function DealsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setError(null)

      // Get deals
      const { data: dealsData, error: dealsError } = await supabase
        .from("deals")
        .select(`
          id,
          title,
          amount,
          stage,
          probability,
          close_date,
          owner,
          description,
          created_at,
          company_id,
          contact_id
        `)
        .order("created_at", { ascending: false })

      if (dealsError) throw dealsError

      // Get companies and contacts separately
      const [companiesResult, contactsResult] = await Promise.all([
        supabase.from("companies").select("id, name"),
        supabase.from("contacts").select("id, name"),
      ])

      if (companiesResult.error) throw companiesResult.error
      if (contactsResult.error) throw contactsResult.error

      // Combine the data
      const dealsWithRelations = (dealsData || []).map((deal) => {
        const company = companiesResult.data?.find((c) => c.id === deal.company_id)
        const contact = contactsResult.data?.find((c) => c.id === deal.contact_id)

        return {
          ...deal,
          company_name: company?.name,
          contact_name: contact?.name,
        }
      })

      setDeals(dealsWithRelations)
    } catch (error: any) {
      console.error("Error loading deals:", error)
      setError(error.message || "案件の読み込みに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case "qualification":
        return { label: "案件確認", color: "text-gray-600 border-gray-200" }
      case "proposal":
        return { label: "提案", color: "text-blue-600 border-blue-200" }
      case "negotiation":
        return { label: "交渉", color: "text-orange-600 border-orange-200" }
      case "closed-won":
        return { label: "受注", color: "text-green-600 border-green-200" }
      case "closed-lost":
        return { label: "失注", color: "text-red-600 border-red-200" }
      default:
        return { label: "不明", color: "text-gray-600 border-gray-200" }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  }

  const filteredDeals = deals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const needsApproval = (deal: Deal) => {
    return deal.amount > 1000000 && deal.stage === "negotiation"
  }

  if (loading) {
    return <div className="p-8">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <Button onClick={loadDeals}>再試行</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">案件</h2>
          <p className="text-gray-600">営業案件を管理します</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規案件
        </Button>
      </div>

      {/* 検索・フィルター */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="案件を検索..."
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

      {/* 案件リスト */}
      <div className="space-y-4">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => {
            const stageInfo = getStageInfo(deal.stage)
            const requiresApproval = needsApproval(deal)

            return (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{deal.title}</h3>
                        {requiresApproval && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            承認必要
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {deal.company_name || "企業未設定"} • 担当: {deal.owner || "未設定"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(deal.amount)}</p>
                      <Badge variant="outline" className={stageInfo.color}>
                        {stageInfo.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">成約確度</span>
                        <span className="font-medium">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1 h-4 w-4" />
                        完了予定: {deal.close_date || "未設定"}
                      </div>
                      <div className="flex space-x-2">
                        {requiresApproval && (
                          <Button size="sm" variant="outline">
                            稟議申請
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center text-gray-500 py-8">案件が見つかりません</div>
        )}
      </div>

      {showForm && (
        <DealForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadDeals()
          }}
        />
      )}
    </div>
  )
}
