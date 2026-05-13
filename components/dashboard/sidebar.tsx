'use client'

import React from "react"

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Activity,
  DollarSign,
  ChevronDown,
  Stethoscope,
  Building2,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  active?: boolean
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'INTEGRATED ECONOMICS',
    items: [
      {
        label: 'Summary Revenue, Costs & Margin',
        icon: DollarSign,
        href: '/integrated-dashboards/summary',
      },
      {
        label: 'Consumer Distribution',
        icon: Users,
        href: '/integrated-dashboards/consumer-distribution',
      },
      {
        label: 'Patient-Members by Attribution',
        icon: Activity,
        href: '/integrated-dashboards/patient-attribution',
      },
      {
        label: 'Patient-Members by LOB',
        icon: Activity,
        href: '/integrated-dashboards/patient-lob',
      },
    ],
  },
  {
    title: 'CARE DELIVERY ECONOMICS',
    items: [
      {
        label: 'Overview',
        icon: Stethoscope,
        href: '/care-delivery/overview',
      },
      {
        label: 'Service Line Analysis',
        icon: Activity,
        href: '/care-delivery/service-line',
      },
      {
        label: 'Facility Performance',
        icon: Building2,
        href: '/care-delivery/facility',
      },
      {
        label: 'Patient Mix',
        icon: Users,
        href: '/care-delivery/patient-mix',
      },
    ],
  },
  {
    title: 'PLAN ECONOMICS',
    items: [
      {
        label: 'Overview',
        icon: LayoutDashboard,
        href: '/overview',
      },
      {
        label: 'MLR Analysis',
        icon: TrendingUp,
        href: '/mlr',
      },
      {
        label: 'Consumer Economics',
        icon: TrendingUp,
        href: '/consumer-economics',
      },
      {
        label: 'Cost Components',
        icon: DollarSign,
        href: '/cost-components',
      },
      {
        label: 'Revenue Components',
        icon: DollarSign,
        href: '/revenue-components',
      },
      {
        label: 'Chronic Conditions',
        icon: Activity,
        href: '/chronic-conditions',
      },
      {
        label: 'Consumer Cohorts',
        icon: Activity,
        href: '/consumer-cohorts',
      },
      {
        label: 'Provider Attribution',
        icon: Activity,
        href: '/provider-attribution',
      },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      {
        label: 'Scenario Planning',
        icon: TrendingUp,
        href: '/scenario-planning',
        badge: 'New',
      },
      {
        label: 'Trends',
        icon: TrendingUp,
        href: '/trends',
      },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      {
        label: 'User Resources',
        icon: Settings,
        href: '/integrated-dashboards/user-resources',
      },
    ],
  },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                IEM
              </span>
              <span className="text-[10px] text-muted-foreground">
                Integrated Economics
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Organization Selector */}
      {!collapsed && (
        <div className="border-b border-border p-3">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-medium text-primary">
                HC
              </div>
              <span className="text-foreground">HealthCare IDN</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title || sectionIndex} className="mb-4">
            {section.title && !collapsed && (
              <p className="mb-2 px-3 text-[10px] font-medium tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      collapsed && 'justify-center px-2',
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center px-2',
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  )
}
