"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareDeliveryPatientMix } from "@/components/dashboard/care-delivery-patient-mix"

export default function CareDeliveryPatientMixPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title="Patient Mix & Demographics" />
      <main className="ml-64 pt-14">
        <CareDeliveryPatientMix />
      </main>
    </div>
  )
}
