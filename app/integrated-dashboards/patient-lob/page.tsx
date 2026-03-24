"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { PatientMembersByLobDashboard } from "@/components/dashboard/patient-members-by-lob"

export default function PatientMembersByLobPage() {
  return (
    <DashboardLayout title="Patient-Members by LOB">
      <PatientMembersByLobDashboard />
    </DashboardLayout>
  )
}
