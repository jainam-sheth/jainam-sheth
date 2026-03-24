"use client"

import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  BarChart,
} from "recharts"
import { getTrendsData, getFilterOptions, getSublobBreakdown, type AggregationLevel } from "@/lib/data/mlr-data"
import { mlrChartColors } from "@/lib/colors/mckinsey-palette"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"

const filterOptions = getFilterOptions()

const formatMemberMonths = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  return `${(value / 1000).toFixed(0)}K`
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const formatMLR = (value: number) => `${value.toFixed(0)}%`

const formatBillions = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}bn`
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  }
  return `$${value.toLocaleString()}`
}

const formatBillionsShort = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}bn`
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  }
  return `$${value.toLocaleString()}`
}

// Calculate CAGR (Compound Annual Growth Rate)
const calculateCAGR = (startValue: number, endValue: number, years: number): number => {
  if (startValue <= 0 || years <= 0) return 0
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
}

type RevenueChartView = "pmpm" | "total"

export function ConsumerEconomicsDashboard() {
  const [revenueChartView, setRevenueChartView] = useState<RevenueChartView>("pmpm")
  const {
    aggregationLevel,
    setAggregationLevel,
    yearFilter,
    setYearFilter,
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    selectedConsumerMarkets,
    setSelectedConsumerMarkets,
    selectedConsumerRegions,
    setSelectedConsumerRegions,
    selectedServiceAreas,
    setSelectedServiceAreas,
    availableConsumerMarkets,
    availableConsumerRegions,
    availableServiceAreas,
    geoFilters,
    centralFilters,
  } = useGlobalFilters()

  const setLobFilter = handleLobChange
  const setSublobFilter = handleSublobChange

  const filteredData = useMemo(() => {
    return getTrendsData(aggregationLevel, centralFilters)
  }, [aggregationLevel, centralFilters])

  // Chart data with additional calculated fields
  const chartData = useMemo(() => {
    return filteredData.map((d, index) => ({
      ...d,
      index,
      mlrRatio: d.mlr / 100,
    }))
  }, [filteredData])

  // Calculate CAGR values
  const cagrValues = useMemo(() => {
    if (chartData.length < 2) return { cagrCost: 0, cagrRev: 0 }
    
    const firstPeriod = chartData[0]
    const lastPeriod = chartData[chartData.length - 1]
    
    let years = lastPeriod.year - firstPeriod.year
    if (aggregationLevel === "quarter") {
      years = (lastPeriod.year - firstPeriod.year) + ((lastPeriod.quarter || 1) - (firstPeriod.quarter || 1)) / 4
    } else if (aggregationLevel === "month") {
      years = (lastPeriod.year - firstPeriod.year) + ((lastPeriod.month || 1) - (firstPeriod.month || 1)) / 12
    }
    
    if (years <= 0) years = 1
    
    const cagrCost = calculateCAGR(firstPeriod.cost, lastPeriod.cost, years)
    const cagrRev = calculateCAGR(firstPeriod.revenue, lastPeriod.revenue, years)
    
    return { cagrCost, cagrRev }
  }, [chartData, aggregationLevel])

  // Get sublob breakdown for a data point
  const getSublobDataForPeriod = (dataPoint: typeof chartData[0]) => {
    let period: number | undefined
    if (aggregationLevel === "month") {
      period = dataPoint.month
    } else if (aggregationLevel === "quarter") {
      period = dataPoint.quarter
    }
    
    return getSublobBreakdown(aggregationLevel, dataPoint.year, period, centralFilters)
  }

  // Custom tooltip with sublob breakdown grid for Membership chart
  const MembershipTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; payload: typeof chartData[0] }>
    label?: string 
  }) => {
    if (!active || !payload || !payload.length) return null
    
    const dataPoint = payload[0]?.payload
    if (!dataPoint) return null
    
    const sublobData = getSublobDataForPeriod(dataPoint)
    const maxMemberMonths = Math.max(...sublobData.map(s => s.memberMonths), 1)
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl p-4 min-w-[500px]">
        <div className="border-b border-border pb-2 mb-3">
          <h3 className="font-semibold text-foreground">Membership and MLR Trends</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-400 rounded-sm" />
              Member Months
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              MLR (Cost/Revenue)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {sublobData.map((sublob) => {
            const barWidth = (sublob.memberMonths / maxMemberMonths) * 100
            return (
              <div key={sublob.sublob} className="space-y-1">
                <div className="text-xs font-medium text-foreground">{sublob.sublob}</div>
                <div className="flex items-end gap-2 h-16">
                  <div className="text-[9px] text-muted-foreground flex flex-col justify-between h-full">
                    <span>2M</span>
                    <span>1M</span>
                    <span>0M</span>
                  </div>
                  <div className="flex-1 relative h-full flex flex-col justify-end">
                    <div 
                      className="absolute right-0 flex flex-col items-center"
                      style={{ bottom: `${Math.min((sublob.mlr - 60) / 60 * 100, 100)}%` }}
                    >
                      <span className="text-[9px] text-orange-500 font-medium">{sublob.mlr.toFixed(0)}%</span>
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    </div>
                    <div className="flex items-end gap-1">
                      <div 
                        className="bg-gray-400 rounded-t"
                        style={{ 
                          width: '60%',
                          height: `${Math.max(barWidth * 0.8, 10)}%`,
                          minHeight: '8px'
                        }}
                      />
                      <span className="text-[9px] text-muted-foreground">
                        {formatMemberMonths(sublob.memberMonths)}
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground flex flex-col justify-between h-full">
                    <span>120%</span>
                    <span>100%</span>
                    <span>60%</span>
                  </div>
                </div>
                <div className="text-[9px] text-center text-muted-foreground border-t border-border pt-1">
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Tooltip for PMPM chart
  const PMPMTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; payload: typeof chartData[0] }>
    label?: string 
  }) => {
    if (!active || !payload || !payload.length) return null
    
    const dataPoint = payload[0]?.payload
    if (!dataPoint) return null
    
    const sublobData = getSublobDataForPeriod(dataPoint)
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl p-4 min-w-[400px]">
        <div className="border-b border-border pb-2 mb-3">
          <h3 className="font-semibold text-foreground">Revenue and Cost PMPM - {label}</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-sm" />
              PMPM (Revenue)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-900 rounded-sm" />
              PMPM (Cost)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {sublobData.map((sublob) => (
            <div key={sublob.sublob} className="bg-secondary/50 rounded p-2">
              <div className="text-xs font-medium text-foreground mb-1">{sublob.sublob}</div>
              <div className="flex justify-between text-[10px]">
                <span className="text-blue-400">Rev: {formatCurrency(sublob.pmpmRevenue)}</span>
                <span className="text-blue-200">Cost: {formatCurrency(sublob.pmpmCost)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Tooltip for Revenue/Cost/MLR chart
  const RevenueCostTooltip = ({ active, payload }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; dataKey: string; payload: typeof chartData[0] }>
    label?: string 
  }) => {
    if (!active || !payload || !payload.length) return null
    
    const data = payload[0]?.payload
    if (!data) return null
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
        <div className="text-sm text-muted-foreground mb-2">
          <div>YEAR: {data.year}</div>
          {aggregationLevel === "quarter" && <div>QUARTER: {data.quarter}</div>}
          {aggregationLevel === "month" && <div>MONTH: {data.month}</div>}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-400">Revenue:</span>
            <span className="font-medium">{formatBillions(data.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Cost:</span>
            <span className="font-medium">{formatBillions(data.cost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-500">MLR:</span>
            <span className="font-medium">{data.mlrRatio?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Page Title */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-foreground">
            Consumer Economics Summary Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-foreground/80">View by:</span>
            <Select value={aggregationLevel} onValueChange={(v) => setAggregationLevel(v as AggregationLevel)}>
              <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground h-8 w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Membership and MLR Trends Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground underline">
              Membership and MLR Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: aggregationLevel === "month" ? 60 : 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval={aggregationLevel === "month" ? 2 : 0}
                    angle={aggregationLevel === "month" ? -45 : 0}
                    textAnchor={aggregationLevel === "month" ? "end" : "middle"}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={formatMemberMonths}
                    domain={[0, 'auto']}
                    label={{ 
                      value: 'Member Months', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={formatMLR}
                    domain={[75, 105]}
                    label={{ 
                      value: 'MLR (Cost/Revenue)', 
                      angle: 90, 
                      position: 'insideRight',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip content={<MembershipTooltip />} wrapperStyle={{ zIndex: 100 }} />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="memberMonths" 
                    name="Member Months"
                    fill={mlrChartColors.memberMonthsBar}
                    radius={[2, 2, 0, 0]}
                  >
                    <LabelList 
                      dataKey="memberMonths" 
                      position="top" 
                      formatter={formatMemberMonths}
                      style={{ fill: 'var(--foreground)', fontSize: 9 }}
                    />
                  </Bar>
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="mlr" 
                    name="MLR (Cost/Revenue)"
                    stroke={mlrChartColors.mlrLine}
                    strokeWidth={2}
                    dot={{ fill: '#ea580c', r: 4 }}
                  >
                    <LabelList 
                      dataKey="mlr" 
                      position="top" 
                      formatter={(value: number) => `${value.toFixed(0)}%`}
                      style={{ fill: 'var(--foreground)', fontSize: 9 }}
                      offset={10}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {aggregationLevel === "month" ? "MONTH" : aggregationLevel === "quarter" ? "QUARTER" : "YEAR"} (date of service)
            </div>
          </CardContent>
        </Card>

        {/* Revenue and Cost Chart with Toggle */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-base font-semibold text-foreground underline">
                  {revenueChartView === "pmpm" ? "Revenue and Cost PMPM" : "Revenue, Cost and MLR over time"}
                </CardTitle>
                {/* Toggle buttons */}
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setRevenueChartView("pmpm")}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      revenueChartView === "pmpm"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    PMPM
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueChartView("total")}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      revenueChartView === "total"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Total $
                  </button>
                </div>
              </div>
              {revenueChartView === "total" && (
                <div className="flex items-center gap-6 text-xs">
                  <span className="font-medium text-muted-foreground">Legend</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mlrChartColors.revenueBar }} />
                    <span className="text-muted-foreground">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mlrChartColors.costBar }} />
                    <span className="text-muted-foreground">Cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mlrChartColors.mlrLine }} />
                    <span className="text-muted-foreground">MLR (Cost / Revenue)</span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              {revenueChartView === "pmpm" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: aggregationLevel === "month" ? 60 : 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      interval={aggregationLevel === "month" ? 2 : 0}
                      angle={aggregationLevel === "month" ? -45 : 0}
                      textAnchor={aggregationLevel === "month" ? "end" : "middle"}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                      domain={[0, 800]}
                      label={{ 
                        value: 'Revenue and Cost PMPM', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                      }}
                    />
                    <Tooltip content={<PMPMTooltip />} wrapperStyle={{ zIndex: 100 }} />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                    />
                    <Bar 
                      dataKey="pmpmRevenue" 
                      name="PMPM (Revenue)"
                      fill={mlrChartColors.pmpmRevenue}
                      radius={[2, 2, 0, 0]}
                    >
                      <LabelList 
                        dataKey="pmpmRevenue" 
                        position="top" 
                        formatter={formatCurrency}
                        style={{ fill: 'var(--foreground)', fontSize: 8 }}
                        angle={-45}
                      />
                    </Bar>
                    <Bar 
                      dataKey="pmpmCost" 
                      name="PMPM (Cost)"
                      fill={mlrChartColors.pmpmCost}
                      radius={[2, 2, 0, 0]}
                    >
                      <LabelList 
                        dataKey="pmpmCost" 
                        position="top" 
                        formatter={formatCurrency}
                        style={{ fill: 'var(--foreground)', fontSize: 8 }}
                        angle={-45}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: aggregationLevel === "month" ? 60 : 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      interval={aggregationLevel === "month" ? 2 : 0}
                      angle={aggregationLevel === "month" ? -45 : 0}
                      textAnchor={aggregationLevel === "month" ? "end" : "middle"}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000000000).toFixed(1)}bn`}
                      label={{ 
                        value: 'Dollar $', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                      }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                      domain={[0.75, 1.1]}
                      tickFormatter={(v) => v.toFixed(1)}
                      label={{ 
                        value: 'MLR (Cost / Revenue)', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                      }}
                    />
                    <Tooltip content={<RevenueCostTooltip />} />
                    <Bar 
                      yAxisId="left"
                      dataKey="revenue" 
                      fill={mlrChartColors.revenueBar}
                      radius={[2, 2, 0, 0]}
                      barSize={18}
                    >
                      <LabelList 
                        dataKey="revenue" 
                        position="top" 
                        formatter={formatBillionsShort}
                        style={{ fill: mlrChartColors.revenueBar, fontSize: 8 }}
                        angle={-45}
                      />
                    </Bar>
                    <Bar 
                      yAxisId="left"
                      dataKey="cost" 
                      fill={mlrChartColors.costBar}
                      radius={[2, 2, 0, 0]}
                      barSize={18}
                    >
                      <LabelList 
                        dataKey="cost" 
                        position="top" 
                        formatter={formatBillionsShort}
                        style={{ fill: mlrChartColors.costBar, fontSize: 8 }}
                        angle={-45}
                      />
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="mlrRatio"
                      stroke={mlrChartColors.mlrLine}
                      strokeWidth={2}
                      dot={{ fill: mlrChartColors.mlrLine, strokeWidth: 0, r: 4 }}
                    >
                      <LabelList 
                        dataKey="mlrRatio" 
                        position="top" 
                        formatter={(v: number) => v.toFixed(2)}
                        style={{ fill: mlrChartColors.mlrLine, fontSize: 9, fontWeight: 500 }}
                      />
                    </Line>
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {aggregationLevel === "month" ? "MONTH" : aggregationLevel === "quarter" ? "QUARTER" : "YEAR"} (date of service)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters & CAGR */}
      <div className="w-64 shrink-0 space-y-4">
        {/* CAGR Metrics - Prominent Position */}
        <div className="flex gap-3">
          <div className="flex-1 border-2 border-primary bg-card rounded-2xl px-3 py-3 text-center shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CAGR Cost</div>
            <div className={`text-xl font-bold ${cagrValues.cagrCost >= 0 ? 'text-success' : 'text-destructive'}`}>
              {cagrValues.cagrCost >= 0 ? '+' : ''}{cagrValues.cagrCost.toFixed(2)}%
            </div>
          </div>
          <div className="flex-1 border-2 border-primary bg-card rounded-2xl px-3 py-3 text-center shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CAGR Rev</div>
            <div className={`text-xl font-bold ${cagrValues.cagrRev >= 0 ? 'text-success' : 'text-destructive'}`}>
              {cagrValues.cagrRev >= 0 ? '+' : ''}{cagrValues.cagrRev.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Global Filters */}
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Global Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">YEAR (date of service)</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions.years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">lob</label>
              <Select value={lobFilter} onValueChange={setLobFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  {availableLobs.map((lob) => (
                    <SelectItem key={lob} value={lob}>
                      {lob}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">sublob</label>
              <Select value={sublobFilter} onValueChange={setSublobFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  {availableSublobs.map((sublob) => (
                    <SelectItem key={sublob} value={sublob}>
                      {sublob}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <MultiSelectFilter
              label="Consumer Market"
              options={availableConsumerMarkets}
              selected={selectedConsumerMarkets}
              onChange={setSelectedConsumerMarkets}
              compact
            />

            <MultiSelectFilter
              label="Consumer Region"
              options={availableConsumerRegions}
              selected={selectedConsumerRegions}
              onChange={setSelectedConsumerRegions}
              compact
            />
          </CardContent>
        </Card>

        {/* Local Filters */}
        <Card className="bg-card border-border border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Local Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiSelectFilter
              label="Service Area"
              options={availableServiceAreas}
              selected={selectedServiceAreas}
              onChange={setSelectedServiceAreas}
              compact
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
