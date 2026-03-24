import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CostComponentSummary } from "@/components/dashboard/cost-component-summary"

export default function CostComponentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Cost Component Summary" />
      <main className="ml-64 pt-14 p-6">
        <CostComponentSummary />
      </main>
    </div>
  )
}
