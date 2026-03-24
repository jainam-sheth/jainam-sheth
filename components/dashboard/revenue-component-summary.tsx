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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import { getFilterOptions, getRevenueComponentData, type AggregationLevel } from "@/lib/data/mlr-data"
import { revenueComponentColors } from "@/lib/colors/mckinsey-palette"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"

const filterOptions = getFilterOptions()

type ViewMode = "percent" | "absolute" | "pmpm"

export function RevenueComponentSummary() {
  const [viewMode, setViewMode] = useState<ViewMode>("percent")
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
    availableConsumerMarkets,
    availableConsumerRegions,
    geoFilters,
    centralFilters,
  } = useGlobalFilters()

  // Get revenue component data from central source with all filters
  const chartData = useMemo(() => {
    return getRevenueComponentData(aggregationLevel, centralFilters)
  }, [aggregationLevel, centralFilters])

  // Get keys based on view mode
  const getRevenueKeys = () => {
    if (viewMode === "percent") {
      return {
        commercialRevenue: "commercialRevenue",
        medicaidKickRevenue: "medicaidKickRevenue",
        medicaidPremiumRevenue: "medicaidPremiumRevenue",
        memberPremiums: "memberPremiums",
        revenuePartC: "revenuePartC",
        revenuePartD: "revenuePartD",
        riskAccrual: "riskAccrual",
        sequestration: "sequestration",
      }
    } else if (viewMode === "pmpm") {
      return {
        commercialRevenue: "commercialRevenuePmpm",
        medicaidKickRevenue: "medicaidKickRevenuePmpm",
        medicaidPremiumRevenue: "medicaidPremiumRevenuePmpm",
        memberPremiums: "memberPremiumsPmpm",
        revenuePartC: "revenuePartCPmpm",
        revenuePartD: "revenuePartDPmpm",
        riskAccrual: "riskAccrualPmpm",
        sequestration: "sequestrationPmpm",
      }
    }
    return {
      commercialRevenue: "commercialRevenue",
      medicaidKickRevenue: "medicaidKickRevenue",
      medicaidPremiumRevenue: "medicaidPremiumRevenue",
      memberPremiums: "memberPremiums",
      revenuePartC: "revenuePartC",
      revenuePartD: "revenuePartD",
      riskAccrual: "riskAccrual",
      sequestration: "sequestration",
    }
  }

  const revenueKeys = getRevenueKeys()

  const formatYAxis = (value: number, mode: ViewMode) => {
    if (mode === "pmpm") return `$${value.toFixed(0)}`
    return `$${(value / 1000000000).toFixed(1)}B`
  }

  const getYAxisDomain = () => {
    if (viewMode === "pmpm") return [0, 800]
    const maxVal = Math.max(...chartData.map(d => d.totalRevenue))
    return [0, Math.ceil(maxVal / 1000000000) * 1000000000]
  }

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
    label?: string 
  }) => {
    if (!active || !payload || !payload.length) return null
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl p-3 min-w-[200px]">
        <div className="font-semibold text-foreground mb-2">{label}</div>
        {payload.reverse().map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-foreground font-medium">
              {viewMode === "percent" 
                ? `${((entry.value / (payload.reduce((sum, p) => sum + p.value, 0))) * 100).toFixed(0)}%`
                : viewMode === "pmpm"
                ? `$${entry.value.toFixed(2)}`
                : `$${(entry.value / 1000000).toFixed(1)}M`
              }
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Page Title with View Toggle */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary-foreground">
              Consumer economics summary dashboard
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-foreground/80">View by:</span>
              <Select value={aggregationLevel} onValueChange={(v) => setAggregationLevel(v as AggregationLevel)}>
                <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground h-8 w-28 text-sm">
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
          {/* View Mode Toggles */}
          <div className="flex items-center border border-primary-foreground/30 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("percent")}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "percent"
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              Percent View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("absolute")}
              className={`px-4 py-1.5 text-sm font-medium transition-colors border-l border-primary-foreground/30 ${
                viewMode === "absolute"
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              Absolute Numbers
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pmpm")}
              className={`px-4 py-1.5 text-sm font-medium transition-colors border-l border-primary-foreground/30 ${
                viewMode === "pmpm"
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              PMPM
            </button>
          </div>
        </div>

        {/* Revenue Component Summary Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground underline">
                Revenue Component Summary ({viewMode === "percent" ? "%" : viewMode === "pmpm" ? "PMPM" : "$"} view)
              </CardTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="font-medium text-muted-foreground">Revenue Components</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.commercialRevenue }} />
                  <span className="text-muted-foreground">Commercial Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.medicaidKickRevenue }} />
                  <span className="text-muted-foreground">Medicaid Kick Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.medicaidPremiumRevenue }} />
                  <span className="text-muted-foreground">Medicaid Premium Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.memberPremiums }} />
                  <span className="text-muted-foreground">Member Premiums</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.revenuePartC }} />
                  <span className="text-muted-foreground">Revenue Part C</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.revenuePartD }} />
                  <span className="text-muted-foreground">Revenue Part D</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.riskAccrual }} />
                  <span className="text-muted-foreground">Risk Accrual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: revenueComponentColors.sequestration }} />
                  <span className="text-muted-foreground">Sequestration</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }} stackOffset={viewMode === "percent" ? "expand" : undefined}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval={aggregationLevel === "month" ? 2 : 0}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => viewMode === "percent" ? `${(v * 100).toFixed(0)}%` : formatYAxis(v, viewMode)}
                    domain={viewMode === "percent" ? [0, 1] : getYAxisDomain()}
                    label={{ 
                      value: 'Revenue', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={revenueKeys.commercialRevenue} name="Commercial Revenue" stackId="a" fill={revenueComponentColors.commercialRevenue}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "commercialRevenuePct" : revenueKeys.commercialRevenue} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={revenueKeys.medicaidKickRevenue} name="Medicaid Kick Revenue" stackId="a" fill={revenueComponentColors.medicaidKickRevenue} />
                  <Bar dataKey={revenueKeys.medicaidPremiumRevenue} name="Medicaid Premium Revenue" stackId="a" fill={revenueComponentColors.medicaidPremiumRevenue}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "medicaidPremiumRevenuePct" : revenueKeys.medicaidPremiumRevenue} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={revenueKeys.memberPremiums} name="Member Premiums" stackId="a" fill={revenueComponentColors.memberPremiums} />
                  <Bar dataKey={revenueKeys.revenuePartC} name="Revenue Part C" stackId="a" fill={revenueComponentColors.revenuePartC} />
                  <Bar dataKey={revenueKeys.revenuePartD} name="Revenue Part D" stackId="a" fill={revenueComponentColors.revenuePartD} />
                  <Bar dataKey={revenueKeys.riskAccrual} name="Risk Accrual" stackId="a" fill={revenueComponentColors.riskAccrual} />
                  <Bar dataKey={revenueKeys.sequestration} name="Sequestration" stackId="a" fill={revenueComponentColors.sequestration}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "sequestrationPct" : revenueKeys.sequestration} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 8, fontWeight: 500 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {aggregationLevel === "month" ? "MONTH" : aggregationLevel === "quarter" ? "QUARTER" : "YEAR"} (date of service)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-64 shrink-0 space-y-4">
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
              <Select value={lobFilter} onValueChange={handleLobChange}>
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
              <Select value={sublobFilter} onValueChange={handleSublobChange}>
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
      </div>
    </div>
  )
}
