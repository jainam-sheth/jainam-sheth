"use client"

import React from "react"
import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChevronDown, ChevronRight } from "lucide-react"
import { getFilterOptions, serviceAreas, getGroupedProviderAttributionData } from "@/lib/data/mlr-data"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { mckinseyDataViz, mckinseyCore } from "@/lib/colors/mckinsey-palette"


const filterOptions = getFilterOptions()

// Provider attribution types
type ProviderType = "Provider Group 2" | "Provider Group 1"

export function ProviderAttributionDashboard() {
  const {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    yearFilter,
    setYearFilter,
    hyperTensionFilter,
    setHyperTensionFilter,
    depressionFilter,
    setDepressionFilter,
    hyperlipidFilter,
    setHyperlipidFilter,
    diabetesFilter,
    setDiabetesFilter,
    tobaccoFilter,
    setTobaccoFilter,
    obesityFilter,
    setObesityFilter,
    anxietyFilter,
    setAnxietyFilter,
    depressiveFilter,
    setDepressiveFilter,
    centralFilters,
  } = useGlobalFilters()
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<Set<string>>(new Set(serviceAreas))
  const [providerType, setProviderType] = useState<ProviderType>("Provider Group 2")
  const [viewMode, setViewMode] = useState<"percent" | "absolute">("percent")
  
  // Expanded state for table
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const [expandedLobs, setExpandedLobs] = useState<Set<string>>(new Set())

  const toggleServiceArea = (area: string) => {
    const newSelected = new Set(selectedServiceAreas)
    if (newSelected.has(area)) {
      newSelected.delete(area)
    } else {
      newSelected.add(area)
    }
    setSelectedServiceAreas(newSelected)
  }

  // Filter data from central source
  const filteredData = useMemo(() => {
    const data = getGroupedProviderAttributionData(centralFilters)
    if (selectedServiceAreas.size < serviceAreas.length) {
      return data.filter(row => selectedServiceAreas.has(row.serviceArea))
    }
    return data
  }, [centralFilters, selectedServiceAreas])

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const totals = filteredData.reduce((acc, row) => {
      acc.providerGroup2Members += row.providerGroup2Attributed.memberMonths
      acc.nonProviderGroup2Members += row.nonProviderGroup2.memberMonths
      acc.providerGroup1Members += row.providerGroup1Attributed.memberMonths
      acc.nonProviderGroup1Members += row.nonProviderGroup1.memberMonths
      acc.totalMembers += row.providerGroup2Attributed.memberMonths + row.nonProviderGroup2.memberMonths
      return acc
    }, { providerGroup2Members: 0, nonProviderGroup2Members: 0, providerGroup1Members: 0, nonProviderGroup1Members: 0, totalMembers: 0 })

    return {
      providerGroup2Members: totals.providerGroup2Members,
      providerGroup2Percent: totals.totalMembers > 0 ? (totals.providerGroup2Members / totals.totalMembers) * 100 : 0,
      providerGroup1Members: totals.providerGroup1Members,
      providerGroup1Percent: totals.totalMembers > 0 ? (totals.providerGroup1Members / totals.totalMembers) * 100 : 0,
    }
  }, [filteredData])

  // MLR Trend data
  const mlrTrendData = useMemo(() => {
    const yearlyData = new Map<number, { attributed: number[], nonAttributed: number[] }>()
    
    for (const row of filteredData) {
      if (!yearlyData.has(row.year)) {
        yearlyData.set(row.year, { attributed: [], nonAttributed: [] })
      }
      const yearData = yearlyData.get(row.year)!
      if (providerType === "Provider Group 2") {
        yearData.attributed.push(row.providerGroup2Attributed.mlr)
        yearData.nonAttributed.push(row.nonProviderGroup2.mlr)
      } else {
        yearData.attributed.push(row.providerGroup1Attributed.mlr)
        yearData.nonAttributed.push(row.nonProviderGroup1.mlr)
      }
    }

    return Array.from(yearlyData.entries())
      .map(([year, data]) => ({
        year,
        attributed: Math.round(data.attributed.reduce((a, b) => a + b, 0) / data.attributed.length),
        nonAttributed: Math.round(data.nonAttributed.reduce((a, b) => a + b, 0) / data.nonAttributed.length),
      }))
      .sort((a, b) => a.year - b.year)
  }, [filteredData, providerType])

  // Risk score data - weighted average from central data per year
  const riskScoreData = useMemo(() => {
    const yearlyAgg = new Map<number, {
      attrRiskSum: number; attrMembers: number;
      nonAttrRiskSum: number; nonAttrMembers: number;
    }>()

    for (const row of filteredData) {
      if (!yearlyAgg.has(row.year)) {
        yearlyAgg.set(row.year, { attrRiskSum: 0, attrMembers: 0, nonAttrRiskSum: 0, nonAttrMembers: 0 })
      }
      const agg = yearlyAgg.get(row.year)!
      // Provider Groups = attributed, Non-Provider Groups = non-attributed
      const p2 = row.providerGroup2Attributed
      const p1 = row.providerGroup1Attributed
      const np2 = row.nonProviderGroup2
      const np1 = row.nonProviderGroup1
      agg.attrRiskSum += p2.riskScore * p2.memberMonths + p1.riskScore * p1.memberMonths
      agg.attrMembers += p2.memberMonths + p1.memberMonths
      agg.nonAttrRiskSum += np2.riskScore * np2.memberMonths + np1.riskScore * np1.memberMonths
      agg.nonAttrMembers += np2.memberMonths + np1.memberMonths
    }

    return Array.from(yearlyAgg.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, agg]) => ({
        year,
        attributed: agg.attrMembers > 0 ? Number((agg.attrRiskSum / agg.attrMembers).toFixed(1)) : 0,
        nonAttributed: agg.nonAttrMembers > 0 ? Number((agg.nonAttrRiskSum / agg.nonAttrMembers).toFixed(1)) : 0,
      }))
  }, [filteredData])

  // Table data grouped by year and LOB
  const tableData = useMemo(() => {
    const grouped = new Map<number, Map<string, Array<typeof filteredData[0]>>>()
    
    for (const row of filteredData) {
      if (!grouped.has(row.year)) {
        grouped.set(row.year, new Map())
      }
      const yearMap = grouped.get(row.year)!
      if (!yearMap.has(row.lob)) {
        yearMap.set(row.lob, [])
      }
      yearMap.get(row.lob)!.push(row)
    }

    return grouped
  }, [filteredData])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toFixed(0)
  }

  const getMlrBgColor = (mlr: number) => {
    if (mlr <= 80) return mckinseyDataViz.midTeal
    if (mlr <= 85) return mckinseyDataViz.brightBlue
    if (mlr <= 90) return mckinseyDataViz.lavender
    if (mlr <= 100) return mckinseyDataViz.peach
    return mckinseyDataViz.coral
  }

  const getMlrTextColor = (mlr: number) => {
    if (mlr <= 80) return "#FFFFFF"
    if (mlr <= 85) return "#FFFFFF"
    if (mlr <= 90) return mckinseyCore.navy
    if (mlr <= 100) return mckinseyCore.navy
    return "#FFFFFF"
  }

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const toggleLob = (lob: string) => {
    const newExpanded = new Set(expandedLobs)
    if (newExpanded.has(lob)) {
      newExpanded.delete(lob)
    } else {
      newExpanded.add(lob)
    }
    setExpandedLobs(newExpanded)
  }

  const attributedLabel = providerType === "Provider Group 2" ? "Provider Group 2 Attributed" : "Provider Group 1 Attributed"
  const nonAttributedLabel = providerType === "Provider Group 2" ? "Non-Provider Group 2 / No Attribution" : "Non-Provider Group 1 / No Attribution"

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <h1 className="text-xl font-bold text-foreground">Consumer economics summary dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-l-4 bg-card" style={{ borderLeftColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: mckinseyDataViz.teal }}>Provider Group 2 Attributed Member Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatNumber(kpiMetrics.providerGroup2Members)}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 bg-card" style={{ borderLeftColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: mckinseyDataViz.teal }}>% of Total Member months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpiMetrics.providerGroup2Percent.toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 bg-card" style={{ borderLeftColor: mckinseyDataViz.darkTeal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: mckinseyDataViz.darkTeal }}>Provider Group 1 Attributed Member Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatNumber(kpiMetrics.providerGroup1Members)}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 bg-card" style={{ borderLeftColor: mckinseyDataViz.darkTeal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: mckinseyDataViz.darkTeal }}>% of Total Member Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpiMetrics.providerGroup1Percent.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Provider Type Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Trends by Provider Attribution</span>
          <div className="flex">
            <Button
              variant={providerType === "Provider Group 2" ? "default" : "outline"}
              size="sm"
              onClick={() => setProviderType("Provider Group 2")}
              className={`rounded-r-none ${providerType === "Provider Group 2" ? "bg-zinc-800 text-white" : "bg-transparent"}`}
            >
              Provider Group 2
            </Button>
            <Button
              variant={providerType === "Provider Group 1" ? "default" : "outline"}
              size="sm"
              onClick={() => setProviderType("Provider Group 1")}
              className={`rounded-l-none ${providerType === "Provider Group 1" ? "bg-zinc-800 text-white" : "bg-transparent"}`}
            >
              Provider Group 1
            </Button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* MLR Trend Chart */}
          <Card className="border-t-4 bg-card" style={{ borderTopColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                MLR Trend ({providerType} VS Non-{providerType})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mlrTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                    domain={[60, 120]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="nonAttributed" 
                    name={nonAttributedLabel}
                    stroke={mckinseyDataViz.brightBlue} 
                    strokeWidth={2}
                    dot={{ fill: mckinseyDataViz.brightBlue, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attributed" 
                    name={attributedLabel}
                    stroke={mckinseyDataViz.darkTeal} 
                    strokeWidth={2}
                    dot={{ fill: mckinseyDataViz.darkTeal, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Scores Chart */}
          <Card className="border-t-4 bg-card" style={{ borderTopColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Risk scores for {providerType} attributed members VS other members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    domain={[0, 2.5]}
                    label={{ value: 'Avg ACG Risk...', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="nonAttributed" 
                    name={nonAttributedLabel}
                    fill={mckinseyDataViz.brightBlue} 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="attributed" 
                    name={attributedLabel}
                    fill={mckinseyDataViz.darkTeal} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground">
                MLR and member months by consumer cohorts ({providerType} VS Non-{providerType})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "percent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("percent")}
                  className={viewMode === "percent" ? "bg-zinc-700 text-white" : "bg-transparent"}
                >
                  Percent View
                </Button>
                <Button
                  variant={viewMode === "absolute" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("absolute")}
                  className={viewMode === "absolute" ? "bg-zinc-700 text-white" : "bg-transparent"}
                >
                  Absolute Numbers
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium" rowSpan={2}>{providerType} Attribution<br/>YEAR (date of service)</th>
                    <th className="text-center p-3 font-medium border-l border-border" colSpan={4}>{nonAttributedLabel}</th>
                    <th className="text-center p-3 font-medium border-l border-border" colSpan={4}>{attributedLabel}</th>
                  </tr>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-center p-2 font-medium border-l border-border">MLR</th>
                    <th className="text-center p-2 font-medium">% of Member Months</th>
                    <th className="text-center p-2 font-medium">% of Total Cost</th>
                    <th className="text-center p-2 font-medium">% of Total Revenue</th>
                    <th className="text-center p-2 font-medium border-l border-border">MLR</th>
                    <th className="text-center p-2 font-medium">% of Member Months</th>
                    <th className="text-center p-2 font-medium">% of Total Cost</th>
                    <th className="text-center p-2 font-medium">% of Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(tableData.entries()).sort(([a], [b]) => a - b).map(([year, lobMap]) => {
                    const yearTotals = Array.from(lobMap.values()).flat()
                    const yearAttributed = providerType === "Provider Group 2" 
                      ? yearTotals.reduce((acc, r) => ({ members: acc.members + r.providerGroup2Attributed.memberMonths, cost: acc.cost + r.providerGroup2Attributed.cost, revenue: acc.revenue + r.providerGroup2Attributed.revenue }), { members: 0, cost: 0, revenue: 0 })
                      : yearTotals.reduce((acc, r) => ({ members: acc.members + r.providerGroup1Attributed.memberMonths, cost: acc.cost + r.providerGroup1Attributed.cost, revenue: acc.revenue + r.providerGroup1Attributed.revenue }), { members: 0, cost: 0, revenue: 0 })
                    const yearNonAttributed = providerType === "Provider Group 2"
                      ? yearTotals.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup2.memberMonths, cost: acc.cost + r.nonProviderGroup2.cost, revenue: acc.revenue + r.nonProviderGroup2.revenue }), { members: 0, cost: 0, revenue: 0 })
                      : yearTotals.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup1.memberMonths, cost: acc.cost + r.nonProviderGroup1.cost, revenue: acc.revenue + r.nonProviderGroup1.revenue }), { members: 0, cost: 0, revenue: 0 })
                    const yearTotal = yearAttributed.members + yearNonAttributed.members
                    const yearTotalCost = yearAttributed.cost + yearNonAttributed.cost
                    const yearTotalRevenue = yearAttributed.revenue + yearNonAttributed.revenue

                    return (
                      <React.Fragment key={year}>
                        {(() => {
                          const yearNonAttrMlr = yearNonAttributed.revenue > 0 ? Math.round((yearNonAttributed.cost / yearNonAttributed.revenue) * 100) : 0
                          const yearAttrMlr = yearAttributed.revenue > 0 ? Math.round((yearAttributed.cost / yearAttributed.revenue) * 100) : 0
                          return (
                            <tr 
                              className="border-b border-border bg-muted/30 cursor-pointer hover:bg-muted/50 font-semibold"
                              onClick={() => toggleYear(year)}
                            >
                              <td className="p-3 font-medium flex items-center gap-1">
                                {expandedYears.has(year) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                {year}
                              </td>
                              <td className="text-center p-2 border-l border-border">
                                <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(yearNonAttrMlr), color: getMlrTextColor(yearNonAttrMlr) }}>
                                  {yearNonAttrMlr}%
                                </span>
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotal > 0 ? ((yearNonAttributed.members / yearTotal) * 100).toFixed(2) : 0}%` : formatNumber(yearNonAttributed.members)}
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotalCost > 0 ? ((yearNonAttributed.cost / yearTotalCost) * 100).toFixed(2) : 0}%` : `$${formatNumber(yearNonAttributed.cost)}`}
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotalRevenue > 0 ? ((yearNonAttributed.revenue / yearTotalRevenue) * 100).toFixed(2) : 0}%` : `$${formatNumber(yearNonAttributed.revenue)}`}
                              </td>
                              <td className="text-center p-2 border-l border-border">
                                <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(yearAttrMlr), color: getMlrTextColor(yearAttrMlr) }}>
                                  {yearAttrMlr}%
                                </span>
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotal > 0 ? ((yearAttributed.members / yearTotal) * 100).toFixed(2) : 0}%` : formatNumber(yearAttributed.members)}
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotalCost > 0 ? ((yearAttributed.cost / yearTotalCost) * 100).toFixed(2) : 0}%` : `$${formatNumber(yearAttributed.cost)}`}
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" ? `${yearTotalRevenue > 0 ? ((yearAttributed.revenue / yearTotalRevenue) * 100).toFixed(2) : 0}%` : `$${formatNumber(yearAttributed.revenue)}`}
                              </td>
                            </tr>
                          )
                        })()}
                        {expandedYears.has(year) && Array.from(lobMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([lob, rows]) => {
                          const lobAttributed = providerType === "Provider Group 2"
                            ? rows.reduce((acc, r) => ({ members: acc.members + r.providerGroup2Attributed.memberMonths, cost: acc.cost + r.providerGroup2Attributed.cost, revenue: acc.revenue + r.providerGroup2Attributed.revenue, mlrSum: acc.mlrSum + r.providerGroup2Attributed.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                            : rows.reduce((acc, r) => ({ members: acc.members + r.providerGroup1Attributed.memberMonths, cost: acc.cost + r.providerGroup1Attributed.cost, revenue: acc.revenue + r.providerGroup1Attributed.revenue, mlrSum: acc.mlrSum + r.providerGroup1Attributed.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                          const lobNonAttributed = providerType === "Provider Group 2"
                            ? rows.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup2.memberMonths, cost: acc.cost + r.nonProviderGroup2.cost, revenue: acc.revenue + r.nonProviderGroup2.revenue, mlrSum: acc.mlrSum + r.nonProviderGroup2.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                            : rows.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup1.memberMonths, cost: acc.cost + r.nonProviderGroup1.cost, revenue: acc.revenue + r.nonProviderGroup1.revenue, mlrSum: acc.mlrSum + r.nonProviderGroup1.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })

                          // Group by sublob
                          const sublobMap = new Map<string, typeof rows>()
                          for (const row of rows) {
                            if (!sublobMap.has(row.sublob)) sublobMap.set(row.sublob, [])
                            sublobMap.get(row.sublob)!.push(row)
                          }

                          const lobNonAttrMlr = lobNonAttributed.revenue > 0 ? Math.round((lobNonAttributed.cost / lobNonAttributed.revenue) * 100) : 0
                          const lobAttrMlr = lobAttributed.revenue > 0 ? Math.round((lobAttributed.cost / lobAttributed.revenue) * 100) : 0
                          const lobTotal = lobAttributed.members + lobNonAttributed.members
                          const lobTotalCost = lobAttributed.cost + lobNonAttributed.cost
                          const lobTotalRevenue = lobAttributed.revenue + lobNonAttributed.revenue

                          return (
                            <React.Fragment key={`${year}-${lob}`}>
                              <tr 
                                className="border-b border-border cursor-pointer hover:bg-muted/30"
                                onClick={() => toggleLob(lob)}
                              >
                                <td className="p-3 pl-8 font-medium flex items-center gap-1">
                                  {expandedLobs.has(lob) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {lob}
                                </td>
                                <td className="text-center p-2 border-l border-border">
                                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(lobNonAttrMlr), color: getMlrTextColor(lobNonAttrMlr) }}>
                                    {lobNonAttrMlr}%
                                  </span>
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotal > 0 ? ((lobNonAttributed.members / lobTotal) * 100).toFixed(2) : 0}%` : formatNumber(lobNonAttributed.members)}
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotalCost > 0 ? ((lobNonAttributed.cost / lobTotalCost) * 100).toFixed(2) : 0}%` : `$${formatNumber(lobNonAttributed.cost)}`}
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotalRevenue > 0 ? ((lobNonAttributed.revenue / lobTotalRevenue) * 100).toFixed(2) : 0}%` : `$${formatNumber(lobNonAttributed.revenue)}`}
                                </td>
                                <td className="text-center p-2 border-l border-border">
                                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(lobAttrMlr), color: getMlrTextColor(lobAttrMlr) }}>
                                    {lobAttrMlr}%
                                  </span>
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotal > 0 ? ((lobAttributed.members / lobTotal) * 100).toFixed(2) : 0}%` : formatNumber(lobAttributed.members)}
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotalCost > 0 ? ((lobAttributed.cost / lobTotalCost) * 100).toFixed(2) : 0}%` : `$${formatNumber(lobAttributed.cost)}`}
                                </td>
                                <td className="text-center p-2">
                                  {viewMode === "percent" ? `${lobTotalRevenue > 0 ? ((lobAttributed.revenue / lobTotalRevenue) * 100).toFixed(2) : 0}%` : `$${formatNumber(lobAttributed.revenue)}`}
                                </td>
                              </tr>
                              {expandedLobs.has(lob) && Array.from(sublobMap.entries()).map(([sublob, sublobRows]) => {
                                const sublobAttributed = providerType === "Provider Group 2"
                                  ? sublobRows.reduce((acc, r) => ({ members: acc.members + r.providerGroup2Attributed.memberMonths, cost: acc.cost + r.providerGroup2Attributed.cost, revenue: acc.revenue + r.providerGroup2Attributed.revenue, mlrSum: acc.mlrSum + r.providerGroup2Attributed.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                                  : sublobRows.reduce((acc, r) => ({ members: acc.members + r.providerGroup1Attributed.memberMonths, cost: acc.cost + r.providerGroup1Attributed.cost, revenue: acc.revenue + r.providerGroup1Attributed.revenue, mlrSum: acc.mlrSum + r.providerGroup1Attributed.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                                const sublobNonAttributed = providerType === "Provider Group 2"
                                  ? sublobRows.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup2.memberMonths, cost: acc.cost + r.nonProviderGroup2.cost, revenue: acc.revenue + r.nonProviderGroup2.revenue, mlrSum: acc.mlrSum + r.nonProviderGroup2.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })
                                  : sublobRows.reduce((acc, r) => ({ members: acc.members + r.nonProviderGroup1.memberMonths, cost: acc.cost + r.nonProviderGroup1.cost, revenue: acc.revenue + r.nonProviderGroup1.revenue, mlrSum: acc.mlrSum + r.nonProviderGroup1.mlr, count: acc.count + 1 }), { members: 0, cost: 0, revenue: 0, mlrSum: 0, count: 0 })

                                const nonAttrMlr = Math.round(sublobNonAttributed.mlrSum / sublobNonAttributed.count)
                                const attrMlr = Math.round(sublobAttributed.mlrSum / sublobAttributed.count)
                                const sublobTotal = sublobAttributed.members + sublobNonAttributed.members
                                const sublobTotalCost = sublobAttributed.cost + sublobNonAttributed.cost
                                const sublobTotalRevenue = sublobAttributed.revenue + sublobNonAttributed.revenue

                                return (
                                  <tr key={`${year}-${lob}-${sublob}`} className="border-b border-border hover:bg-muted/20">
                                    <td className="p-3 pl-16">{sublob}</td>
                                    <td className="text-center p-2 border-l border-border">
                                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(nonAttrMlr), color: getMlrTextColor(nonAttrMlr) }}>
                                        {nonAttrMlr}%
                                      </span>
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent" 
                                        ? `${((sublobNonAttributed.members / sublobTotal) * 100).toFixed(2)}%`
                                        : formatNumber(sublobNonAttributed.members)
                                      }
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent"
                                        ? `${((sublobNonAttributed.cost / sublobTotalCost) * 100).toFixed(2)}%`
                                        : `$${formatNumber(sublobNonAttributed.cost)}`
                                      }
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent"
                                        ? `${((sublobNonAttributed.revenue / sublobTotalRevenue) * 100).toFixed(2)}%`
                                        : `$${formatNumber(sublobNonAttributed.revenue)}`
                                      }
                                    </td>
                                    <td className="text-center p-2 border-l border-border">
                                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getMlrBgColor(attrMlr), color: getMlrTextColor(attrMlr) }}>
                                        {attrMlr}%
                                      </span>
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent"
                                        ? `${((sublobAttributed.members / sublobTotal) * 100).toFixed(2)}%`
                                        : formatNumber(sublobAttributed.members)
                                      }
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent"
                                        ? `${((sublobAttributed.cost / sublobTotalCost) * 100).toFixed(2)}%`
                                        : `$${formatNumber(sublobAttributed.cost)}`
                                      }
                                    </td>
                                    <td className="text-center p-2">
                                      {viewMode === "percent"
                                        ? `${((sublobAttributed.revenue / sublobTotalRevenue) * 100).toFixed(2)}%`
                                        : `$${formatNumber(sublobAttributed.revenue)}`
                                      }
                                    </td>
                                  </tr>
                                )
                              })}
                            </React.Fragment>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar Filters */}
      <div className="w-72 space-y-4">
        {/* Global Filters */}
        <Card className="bg-card border-border border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Global Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">lob</label>
                <Select value={lobFilter} onValueChange={handleLobChange}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    {availableLobs.map((lob) => (
                      <SelectItem key={lob} value={lob}>{lob}</SelectItem>
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
                      <SelectItem key={sublob} value={sublob}>{sublob}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">YEAR (date of service)</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions.years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Local Filters */}
        <Card className="bg-card border-border border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Local Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Service Area</label>
              <div className="border border-border rounded-md p-2 bg-secondary max-h-32 overflow-y-auto">
                {serviceAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 py-1">
                    <Checkbox
                      id={`service-area-${area}`}
                      checked={selectedServiceAreas.has(area)}
                      onCheckedChange={() => toggleServiceArea(area)}
                      className="border-border"
                    />
                    <label htmlFor={`service-area-${area}`} className="text-xs text-foreground cursor-pointer">
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chronic Condition Selector */}
        <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.coral }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: mckinseyDataViz.coral }}>Chronic Condition Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Hyper Tension</label>
                <Select value={hyperTensionFilter} onValueChange={setHyperTensionFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Depression</label>
                <Select value={depressionFilter} onValueChange={setDepressionFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Hyperlipidemia</label>
                <Select value={hyperlipidFilter} onValueChange={setHyperlipidFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Diabetes</label>
                <Select value={diabetesFilter} onValueChange={setDiabetesFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tobacco Use</label>
                <Select value={tobaccoFilter} onValueChange={setTobaccoFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Obesity</label>
                <Select value={obesityFilter} onValueChange={setObesityFilter}>
                  <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Anxiety Disorders</label>
              <Select value={anxietyFilter} onValueChange={setAnxietyFilter}>
                <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Depressive Diso...</label>
              <Select value={depressiveFilter} onValueChange={setDepressiveFilter}>
                <SelectTrigger className="bg-secondary border-border h-7 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
