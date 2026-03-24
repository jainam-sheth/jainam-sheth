import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { RevenueComponentSummary } from "@/components/dashboard/revenue-component-summary"

export default function RevenueComponentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Revenue Components" />

      <main className="ml-64 pt-14 p-6">
        <RevenueComponentSummary />
      </main>
    </div>
  )
}
