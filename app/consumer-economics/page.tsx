import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ConsumerEconomicsDashboard } from "@/components/dashboard/consumer-economics"

export default function ConsumerEconomicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Consumer Economics" />
      <main className="ml-64 pt-14 p-6">
        <ConsumerEconomicsDashboard />
      </main>
    </div>
  )
}
