'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Calendar, FilterX, LineChart, MoreHorizontal } from 'lucide-react'
import { useGlobalFilters } from '@/contexts/global-filters-context'

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { resetAllFilters } = useGlobalFilters()

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Clear All Filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllFilters}
          className="h-9 gap-2 border-border bg-transparent text-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
        >
          <FilterX className="h-4 w-4" />
          Clear All Filters
        </Button>

        {/* Environment Selector */}
        <Select defaultValue="production">
          <SelectTrigger className="h-9 w-[140px] border-border bg-secondary text-sm">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 rounded-md border border-border bg-secondary px-3 py-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select defaultValue="12h">
            <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="12h">Last 12 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <LineChart className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
