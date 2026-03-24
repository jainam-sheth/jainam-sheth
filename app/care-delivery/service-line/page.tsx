"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareDeliveryServiceLine } from "@/components/dashboard/care-delivery-service-line"

export default function CareDeliveryServiceLinePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Service Line Analysis" />
      <main className="ml-64 pt-14">
        <CareDeliveryServiceLine />
      </main>
    </div>
  )
}
