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
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
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
  Area,
  AreaChart,
} from "recharts"
import { getTrendsData, getFilterOptions } from "@/lib/data/mlr-data"
import { mlrChartColors } from "@/lib/colors/mckinsey-palette"
import { useGlobalFilters } from "@/contexts/global-filters-context"


const filterOptions = getFilterOptions()

// Generate scenario data based on adjustments
function generateScenarioData(
  baseData: ReturnType<typeof getTrendsData>,
  membershipGrowth: number,
  costTrend: number,
  revenueTrend: number
) {
  return baseData.map((item, index) => {
    const yearFactor = Math.floor(index / 4) // Assuming quarterly data
    const membershipMultiplier = Math.pow(1 + membershipGrowth / 100, yearFactor)
    const costMultiplier = Math.pow(1 + costTrend / 100, yearFactor)
    const revenueMultiplier = Math.pow(1 + revenueTrend / 100, yearFactor)

    const scenarioMemberMonths = item.memberMonths * membershipMultiplier
    // Membership growth impacts both revenue and cost (more members = more revenue and more cost)
    // Cost and Revenue trends adjust the per-member rates
    const scenarioCost = item.cost * membershipMultiplier * costMultiplier
    const scenarioRevenue = item.revenue * membershipMultiplier * revenueMultiplier
    const scenarioMLR = scenarioRevenue > 0 ? (scenarioCost / scenarioRevenue) * 100 : 0

    return {
      ...item,
      // Baseline values
      baselineMemberMonths: item.memberMonths,
      baselineCost: item.cost,
      baselineRevenue: item.revenue,
      baselineMLR: item.mlr,
      // Scenario values
      scenarioMemberMonths,
      scenarioCost,
      scenarioRevenue,
      scenarioMLR,
      // Differences
      memberMonthsDiff: scenarioMemberMonths - item.memberMonths,
      costDiff: scenarioCost - item.cost,
      revenueDiff: scenarioRevenue - item.revenue,
      mlrDiff: scenarioMLR - item.mlr,
    }
  })
}

