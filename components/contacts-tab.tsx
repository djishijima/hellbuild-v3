"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import ContactForm from "./contact-form"

interface Contact {
  id: string
  name: string
  email: string | null
  phone: string | null
  position: string | null
  status: string
  created_at: string
  company_id: string | null
  company_name?: string
}

export default function ContactsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setError(null)

      // First get contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select(`
        id,
        name,
        email,
        phone,
        position,
        status,
        created_at,
        company_id
      `)
        .order("created_at", { ascending: false })

      if (contactsError) throw contactsError

      // Then get companies separately
      const { data: companiesData, error: companiesError } = await supabase.from("companies").select("id, name")

      if (companiesError) throw companiesError

      // Combine the data
      const contactsWithCompanies = (contactsData || []).map((contact) => {
        const company = companiesData?.find((c) => c.id === contact.company_id)
        return {
          ...contact,
          company_name: company?.name,
        }
      })

      setContacts(contactsWithCompanies)
    } catch (error: any) {
      console.error("Error loading contacts:", error)
      setError(error.message || "連絡先の読み込みに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            アクティブ
          </Badge>
        )
      case "prospect":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            見込み客
          </Badge>
        )
      case "customer":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            顧客
          </Badge>
        )
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="p-8">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <Button onClick={loadContacts}>再試行</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">連絡先</h2>
          <p className="text-gray-600">顧客の連絡先情報を管理します</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規連絡先
        </Button>
      </div>

      {/* 検索・フィルター */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="連絡先を検索..."
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

      {/* 連絡先リスト */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">
                          {contact.position} • {contact.company_name || "企業未設定"}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          {contact.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="mr-1 h-4 w-4" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="mr-1 h-4 w-4" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(contact.status)}
                      <span className="text-sm text-gray-500">
                        登録日: {new Date(contact.created_at).toLocaleDateString("ja-JP")}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">連絡先が見つかりません</div>
            )}
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ContactForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            loadContacts()
          }}
        />
      )}
    </div>
  )
}
