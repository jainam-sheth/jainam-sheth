'use client'

import React from "react"

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader title={title} />
      <main className="ml-64 pt-14 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
