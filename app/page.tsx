"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Dashboard } from "@/components/Dashboard"
import { ApprovalDashboard } from "@/components/ApprovalDashboard"
import { Users } from "@/components/Users"
import { Tasks } from "@/components/Tasks"
import { Leads } from "@/components/Leads"
import { CustomerManagement } from "@/components/CustomerManagement"
import { RecipientManagement } from "@/components/RecipientManagement"
import { OcrDocuments } from "@/components/OcrDocuments"
import { Transcriptions } from "@/components/Transcriptions"
import { Page } from "@/types"

export default function BusinessManagementSystem() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />
      case Page.Approvals:
        return <ApprovalDashboard setCurrentPage={setCurrentPage} />
      case Page.Users:
        return <Users />
      case Page.Tasks:
        return <Tasks />
      case Page.Leads:
        return <Leads />
      case Page.Customers:
        return <CustomerManagement />
      case Page.Recipients:
        return <RecipientManagement />
      case Page.OcrDocuments:
        return <OcrDocuments />
      case Page.Transcriptions:
        return <Transcriptions />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 ml-0 lg:ml-64 transition-all duration-300">{renderCurrentPage()}</main>
      </div>
    </div>
  )
}
