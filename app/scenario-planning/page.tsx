import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ScenarioPlanning } from "@/components/dashboard/scenario-planning"

export default function ScenarioPlanningPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Scenario Planning" />

      <main className="ml-64 pt-14 p-6 overflow-y-auto">
        <ScenarioPlanning />
      </main>
    </div>
  )
}
