"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { UserResourcesDashboard } from "@/components/dashboard/user-resources"

export default function UserResourcesPage() {
  return (
    <DashboardLayout title="User Resources">
      <UserResourcesDashboard />
    </DashboardLayout>
  )
}
