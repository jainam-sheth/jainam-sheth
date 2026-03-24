"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { PatientMembersByAttributionDashboard } from "@/components/dashboard/patient-members-by-attribution"

export default function PatientMembersByAttributionPage() {
  return (
    <DashboardLayout title="Patient-Members by Attribution">
      <PatientMembersByAttributionDashboard />
    </DashboardLayout>
  )
}
