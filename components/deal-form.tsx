"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createDeal } from "@/app/actions"

interface Company {
  id: string
  name: string
}

interface Contact {
  id: string
  name: string
  company_id: string
}

interface DealFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function DealForm({ onClose, onSuccess }: DealFormProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompanies()
    loadContacts()
  }, [])

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase.from("companies").select("id, name").order("name")

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error("Error loading companies:", error)
    }
  }

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase.from("contacts").select("id, name, company_id").order("name")

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error("Error loading contacts:", error)
    }
  }

  const filteredContacts = selectedCompanyId
    ? contacts.filter((contact) => contact.company_id === selectedCompanyId)
    : contacts

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const result = await createDeal(formData)
      if (result.success) {
        onSuccess()
      } else {
        alert("エラーが発生しました: " + result.error)
      }
    } catch (error) {
      console.error("Error creating deal:", error)
      alert("エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>新規案件</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">案件名 *</Label>
              <Input id="title" name="title" required />
            </div>

            <div>
              <Label htmlFor="company_id">企業 *</Label>
              <Select name="company_id" onValueChange={setSelectedCompanyId} required>
                <SelectTrigger>
                  <SelectValue placeholder="企業を選択" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact_id">連絡先</Label>
              <Select name="contact_id">
                <SelectTrigger>
                  <SelectValue placeholder="連絡先を選択" />
                </SelectTrigger>
                <SelectContent>
                  {filteredContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">金額（円） *</Label>
              <Input id="amount" name="amount" type="number" required placeholder="例: 1000000" />
            </div>

            <div>
              <Label htmlFor="stage">ステージ</Label>
              <Select name="stage" defaultValue="qualification">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualification">案件確認</SelectItem>
                  <SelectItem value="proposal">提案</SelectItem>
                  <SelectItem value="negotiation">交渉</SelectItem>
                  <SelectItem value="closed-won">受注</SelectItem>
                  <SelectItem value="closed-lost">失注</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="probability">成約確度（%）</Label>
              <Input id="probability" name="probability" type="number" min="0" max="100" defaultValue="25" />
            </div>

            <div>
              <Label htmlFor="close_date">完了予定日</Label>
              <Input id="close_date" name="close_date" type="date" />
            </div>

            <div>
              <Label htmlFor="owner">担当者</Label>
              <Input id="owner" name="owner" placeholder="担当者名" />
            </div>

            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea id="description" name="description" placeholder="案件の詳細..." />
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
