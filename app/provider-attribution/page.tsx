import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProviderAttributionDashboard } from "@/components/dashboard/provider-attribution"

export default function ProviderAttributionPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Consumer Economics Summary Dashboard" />

      <main className="ml-64 pt-14 p-6 overflow-y-auto">
        <ProviderAttributionDashboard />
      </main>
    </div>
  )
}
