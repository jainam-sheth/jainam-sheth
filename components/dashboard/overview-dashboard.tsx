"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { getTrendsData, aggregateMLRData } from "@/lib/data/mlr-data"
import { mlrChartColors } from "@/lib/colors/mckinsey-palette"

// Format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

// Format currency
const formatCurrency = (num: number) => {
  return `$${formatNumber(num)}`
}

export function OverviewDashboard() {
  // Get trends data from central source
  const trendsData = useMemo(() => getTrendsData("year"), [])

  // Calculate summary metrics - use trendsData for consistency with charts
  const summaryMetrics = useMemo(() => {
    const totalRevenue = trendsData.reduce((sum, row) => sum + row.revenue, 0)
    const totalCost = trendsData.reduce((sum, row) => sum + row.cost, 0)
    const totalMemberMonths = trendsData.reduce((sum, row) => sum + row.memberMonths, 0)

    // Calculate YoY changes using trends data (same source as charts)
    const sortedYears = [...trendsData].sort((a, b) => a.year - b.year)
    const latestYear = sortedYears[sortedYears.length - 1]
    const previousYear = sortedYears[sortedYears.length - 2]
    
    const revenueChange = previousYear && latestYear 
      ? ((latestYear.revenue - previousYear.revenue) / previousYear.revenue) * 100 
      : 0
    const costChange = previousYear && latestYear 
      ? ((latestYear.cost - previousYear.cost) / previousYear.cost) * 100 
      : 0
    const memberChange = previousYear && latestYear 
      ? ((latestYear.memberMonths - previousYear.memberMonths) / previousYear.memberMonths) * 100 
      : 0
    const mlrChange = previousYear && latestYear 
      ? latestYear.mlr - previousYear.mlr 
      : 0

    return {
      totalRevenue,
      totalCost,
      totalMemberMonths,
      revenueChange,
      costChange,
      memberChange,
      mlrChange,
      latestMlr: latestYear?.mlr || 0,
    }
  }, [trendsData])

  // Prepare MLR trend chart data
  const mlrTrendData = useMemo(() => {
    return trendsData.map(item => ({
      year: item.year.toString(),
      MLR: item.mlr,
    }))
  }, [trendsData])

  // Prepare Revenue/Cost trend data
  const financialTrendData = useMemo(() => {
    return trendsData.map(item => ({
      year: item.year.toString(),
      Revenue: item.revenue,
      Cost: item.cost,
    }))
  }, [trendsData])

  // Prepare Member Months trend data
  const memberTrendData = useMemo(() => {
    return trendsData.map(item => ({
      year: item.year.toString(),
      "Member Months": item.memberMonths,
    }))
  }, [trendsData])

  // Get top 3 and bottom 3 performing sublobs by MLR in the latest year
  const { topSublobsByMlr, bottomSublobsByMlr, latestYear } = useMemo(() => {
    const latestYr = Math.max(...trendsData.map(d => d.year))
    
    // Get yearly data filtered to latest year only
    const sublobData = aggregateMLRData("year", { years: [latestYr] })
    
    // Aggregate by sublob across the latest year
    const sublobAggregated = new Map<string, { sublob: string; lob: string; revenue: number; cost: number; memberMonths: number }>()
    
    for (const row of sublobData) {
      const existing = sublobAggregated.get(row.sublob)
      if (existing) {
        existing.revenue += row.revenue
        existing.cost += row.cost
        existing.memberMonths += row.memberMonths
      } else {
        sublobAggregated.set(row.sublob, {
          sublob: row.sublob,
          lob: row.lob,
          revenue: row.revenue,
          cost: row.cost,
          memberMonths: row.memberMonths,
        })
      }
    }
    
    // Calculate MLR and sort (lower is better for profitability)
    const allSublobs = Array.from(sublobAggregated.values())
      .map(row => ({
        sublob: row.sublob,
        lob: row.lob,
        mlr: row.revenue > 0 ? (row.cost / row.revenue) * 100 : 0,
        memberMonths: row.memberMonths,
      }))
      .sort((a, b) => a.mlr - b.mlr)
    
    return {
      topSublobsByMlr: allSublobs.slice(0, 3),
      bottomSublobsByMlr: allSublobs.slice(-3).reverse(),
      latestYear: latestYr,
    }
  }, [trendsData])

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* MLR Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Loss Ratio (MLR)
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {summaryMetrics.latestMlr.toFixed(1)}%
              </span>
              <span className={`flex items-center text-xs font-medium ${
                summaryMetrics.mlrChange < 0 ? 'text-success' : summaryMetrics.mlrChange > 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {summaryMetrics.mlrChange > 0 ? '+' : ''}{summaryMetrics.mlrChange.toFixed(1)}pp
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Target: 85% | Lower is better
            </p>
          </CardContent>
        </Card>

        {/* Net Revenue Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Revenue
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {formatCurrency(summaryMetrics.totalRevenue)}
              </span>
              <span className={`flex items-center text-xs font-medium ${
                summaryMetrics.revenueChange > 0 ? 'text-success' : summaryMetrics.revenueChange < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {summaryMetrics.revenueChange > 0 ? '+' : ''}{summaryMetrics.revenueChange.toFixed(1)}%
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              YoY Change
            </p>
          </CardContent>
        </Card>

        {/* Net Costs Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Costs
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {formatCurrency(summaryMetrics.totalCost)}
              </span>
              <span className={`flex items-center text-xs font-medium ${
                summaryMetrics.costChange < 0 ? 'text-success' : summaryMetrics.costChange > 0 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {summaryMetrics.costChange > 0 ? '+' : ''}{summaryMetrics.costChange.toFixed(1)}%
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              YoY Change
            </p>
          </CardContent>
        </Card>

        {/* Member Counts Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Member Months
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {formatNumber(summaryMetrics.totalMemberMonths)}
              </span>
              <span className={`flex items-center text-xs font-medium ${
                summaryMetrics.memberChange > 0 ? 'text-success' : summaryMetrics.memberChange < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {summaryMetrics.memberChange > 0 ? '+' : ''}{summaryMetrics.memberChange.toFixed(1)}%
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              YoY Change
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* MLR Trend Chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-foreground">
              MLR Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mlrTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'MLR']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="MLR" 
                    stroke={mlrChartColors.mlrActual}
                    strokeWidth={2}
                    dot={{ fill: mlrChartColors.mlrActual, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Cost Trend Chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-foreground">
              Revenue & Cost Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrency(value)]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke={mlrChartColors.revenue}
                    strokeWidth={2}
                    dot={{ fill: mlrChartColors.revenue, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Cost" 
                    stroke={mlrChartColors.cost}
                    strokeWidth={2}
                    dot={{ fill: mlrChartColors.cost, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Months Trend - Full Width */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">
            Member Months Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memberTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatNumber(value), 'Member Months']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Member Months" 
                  stroke={mlrChartColors.memberMonths}
                  strokeWidth={2}
                  dot={{ fill: mlrChartColors.memberMonths, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 and Bottom 3 Performing Sublobs by MLR */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 3 Performing */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-foreground">
              Top 3 Performing Sublobs ({latestYear})
            </CardTitle>
            <p className="text-xs text-muted-foreground">Lowest MLR - Best cost efficiency</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSublobsByMlr.map((item, index) => (
                <div key={item.sublob} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.sublob}</p>
                      <p className="text-xs text-muted-foreground">{item.lob}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      {item.mlr.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{formatNumber(item.memberMonths)} members</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom 3 Performing */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-foreground">
              Bottom 3 Performing Sublobs ({latestYear})
            </CardTitle>
            <p className="text-xs text-muted-foreground">Highest MLR - Needs improvement</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomSublobsByMlr.map((item, index) => (
                <div key={item.sublob} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.sublob}</p>
                      <p className="text-xs text-muted-foreground">{item.lob}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">
                      {item.mlr.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{formatNumber(item.memberMonths)} members</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
