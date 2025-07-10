"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { createCompany } from "@/app/actions"

interface CompanyFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CompanyForm({ onClose, onSuccess }: CompanyFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const result = await createCompany(formData)
      if (result.success) {
        onSuccess()
      } else {
        alert("エラーが発生しました: " + result.error)
      }
    } catch (error) {
      console.error("Error creating company:", error)
      alert("エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>新規企業</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">企業名 *</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="industry">業界</Label>
              <Select name="industry">
                <SelectTrigger>
                  <SelectValue placeholder="業界を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT・ソフトウェア">IT・ソフトウェア</SelectItem>
                  <SelectItem value="製造業">製造業</SelectItem>
                  <SelectItem value="商社・卸売">商社・卸売</SelectItem>
                  <SelectItem value="金融・保険">金融・保険</SelectItem>
                  <SelectItem value="建設・不動産">建設・不動産</SelectItem>
                  <SelectItem value="小売・サービス">小売・サービス</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employees">従業員数</Label>
              <Select name="employees">
                <SelectTrigger>
                  <SelectValue placeholder="従業員数を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10人</SelectItem>
                  <SelectItem value="11-50">11-50人</SelectItem>
                  <SelectItem value="51-100">51-100人</SelectItem>
                  <SelectItem value="101-500">101-500人</SelectItem>
                  <SelectItem value="501-1000">501-1000人</SelectItem>
                  <SelectItem value="1000+">1000人以上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="revenue">年商（円）</Label>
              <Input id="revenue" name="revenue" type="number" placeholder="例: 1000000000" />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
