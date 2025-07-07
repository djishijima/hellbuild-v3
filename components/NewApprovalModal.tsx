"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSupabaseQuery } from "@/hooks/useSupabase"
import { getApplicationCodes, getPaymentRecipients, createApproval } from "@/lib/database"
import { Page } from "@/types"
import { Upload, Plus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  setCurrentPage: (page: Page) => void
}

export function NewApprovalModal({ isOpen, onClose, onSubmit, setCurrentPage }: NewApprovalModalProps) {
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    projectName: "",
    remarks: "",
    subject: "",
    amount: "",
    recipient: "",
    content: "",
    billingDate: "",
    paymentDate: "",
    startDate: "",
    endDate: "",
    leaveType: "全日",
    alternateContact: "",
    reason: "",
    approvalContent: "",
    approvalReason: "",
  })

  const { data: applicationCodes, loading: codesLoading } = useSupabaseQuery(getApplicationCodes)
  const { data: recipients, loading: recipientsLoading } = useSupabaseQuery(getPaymentRecipients)

  const subjects = ["接待交際費", "会議費", "旅費交通費", "福利厚生費", "その他"]

  const handleSubmit = async (status: "draft" | "submitted") => {
    if (!category) {
      toast.error("申請カテゴリを選択してください")
      return
    }

    if (!formData.title.trim()) {
      toast.error("申請タイトルを入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      const selectedCode = applicationCodes?.find((code) => code.id === category)

      const approvalData = {
        applicant_id: "current-user-id", // TODO: 実際のユーザーIDを取得
        application_code_id: category,
        form_data: {
          title: formData.title,
          project_name: formData.projectName,
          remarks: formData.remarks,
          ...getFormDataByCategory(selectedCode?.category),
        },
        status: status as any,
        submitted_at: status === "submitted" ? new Date().toISOString() : null,
      }

      await createApproval(approvalData)

      toast.success(status === "draft" ? "下書きを保存しました" : "申請を提出しました")
      onSubmit()
    } catch (error) {
      console.error("Error creating approval:", error)
      toast.error("申請の作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFormDataByCategory = (categoryType?: string) => {
    switch (categoryType) {
      case "EXP":
        return {
          subject: formData.subject,
          content: formData.content,
          recipient_id: formData.recipient,
          amount: formData.amount ? Number.parseFloat(formData.amount) : 0,
          billing_date: formData.billingDate,
          payment_due_date: formData.paymentDate,
        }
      case "LEV":
        return {
          start_date: formData.startDate,
          end_date: formData.endDate,
          leave_type: formData.leaveType,
          alternate_contact: formData.alternateContact,
          reason: formData.reason,
        }
      case "NOC":
        return {
          content: formData.approvalContent,
          approval_reason: formData.approvalReason,
        }
      default:
        return {}
    }
  }

  const renderExpenseForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-t border-slate-700 pt-4">経費申請詳細</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-slate-300">
            科目 *
          </Label>
          <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="科目を選択" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-slate-300">
            金額 *
          </Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="50000"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-slate-300">
          支払先 *
        </Label>
        <div className="flex space-x-2">
          <Select value={formData.recipient} onValueChange={(value) => setFormData({ ...formData, recipient: value })}>
            <SelectTrigger className="bg-slate-700 border-slate-600 flex-1">
              <SelectValue placeholder="支払先を選択" />
            </SelectTrigger>
            <SelectContent>
              {recipientsLoading ? (
                <div className="p-2 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : (
                recipients?.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    {recipient.recipient_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => {
              onClose()
              setCurrentPage(Page.Recipients)
            }}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-slate-300">
          内容（詳細説明） *
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="経費の詳細内容を記載してください"
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingDate" className="text-slate-300">
            請求日 *
          </Label>
          <Input
            id="billingDate"
            type="date"
            value={formData.billingDate}
            onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentDate" className="text-slate-300">
            支払予定日 *
          </Label>
          <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
    </div>
  )

  const renderLeaveForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-t border-slate-700 pt-4">有給休暇申請詳細</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-slate-300">
            開始日 *
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-slate-300">
            終了日 *
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="leaveType" className="text-slate-300">
          休暇区分 *
        </Label>
        <Select value={formData.leaveType} onValueChange={(value) => setFormData({ ...formData, leaveType: value })}>
          <SelectTrigger className="bg-slate-700 border-slate-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全日">全日</SelectItem>
            <SelectItem value="午前半休">午前半休</SelectItem>
            <SelectItem value="午後半休">午後半休</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="alternateContact" className="text-slate-300">
          連絡方法
        </Label>
        <Input
          id="alternateContact"
          value={formData.alternateContact}
          onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
          placeholder="緊急時の連絡方法（任意）"
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-slate-300">
          理由 *
        </Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="有給取得の理由を記載してください"
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
    </div>
  )

  const renderNoCostForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-t border-slate-700 pt-4">金額なし決裁申請詳細</h3>
      <div className="space-y-2">
        <Label htmlFor="approvalContent" className="text-slate-300">
          申請内容 *
        </Label>
        <Textarea
          id="approvalContent"
          value={formData.approvalContent}
          onChange={(e) => setFormData({ ...formData, approvalContent: e.target.value })}
          placeholder="申請内容を詳しく記載してください"
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="approvalReason" className="text-slate-300">
          承認対象 *
        </Label>
        <Textarea
          id="approvalReason"
          value={formData.approvalReason}
          onChange={(e) => setFormData({ ...formData, approvalReason: e.target.value })}
          placeholder="何について承認を求めるか記載してください"
          className="bg-slate-700 border-slate-600 text-white"
          rows={4}
        />
      </div>
    </div>
  )

  const selectedCode = applicationCodes?.find((code) => code.id === category)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">新規申請作成</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <p className="text-slate-300 mb-2">ファイルをドラッグ&ドロップまたはクリックして選択</p>
            <p className="text-slate-500 text-sm">PDF, JPG, PNG (最大10MB)</p>
            <p className="text-emerald-400 text-xs mt-2 bg-emerald-900/30 border border-emerald-500/30 p-2 rounded">
              アップロードされた内容からフォームが自動入力されます。入力内容は手動で修正可能です。
            </p>
          </div>

          {/* Basic Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-300">
                申請カテゴリ *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {codesLoading ? (
                    <div className="p-2 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    </div>
                  ) : (
                    applicationCodes?.map((code) => (
                      <SelectItem key={code.id} value={code.id}>
                        {code.name} ({code.code})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                申請タイトル *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例: 出張費用申請"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-slate-300">
              プロジェクト名
            </Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="関連プロジェクト名（任意）"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-slate-300">
              備考
            </Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="その他特記事項があれば記載してください"
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          {/* Category-specific forms */}
          {selectedCode?.category === "EXP" && renderExpenseForm()}
          {selectedCode?.category === "LEV" && renderLeaveForm()}
          {selectedCode?.category === "NOC" && renderNoCostForm()}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 bg-transparent">
              キャンセル
            </Button>
            <Button
              onClick={() => handleSubmit("draft")}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              下書き保存
            </Button>
            <Button
              onClick={() => handleSubmit("submitted")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              申請
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
