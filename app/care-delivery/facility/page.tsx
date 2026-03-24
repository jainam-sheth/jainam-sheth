"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareDeliveryFacility } from "@/components/dashboard/care-delivery-facility"

export default function CareDeliveryFacilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Facility Performance" />
      <main className="ml-64 pt-14">
        <CareDeliveryFacility />
      </main>
    </div>
  )
}
