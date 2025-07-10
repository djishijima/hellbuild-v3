import { Suspense } from "react"
import Dashboard from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