export function ScenarioPlanning() {
  // Scenario adjustment sliders
  const [membershipGrowth, setMembershipGrowth] = useState(0)
  const [costTrend, setCostTrend] = useState(0)
  const [revenueTrend, setRevenueTrend] = useState(0)
  const [mlrTarget, setMlrTarget] = useState(85)

  // Global filters
  const {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    geoFilters,
    centralFilters,
  } = useGlobalFilters()

  // Get base data
  const baseData = useMemo(() => {
    return getTrendsData("quarter", centralFilters)
  }, [centralFilters])

  // Generate scenario data
  const scenarioData = useMemo(() => {
    return generateScenarioData(baseData, membershipGrowth, costTrend, revenueTrend)
  }, [baseData, membershipGrowth, costTrend, revenueTrend])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const lastBaseline = baseData[baseData.length - 1]
    const lastScenario = scenarioData[scenarioData.length - 1]
    
    const totalBaselineRevenue = baseData.reduce((sum, d) => sum + d.revenue, 0)
    const totalScenarioRevenue = scenarioData.reduce((sum, d) => sum + d.scenarioRevenue, 0)
    const totalBaselineCost = baseData.reduce((sum, d) => sum + d.cost, 0)
    const totalScenarioCost = scenarioData.reduce((sum, d) => sum + d.scenarioCost, 0)

    const scenarioMLR = lastScenario?.scenarioMLR || 0
    
    return {
      revenueImpact: totalScenarioRevenue - totalBaselineRevenue,
      costImpact: totalScenarioCost - totalBaselineCost,
      mlrChange: scenarioMLR - (lastBaseline?.mlr || 0),
      membershipChange: lastScenario?.scenarioMemberMonths - lastBaseline?.memberMonths || 0,
      scenarioMLR,
      meetsTarget: scenarioMLR <= mlrTarget,
    }
  }, [baseData, scenarioData, mlrTarget])

  const formatBillions = (value: number) => `$${(value / 1000000000).toFixed(2)}B`
  const formatMillions = (value: number) => `$${(value / 1000000).toFixed(0)}M`
  const formatMemberMonths = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Scenario Planning</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Adjust parameters to model different scenarios</span>
          </div>
        </div>

        {/* Scenario Controls */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Scenario Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Membership Growth</Label>
                  <span className="text-sm font-bold" style={{ color: membershipGrowth >= 0 ? mlrChartColors.success : mlrChartColors.destructive }}>
                    {membershipGrowth >= 0 ? '+' : ''}{membershipGrowth}%
                  </span>
                </div>
                <Slider
                  value={[membershipGrowth]}
                  onValueChange={(v) => setMembershipGrowth(v[0])}
                  min={-20}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Annual membership growth rate</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Cost Trend</Label>
                  <span className="text-sm font-bold" style={{ color: costTrend <= 0 ? mlrChartColors.success : mlrChartColors.destructive }}>
                    {costTrend >= 0 ? '+' : ''}{costTrend}%
                  </span>
                </div>
                <Slider
                  value={[costTrend]}
                  onValueChange={(v) => setCostTrend(v[0])}
                  min={-15}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Annual cost increase/decrease</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Revenue Trend</Label>
                  <span className="text-sm font-bold" style={{ color: revenueTrend >= 0 ? mlrChartColors.success : mlrChartColors.destructive }}>
                    {revenueTrend >= 0 ? '+' : ''}{revenueTrend}%
                  </span>
                </div>
                <Slider
                  value={[revenueTrend]}
                  onValueChange={(v) => setRevenueTrend(v[0])}
                  min={-15}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Annual revenue growth rate</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">MLR Target</Label>
                  <span className="text-sm font-bold text-primary">
                    {mlrTarget}%
                  </span>
                </div>
                <Slider
                  value={[mlrTarget]}
                  onValueChange={(v) => setMlrTarget(v[0])}
                  min={70}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Target MLR threshold</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Revenue Impact</div>
              <div className={`text-2xl font-bold ${summaryMetrics.revenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summaryMetrics.revenueImpact >= 0 ? '+' : ''}{formatBillions(summaryMetrics.revenueImpact)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total projected change</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Cost Impact</div>
              <div className={`text-2xl font-bold ${summaryMetrics.costImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summaryMetrics.costImpact >= 0 ? '+' : ''}{formatBillions(summaryMetrics.costImpact)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total projected change</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">MLR Change</div>
              <div className={`text-2xl font-bold ${summaryMetrics.mlrChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summaryMetrics.mlrChange >= 0 ? '+' : ''}{summaryMetrics.mlrChange.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">End of period vs baseline</div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${summaryMetrics.meetsTarget ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">MLR Target Status</div>
              <div className={`text-2xl font-bold ${summaryMetrics.meetsTarget ? 'text-green-600' : 'text-red-600'}`}>
                {summaryMetrics.meetsTarget ? 'On Track' : 'At Risk'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Scenario MLR: {summaryMetrics.scenarioMLR?.toFixed(1)}% | Target: {mlrTarget}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MLR Projection Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground underline">
              MLR Projection: Baseline vs Scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    domain={[75, 105]}
                    label={{ 
                      value: 'MLR %', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name === 'baselineMLR' ? 'Baseline MLR' : name === 'scenarioMLR' ? 'Scenario MLR' : 'Target'
                    ]}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                  />
                  {/* Target line */}
                  <Line
                    type="monotone"
                    dataKey={() => mlrTarget}
                    name="Target"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineMLR"
                    name="Baseline MLR"
                    stroke={mlrChartColors.costBar}
                    strokeWidth={2}
                    dot={{ fill: mlrChartColors.costBar, strokeWidth: 0, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scenarioMLR"
                    name="Scenario MLR"
                    stroke={mlrChartColors.mlrLine}
                    strokeWidth={3}
                    dot={{ fill: mlrChartColors.mlrLine, strokeWidth: 0, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Cost Comparison */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground underline">
              Revenue & Cost: Baseline vs Scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000000000).toFixed(1)}B`}
                    label={{ 
                      value: 'Amount ($)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [formatBillions(value), name]}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="baselineRevenue"
                    name="Baseline Revenue"
                    stroke={mlrChartColors.revenueBar}
                    fill={mlrChartColors.revenueBar}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="scenarioRevenue"
                    name="Scenario Revenue"
                    stroke={mlrChartColors.pmpmRevenue}
                    fill={mlrChartColors.pmpmRevenue}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="baselineCost"
                    name="Baseline Cost"
                    stroke={mlrChartColors.costBar}
                    fill={mlrChartColors.costBar}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="scenarioCost"
                    name="Scenario Cost"
                    stroke={mlrChartColors.mlrLine}
                    fill={mlrChartColors.mlrLine}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-64 shrink-0 space-y-4">
        {/* Filters */}
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Scenario Presets */}
        <Card className="bg-card border-border border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Quick Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setMembershipGrowth(5)
                setCostTrend(3)
                setRevenueTrend(4)
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="font-medium">Optimistic Growth</div>
              <div className="text-xs text-muted-foreground">+5% members, +4% revenue</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setMembershipGrowth(-3)
                setCostTrend(5)
                setRevenueTrend(1)
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="font-medium">Cost Pressure</div>
              <div className="text-xs text-muted-foreground">+5% costs, +1% revenue</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setMembershipGrowth(0)
                setCostTrend(-5)
                setRevenueTrend(0)
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="font-medium">Cost Reduction</div>
              <div className="text-xs text-muted-foreground">-5% costs initiative</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setMembershipGrowth(0)
                setCostTrend(0)
                setRevenueTrend(0)
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="font-medium">Reset to Baseline</div>
              <div className="text-xs text-muted-foreground">Clear all adjustments</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
