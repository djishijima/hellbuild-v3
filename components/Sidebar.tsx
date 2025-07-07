"use client"

import { cn } from "@/lib/utils"
import { Page } from "@/types"
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckSquare,
  TrendingUp,
  Building2,
  CreditCard,
  FileImage,
  Mic,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { page: Page.Dashboard, icon: LayoutDashboard, label: "ダッシュボード" },
  { page: Page.Approvals, icon: FileText, label: "上申書管理" },
  { page: Page.Tasks, icon: CheckSquare, label: "タスク管理" },
  { page: Page.Users, icon: Users, label: "ユーザー管理" },
  { page: Page.Recipients, icon: CreditCard, label: "支払先管理" },
  { page: Page.Customers, icon: Building2, label: "顧客管理" },
  { page: Page.Leads, icon: TrendingUp, label: "リード管理" },
  { page: Page.OcrDocuments, icon: FileImage, label: "OCR文書" },
  { page: Page.Transcriptions, icon: Mic, label: "音声転写" },
]

export function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 z-50",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-white font-semibold">メニュー</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page)
                onClose()
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                currentPage === item.page
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
