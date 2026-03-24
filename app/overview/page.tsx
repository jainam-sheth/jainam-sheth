"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"

export default function OverviewPage() {
  return (
    <DashboardLayout title="Overview">
      <OverviewDashboard />
    </DashboardLayout>
  )
}
