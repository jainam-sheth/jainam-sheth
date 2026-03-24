"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareDeliveryOverview } from "@/components/dashboard/care-delivery-overview"

export default function CareDeliveryOverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Care Delivery Overview" />
      <main className="ml-64 pt-14">
        <CareDeliveryOverview />
      </main>
    </div>
  )
}
