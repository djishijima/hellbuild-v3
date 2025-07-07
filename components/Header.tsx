"use client"

import { Bell, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden text-white hover:bg-slate-800">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">文</span>
          </div>
          <div>
            <h1 className="text-white font-semibold">文唱堂印刷</h1>
            <p className="text-slate-400 text-xs">総合業務管理システム</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
