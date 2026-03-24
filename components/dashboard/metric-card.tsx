import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  change?: {
    value: string
    type: 'positive' | 'negative' | 'neutral'
  }
  chart?: React.ReactNode
  showArrow?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  chart,
  showArrow = false,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('border-border bg-card', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {showArrow && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-semibold text-foreground">{value}</div>
          {change && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                change.type === 'positive' && 'text-success',
                change.type === 'negative' && 'text-destructive',
                change.type === 'neutral' && 'text-muted-foreground',
              )}
            >
              {change.type === 'positive' && (
                <TrendingUp className="h-3 w-3" />
              )}
              {change.type === 'negative' && (
                <TrendingDown className="h-3 w-3" />
              )}
              {change.value}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
        {chart && <div className="mt-4">{chart}</div>}
      </CardContent>
    </Card>
  )
}
