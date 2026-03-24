import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface KPIItem {
  label: string
  value: string
  status: 'good' | 'warning' | 'critical'
  target?: string
}

const kpiData: KPIItem[] = [
  { label: 'Patient Satisfaction', value: '94%', status: 'good', target: '90%' },
  { label: 'Readmission Rate', value: '8.2%', status: 'good', target: '<10%' },
  { label: 'Avg Length of Stay', value: '4.3 days', status: 'warning', target: '4.0 days' },
  { label: 'ED Wait Time', value: '42 min', status: 'warning', target: '35 min' },
  { label: 'Bed Turnover', value: '78%', status: 'good', target: '75%' },
  { label: 'Staff Utilization', value: '86%', status: 'good', target: '85%' },
]

const cacheMetrics = [
  { label: 'Regional Cache', value: '92%', status: 'good' as const },
  { label: 'Global Cache', value: '87%', status: 'good' as const },
]

export function KPIIndicators() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Operational KPIs
          </CardTitle>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{kpi.label}</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-mono text-sm font-medium',
                  kpi.status === 'good' && 'text-success',
                  kpi.status === 'warning' && 'text-warning',
                  kpi.status === 'critical' && 'text-destructive',
                )}
              >
                {kpi.value}
              </span>
              {kpi.target && (
                <span className="text-xs text-muted-foreground">
                  / {kpi.target}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CachingMetrics() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Data Sync
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Hit Rate (%)
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Cache Hits</div>
          {cacheMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: metric.value }}
                  />
                </div>
                <span className="font-mono text-xs text-foreground">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Cache Miss</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-muted-foreground"
                style={{ width: '8%' }}
              />
            </div>
            <span className="font-mono text-xs text-foreground">8%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface NetworkMetric {
  label: string
  current: string
  previous: string
  unit: string
}

const networkData: NetworkMetric[] = [
  { label: 'Outgoing', current: '496', previous: '462', unit: 'GB' },
  { label: 'Incoming', current: '381', previous: '348', unit: 'GB' },
]

export function NetworkTransfer() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Data Transfer
          </CardTitle>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-4 pt-1">
          {networkData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  item.label === 'Outgoing' ? 'bg-chart-1' : 'bg-chart-3',
                )}
              />
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span className="font-mono text-xs font-medium text-foreground">
                {item.current}
                {item.unit}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  )
}
