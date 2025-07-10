"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createContact } from "@/app/actions"

interface Company {
  id: string
  name: string
}

interface ContactFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function ContactForm({ onClose, onSuccess }: ContactFormProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompanies()
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

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const result = await createContact(formData)
      if (result.success) {
        onSuccess()
      } else {
        alert("エラーが発生しました: " + result.error)
      }
    } catch (error) {
      console.error("Error creating contact:", error)
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
            <CardTitle>新規連絡先</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">名前 *</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" />
            </div>

            <div>
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" name="phone" />
            </div>

            <div>
              <Label htmlFor="position">役職</Label>
              <Input id="position" name="position" />
            </div>

            <div>
              <Label htmlFor="company_id">企業</Label>
              <Select name="company_id">
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
