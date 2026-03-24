import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MLRTable } from "@/components/dashboard/mlr-table"

export default function MLRPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="MLR Analysis" />
      <main className="ml-64 pt-14 p-6">
        <MLRTable />
      </main>
    </div>
  )
}
