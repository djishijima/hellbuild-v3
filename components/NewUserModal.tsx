"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser } from "@/lib/database"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function NewUserModal({ isOpen, onClose, onSubmit }: NewUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    role: "",
    phone: "",
    notes: "",
  })

  const roles = [
    { value: "admin", label: "管理者" },
    { value: "manager", label: "マネージャー" },
    { value: "user", label: "ユーザー" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeId.trim() || !formData.name.trim() || !formData.email.trim() || !formData.role) {
      toast.error("必須項目を入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      await createUser({
        employee_id: formData.employeeId,
        name: formData.name,
        email: formData.email,
        role: formData.role as any,
        phone: formData.phone || null,
        notes: formData.notes || null,
        status: "active",
      })

      toast.success("ユーザーを作成しました")
      setFormData({
        employeeId: "",
        name: "",
        email: "",
        role: "",
        phone: "",
        notes: "",
      })
      onSubmit()
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("ユーザーの作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">新規ユーザー作成</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId" className="text-slate-300">
              社員ID *
            </Label>
            <Input
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="EMP001"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              氏名 *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="田中太郎"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              メールアドレス *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tanaka@example.com"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-300">
              役職 *
            </Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="役職を選択" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300">
              電話番号
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="03-1234-5678"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">
              備考
            </Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="その他の情報"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 bg-transparent"
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              作成
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
