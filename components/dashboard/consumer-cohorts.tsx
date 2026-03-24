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
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { getFilterOptions, serviceAreas, getConsumerCohortData, consumerCohorts, type ConsumerCohort } from "@/lib/data/mlr-data"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { Checkbox } from "@/components/ui/checkbox"
import { mckinseyDataViz, mckinseyCore } from "@/lib/colors/mckinsey-palette"

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

const filterOptions = getFilterOptions()

// Cohort colors using McKinsey Data Viz palette
const cohortColors: Record<ConsumerCohort, string> = {
  "Patient-Member": mckinseyDataViz.darkTeal,
  "Member-only-with-claims": mckinseyDataViz.teal,
  "Member-only-without-claims": mckinseyDataViz.brightBlue,
}

type ViewMode = "percent" | "absolute"

export function ConsumerCohortsDashboard() {
  const {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    yearFilter,
    setYearFilter,
    centralFilters,
  } = useGlobalFilters()
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<Set<string>>(new Set(serviceAreas))
  const [viewMode, setViewMode] = useState<ViewMode>("percent")
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const [expandedLobs, setExpandedLobs] = useState<Set<string>>(new Set())

  // Toggle service area
  const toggleServiceArea = (area: string) => {
    const newSelected = new Set(selectedServiceAreas)
    if (newSelected.has(area)) {
      newSelected.delete(area)
    } else {
      newSelected.add(area)
    }
    setSelectedServiceAreas(newSelected)
  }

  // Toggle year expansion
  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  // Toggle LOB expansion
  const toggleLob = (key: string) => {
    const newExpanded = new Set(expandedLobs)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedLobs(newExpanded)
  }

  // Filter data from central source
  const filteredData = useMemo(() => {
    const data = getConsumerCohortData(centralFilters)
    if (selectedServiceAreas.size < serviceAreas.length) {
      return data.filter(row => selectedServiceAreas.has(row.serviceArea))
    }
    return data
  }, [centralFilters, selectedServiceAreas])

  // Calculate KPI summaries
  const kpiSummary = useMemo(() => {
    const byCohorт: Record<ConsumerCohort, { memberMonths: number; cost: number; revenue: number }> = {
      "Patient-Member": { memberMonths: 0, cost: 0, revenue: 0 },
      "Member-only-with-claims": { memberMonths: 0, cost: 0, revenue: 0 },
      "Member-only-without-claims": { memberMonths: 0, cost: 0, revenue: 0 },
    }

    for (const row of filteredData) {
      byCohorт[row.cohort].memberMonths += row.memberMonths
      byCohorт[row.cohort].cost += row.cost
      byCohorт[row.cohort].revenue += row.revenue
    }

    const totalMemberMonths = Object.values(byCohorт).reduce((sum, c) => sum + c.memberMonths, 0)

    return {
      patientMember: {
        memberMonths: byCohorт["Patient-Member"].memberMonths,
        percentOfTotal: totalMemberMonths > 0 ? (byCohorт["Patient-Member"].memberMonths / totalMemberMonths) * 100 : 0,
      },
      memberWithClaims: {
        memberMonths: byCohorт["Member-only-with-claims"].memberMonths,
        percentOfTotal: totalMemberMonths > 0 ? (byCohorт["Member-only-with-claims"].memberMonths / totalMemberMonths) * 100 : 0,
      },
      memberWithoutClaims: {
        memberMonths: byCohorт["Member-only-without-claims"].memberMonths,
        percentOfTotal: totalMemberMonths > 0 ? (byCohorт["Member-only-without-claims"].memberMonths / totalMemberMonths) * 100 : 0,
      },
    }
  }, [filteredData])

  // MLR Trend data for line chart
  const mlrTrendData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    
    return years.map(year => {
      const yearData = filteredData.filter(d => d.year === year)
      
      const byCohort: Record<ConsumerCohort, { cost: number; revenue: number }> = {
        "Patient-Member": { cost: 0, revenue: 0 },
        "Member-only-with-claims": { cost: 0, revenue: 0 },
        "Member-only-without-claims": { cost: 0, revenue: 0 },
      }

      for (const row of yearData) {
        byCohort[row.cohort].cost += row.cost
        byCohort[row.cohort].revenue += row.revenue
      }

      return {
        year: year.toString(),
        "Patient-Member": byCohort["Patient-Member"].revenue > 0 
          ? Math.round((byCohort["Patient-Member"].cost / byCohort["Patient-Member"].revenue) * 100) 
          : 0,
        "Member-only-with-claims": byCohort["Member-only-with-claims"].revenue > 0 
          ? Math.round((byCohort["Member-only-with-claims"].cost / byCohort["Member-only-with-claims"].revenue) * 100) 
          : 0,
        "Member-only-without-claims": byCohort["Member-only-without-claims"].revenue > 0 
          ? Math.round((byCohort["Member-only-without-claims"].cost / byCohort["Member-only-without-claims"].revenue) * 100) 
          : 0,
      }
    })
  }, [filteredData])

  // Risk score data for bar chart
  const riskScoreData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    
    return years.map(year => {
      const yearData = filteredData.filter(d => d.year === year)
      
      const byCohort: Record<ConsumerCohort, { totalRisk: number; count: number }> = {
        "Patient-Member": { totalRisk: 0, count: 0 },
        "Member-only-with-claims": { totalRisk: 0, count: 0 },
        "Member-only-without-claims": { totalRisk: 0, count: 0 },
      }

      for (const row of yearData) {
        byCohort[row.cohort].totalRisk += row.riskScore * row.memberMonths
        byCohort[row.cohort].count += row.memberMonths
      }

      return {
        year: year.toString(),
        "Patient-Member": byCohort["Patient-Member"].count > 0 
          ? Number((byCohort["Patient-Member"].totalRisk / byCohort["Patient-Member"].count).toFixed(1))
          : 0,
        "Member-only-with-claims": byCohort["Member-only-with-claims"].count > 0 
          ? Number((byCohort["Member-only-with-claims"].totalRisk / byCohort["Member-only-with-claims"].count).toFixed(1))
          : 0,
        "Member-only-without-claims": byCohort["Member-only-without-claims"].count > 0 
          ? Number((byCohort["Member-only-without-claims"].totalRisk / byCohort["Member-only-without-claims"].count).toFixed(1))
          : 0,
      }
    })
  }, [filteredData])

  // Helper to compute rolled-up cohort metrics from a set of rows
  const rollupCohortMetrics = (rows: typeof filteredData) => {
    const cohortMetrics: Record<ConsumerCohort, {
      mlr: number; memberMonths: number; cost: number; revenue: number
      pctMemberMonths: number; pctCost: number; pctRevenue: number
    }> = {
      "Patient-Member": { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, pctMemberMonths: 0, pctCost: 0, pctRevenue: 0 },
      "Member-only-with-claims": { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, pctMemberMonths: 0, pctCost: 0, pctRevenue: 0 },
      "Member-only-without-claims": { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, pctMemberMonths: 0, pctCost: 0, pctRevenue: 0 },
    }
    for (const row of rows) {
      const c = cohortMetrics[row.cohort]
      c.memberMonths += row.memberMonths
      c.cost += row.cost
      c.revenue += row.revenue
    }
    const rowTotals = {
      memberMonths: Object.values(cohortMetrics).reduce((s, c) => s + c.memberMonths, 0),
      cost: Object.values(cohortMetrics).reduce((s, c) => s + c.cost, 0),
      revenue: Object.values(cohortMetrics).reduce((s, c) => s + c.revenue, 0),
    }
    for (const cohort of Object.keys(cohortMetrics) as ConsumerCohort[]) {
      const m = cohortMetrics[cohort]
      m.mlr = m.revenue > 0 ? Math.round((m.cost / m.revenue) * 100) : 0
      m.pctMemberMonths = rowTotals.memberMonths > 0 ? (m.memberMonths / rowTotals.memberMonths) * 100 : 0
      m.pctCost = rowTotals.cost > 0 ? (m.cost / rowTotals.cost) * 100 : 0
      m.pctRevenue = rowTotals.revenue > 0 ? (m.revenue / rowTotals.revenue) * 100 : 0
    }
    return cohortMetrics
  }

  // Table data grouped by year/lob/sublob with rollups at each level
  const tableData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    
    return years.map(year => {
      const yearData = filteredData.filter(d => d.year === year)
      const lobs = [...new Set(yearData.map(d => d.lob))].sort()
      const yearRollup = rollupCohortMetrics(yearData)
      
      return {
        year,
        rollup: yearRollup,
        lobs: lobs.map(lob => {
          const lobData = yearData.filter(d => d.lob === lob)
          const sublobs = [...new Set(lobData.map(d => d.sublob))]
          const lobRollup = rollupCohortMetrics(lobData)
          
          return {
            lob,
            rollup: lobRollup,
            sublobs: sublobs.map(sublob => {
              const sublobData = lobData.filter(d => d.sublob === sublob)
              return { sublob, cohortMetrics: rollupCohortMetrics(sublobData) }
            })
          }
        })
      }
    })
  }, [filteredData])

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toFixed(0)
  }

  // Get MLR cell color using McKinsey palette
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

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Page Header */}
        <div className="py-2 px-4 rounded-lg" style={{ backgroundColor: mckinseyDataViz.teal }}>
          <h1 className="text-lg font-semibold text-center text-white">Consumer economics summary dashboard</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card overflow-hidden border-0 shadow-md rounded-lg">
            <CardHeader className="pb-2 text-white" style={{ backgroundColor: mckinseyDataViz.darkTeal }}>
              <CardTitle className="text-sm font-medium text-white">Patient-Member Member Months</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold text-foreground">
                {formatNumber(kpiSummary.patientMember.memberMonths)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                % of total member months: {kpiSummary.patientMember.percentOfTotal.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card overflow-hidden border-0 shadow-md rounded-lg">
            <CardHeader className="pb-2 text-white" style={{ backgroundColor: mckinseyDataViz.teal }}>
              <CardTitle className="text-sm font-medium text-white">Member only with claims member months</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold text-foreground">
                {formatNumber(kpiSummary.memberWithClaims.memberMonths)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                % of total member months: {kpiSummary.memberWithClaims.percentOfTotal.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card overflow-hidden border-0 shadow-md rounded-lg">
            <CardHeader className="pb-2 text-white" style={{ backgroundColor: mckinseyDataViz.brightBlue }}>
              <CardTitle className="text-sm font-medium text-white">Member without claims member months</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold text-foreground">
                {formatNumber(kpiSummary.memberWithoutClaims.memberMonths)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                % of total member months: {kpiSummary.memberWithoutClaims.percentOfTotal.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* MLR Trend Chart */}
          <Card className="border-2" style={{ borderColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">MLR Trend</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Consumer cohort</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5" style={{ backgroundColor: cohortColors["Patient-Member"] }} />
                  <span>Patient-Member</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5" style={{ backgroundColor: cohortColors["Member-only-with-claims"] }} />
                  <span>Member-only-with-clai...</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5" style={{ backgroundColor: cohortColors["Member-only-without-claims"] }} />
                  <span>Member-only-...</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mlrTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: "MLR %", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                  <Line type="monotone" dataKey="Patient-Member" stroke={cohortColors["Patient-Member"]} strokeWidth={2} dot={{ fill: cohortColors["Patient-Member"] }} />
                  <Line type="monotone" dataKey="Member-only-with-claims" stroke={cohortColors["Member-only-with-claims"]} strokeWidth={2} dot={{ fill: cohortColors["Member-only-with-claims"] }} />
                  <Line type="monotone" dataKey="Member-only-without-claims" stroke={cohortColors["Member-only-without-claims"]} strokeWidth={2} dot={{ fill: cohortColors["Member-only-without-claims"] }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Scores Chart */}
          <Card className="border-2" style={{ borderColor: mckinseyDataViz.teal }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Risk scores</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Consumer cohort</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cohortColors["Patient-Member"] }} />
                  <span>Patient-Member</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cohortColors["Member-only-with-claims"] }} />
                  <span>Member-only-with-claims</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cohortColors["Member-only-without-claims"] }} />
                  <span>Member-only-withou...</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} label={{ value: "YEAR", position: "bottom", fill: "hsl(var(--muted-foreground))", fontSize: 11, offset: -5 }} />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    label={{ value: "Avg. ACG Risk Score", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="Patient-Member" fill={cohortColors["Patient-Member"]} />
                  <Bar dataKey="Member-only-with-claims" fill={cohortColors["Member-only-with-claims"]} />
                  <Bar dataKey="Member-only-without-claims" fill={cohortColors["Member-only-without-claims"]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                MLR and member months by consumer cohorts ({viewMode === "percent" ? "% view" : "absolute"})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "percent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("percent")}
                  className={viewMode === "percent" ? "bg-slate-700 text-white" : ""}
                >
                  Percent View
                </Button>
                <Button
                  variant={viewMode === "absolute" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("absolute")}
                  className={viewMode === "absolute" ? "bg-slate-700 text-white" : ""}
                >
                  Absolute Numbers
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium" rowSpan={2}>Consumer cohort<br/>YEAR (date of service)</th>
                    <th className="text-center p-2 font-medium border-l border-border" colSpan={4}>Patient-Member</th>
                    <th className="text-center p-2 font-medium border-l border-border" colSpan={4}>Member-only-with-claims</th>
                    <th className="text-center p-2 font-medium border-l border-border" colSpan={4}>Member-only-without-claims</th>
                  </tr>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-center p-2 text-xs border-l border-border">MLR</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Member Months" : "Member Months"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Cost" : "Total Cost"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Revenue" : "Total Revenue"}</th>
                    <th className="text-center p-2 text-xs border-l border-border">MLR</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Member Months" : "Member Months"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Cost" : "Total Cost"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Revenue" : "Total Revenue"}</th>
                    <th className="text-center p-2 text-xs border-l border-border">MLR</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Member Months" : "Member Months"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Cost" : "Total Cost"}</th>
                    <th className="text-center p-2 text-xs">{viewMode === "percent" ? "% of Total Revenue" : "Total Revenue"}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(yearGroup => (
                    <>
                      <tr 
                        key={yearGroup.year} 
                        className="bg-muted/30 cursor-pointer hover:bg-muted/50 font-semibold"
                        onClick={() => toggleYear(yearGroup.year)}
                      >
                        <td className="p-2 font-medium flex items-center gap-1">
                          {expandedYears.has(yearGroup.year) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {yearGroup.year}
                        </td>
                        {(["Patient-Member", "Member-only-with-claims", "Member-only-without-claims"] as ConsumerCohort[]).map(cohort => (
                          <>
                            <td key={`yr-${yearGroup.year}-${cohort}-mlr`} className="text-center p-2 border-l border-border" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup[cohort].mlr), color: getMlrTextColor(yearGroup.rollup[cohort].mlr) }}>
                              {yearGroup.rollup[cohort].mlr}%
                            </td>
                            <td key={`yr-${yearGroup.year}-${cohort}-mm`} className="text-center p-2">
                              {viewMode === "percent" ? `${yearGroup.rollup[cohort].pctMemberMonths.toFixed(2)}%` : formatNumber(yearGroup.rollup[cohort].memberMonths)}
                            </td>
                            <td key={`yr-${yearGroup.year}-${cohort}-cost`} className="text-center p-2">
                              {viewMode === "percent" ? `${yearGroup.rollup[cohort].pctCost.toFixed(2)}%` : `$${formatNumber(yearGroup.rollup[cohort].cost)}`}
                            </td>
                            <td key={`yr-${yearGroup.year}-${cohort}-rev`} className="text-center p-2">
                              {viewMode === "percent" ? `${yearGroup.rollup[cohort].pctRevenue.toFixed(2)}%` : `$${formatNumber(yearGroup.rollup[cohort].revenue)}`}
                            </td>
                          </>
                        ))}
                      </tr>
                      {expandedYears.has(yearGroup.year) && yearGroup.lobs.map(lobGroup => (
                        <>
                          <tr 
                            key={`${yearGroup.year}-${lobGroup.lob}`}
                            className="bg-muted/20 cursor-pointer hover:bg-muted/40"
                            onClick={() => toggleLob(`${yearGroup.year}-${lobGroup.lob}`)}
                          >
                            <td className="p-2 pl-6 font-medium flex items-center gap-1">
                              {expandedLobs.has(`${yearGroup.year}-${lobGroup.lob}`) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              {lobGroup.lob}
                            </td>
                            {(["Patient-Member", "Member-only-with-claims", "Member-only-without-claims"] as ConsumerCohort[]).map(cohort => (
                              <>
                                <td key={`lob-${yearGroup.year}-${lobGroup.lob}-${cohort}-mlr`} className="text-center p-2 border-l border-border" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup[cohort].mlr), color: getMlrTextColor(lobGroup.rollup[cohort].mlr) }}>
                                  {lobGroup.rollup[cohort].mlr}%
                                </td>
                                <td key={`lob-${yearGroup.year}-${lobGroup.lob}-${cohort}-mm`} className="text-center p-2">
                                  {viewMode === "percent" ? `${lobGroup.rollup[cohort].pctMemberMonths.toFixed(2)}%` : formatNumber(lobGroup.rollup[cohort].memberMonths)}
                                </td>
                                <td key={`lob-${yearGroup.year}-${lobGroup.lob}-${cohort}-cost`} className="text-center p-2">
                                  {viewMode === "percent" ? `${lobGroup.rollup[cohort].pctCost.toFixed(2)}%` : `$${formatNumber(lobGroup.rollup[cohort].cost)}`}
                                </td>
                                <td key={`lob-${yearGroup.year}-${lobGroup.lob}-${cohort}-rev`} className="text-center p-2">
                                  {viewMode === "percent" ? `${lobGroup.rollup[cohort].pctRevenue.toFixed(2)}%` : `$${formatNumber(lobGroup.rollup[cohort].revenue)}`}
                                </td>
                              </>
                            ))}
                          </tr>
                          {expandedLobs.has(`${yearGroup.year}-${lobGroup.lob}`) && lobGroup.sublobs.map(sublobRow => (
                            <tr key={`${yearGroup.year}-${lobGroup.lob}-${sublobRow.sublob}`} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-2 pl-12">{sublobRow.sublob}</td>
                              {/* Patient-Member columns */}
                              <td className="text-center p-2 border-l border-border" style={{ backgroundColor: getMlrBgColor(sublobRow.cohortMetrics["Patient-Member"].mlr), color: getMlrTextColor(sublobRow.cohortMetrics["Patient-Member"].mlr) }}>
                                {sublobRow.cohortMetrics["Patient-Member"].mlr}%
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Patient-Member"].pctMemberMonths.toFixed(2)}%`
                                  : formatNumber(sublobRow.cohortMetrics["Patient-Member"].memberMonths)
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Patient-Member"].pctCost.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Patient-Member"].cost)}`
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Patient-Member"].pctRevenue.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Patient-Member"].revenue)}`
                                }
                              </td>
                              {/* Member-only-with-claims columns */}
                              <td className="text-center p-2 border-l border-border" style={{ backgroundColor: getMlrBgColor(sublobRow.cohortMetrics["Member-only-with-claims"].mlr), color: getMlrTextColor(sublobRow.cohortMetrics["Member-only-with-claims"].mlr) }}>
                                {sublobRow.cohortMetrics["Member-only-with-claims"].mlr}%
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-with-claims"].pctMemberMonths.toFixed(2)}%`
                                  : formatNumber(sublobRow.cohortMetrics["Member-only-with-claims"].memberMonths)
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-with-claims"].pctCost.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Member-only-with-claims"].cost)}`
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-with-claims"].pctRevenue.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Member-only-with-claims"].revenue)}`
                                }
                              </td>
                              {/* Member-only-without-claims columns */}
                              <td className="text-center p-2 border-l border-border" style={{ backgroundColor: getMlrBgColor(sublobRow.cohortMetrics["Member-only-without-claims"].mlr), color: getMlrTextColor(sublobRow.cohortMetrics["Member-only-without-claims"].mlr) }}>
                                {sublobRow.cohortMetrics["Member-only-without-claims"].mlr}%
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-without-claims"].pctMemberMonths.toFixed(2)}%`
                                  : formatNumber(sublobRow.cohortMetrics["Member-only-without-claims"].memberMonths)
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-without-claims"].pctCost.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Member-only-without-claims"].cost)}`
                                }
                              </td>
                              <td className="text-center p-2">
                                {viewMode === "percent" 
                                  ? `${sublobRow.cohortMetrics["Member-only-without-claims"].pctRevenue.toFixed(2)}%`
                                  : `$${formatNumber(sublobRow.cohortMetrics["Member-only-without-claims"].revenue)}`
                                }
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-72 space-y-4">
        {/* Global Filters */}
        <Card className="bg-card border-border border-l-4 border-l-blue-500">
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
              <div className="border border-border rounded-md p-2 bg-secondary max-h-48 overflow-y-auto">
                {serviceAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 py-1">
                    <Checkbox
                      id={`cohort-service-area-${area}`}
                      checked={selectedServiceAreas.has(area)}
                      onCheckedChange={() => toggleServiceArea(area)}
                      className="border-border"
                    />
                    <label 
                      htmlFor={`cohort-service-area-${area}`}
                      className="text-sm text-foreground cursor-pointer"
                    >
                      {area}
                    </label>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedServiceAreas.size} of {serviceAreas.length} selected
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
