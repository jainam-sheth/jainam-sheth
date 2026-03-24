import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { IntegratedSummaryDashboard } from "@/components/dashboard/integrated-summary"

export default function IntegratedSummaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Summary Revenue, Costs & Margin" />
      <main className="ml-64 pt-14 p-6">
        <IntegratedSummaryDashboard />
      </main>
    </div>
  )
}
