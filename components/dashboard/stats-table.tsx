'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FacilityRow {
  name: string
  type: string
  revenue: number
  trend: 'up' | 'down'
  trendValue: string
  utilization: number
  sparkline?: number[]
}

const facilityData: FacilityRow[] = [
  {
    name: 'Central Medical Center',
    type: 'Hospital',
    revenue: 4250000,
    trend: 'up',
    trendValue: '+12.4%',
    utilization: 87,
    sparkline: [65, 72, 68, 75, 82, 78, 87],
  },
  {
    name: 'North Regional Clinic',
    type: 'Clinic',
    revenue: 1820000,
    trend: 'up',
    trendValue: '+8.2%',
    utilization: 72,
    sparkline: [58, 62, 65, 68, 70, 68, 72],
  },
  {
    name: 'South Health Center',
    type: 'Clinic',
    revenue: 1540000,
    trend: 'down',
    trendValue: '-3.1%',
    utilization: 64,
    sparkline: [72, 70, 68, 65, 66, 64, 64],
  },
  {
    name: 'East Medical Plaza',
    type: 'Hospital',
    revenue: 2180000,
    trend: 'up',
    trendValue: '+5.7%',
    utilization: 79,
    sparkline: [68, 72, 74, 76, 75, 78, 79],
  },
  {
    name: 'West Specialty Care',
    type: 'Specialty',
    revenue: 980000,
    trend: 'up',
    trendValue: '+15.2%',
    utilization: 91,
    sparkline: [70, 75, 80, 84, 88, 90, 91],
  },
]

function MiniSparkline({ data, trend }: { data: number[]; trend: 'up' | 'down' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 60
  const height = 20
  
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={trend === 'up' ? 'var(--success)' : 'var(--destructive)'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FacilityStatsTable() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Facility Performance
          </CardTitle>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
            >
              All
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
            >
              Hospitals
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
            >
              Clinics
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-8 w-[180px] border-border bg-secondary pl-8 text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Facility</th>
                <th className="pb-2 pr-4 font-medium">Revenue</th>
                <th className="pb-2 pr-4 font-medium">Trend</th>
                <th className="pb-2 pr-4 font-medium">Utilization</th>
                <th className="pb-2 font-medium">7-Day</th>
              </tr>
            </thead>
            <tbody>
              {facilityData.map((facility) => (
                <tr
                  key={facility.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {facility.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {facility.type}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-sm text-foreground">
                      ${(facility.revenue / 1000000).toFixed(2)}M
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        facility.trend === 'up'
                          ? 'text-success'
                          : 'text-destructive',
                      )}
                    >
                      {facility.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {facility.trendValue}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            facility.utilization >= 85
                              ? 'bg-success'
                              : facility.utilization >= 70
                                ? 'bg-warning'
                                : 'bg-destructive',
                          )}
                          style={{ width: `${facility.utilization}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {facility.utilization}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    {facility.sparkline && (
                      <MiniSparkline
                        data={facility.sparkline}
                        trend={facility.trend}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 5 of 12 facilities</span>
          <span>1 of 3</span>
        </div>
      </CardContent>
    </Card>
  )
}
