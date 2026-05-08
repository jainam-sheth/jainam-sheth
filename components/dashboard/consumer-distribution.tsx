'use client'

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { mckinseyDataViz } from "@/lib/colors/mckinsey-palette"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart, LabelList } from "recharts"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { getFilterOptions } from "@/lib/data/mlr-data"

const filterOptions = getFilterOptions()

// Chart colors - McKinsey palette only
const COLORS = {
  healthPlanBar: mckinseyDataViz.brightBlue,
  healthPlanLine: mckinseyDataViz.teal,
  careDeliveryBar: mckinseyDataViz.midTeal,
  careDeliveryLine: mckinseyDataViz.darkTeal,
  headerBg: mckinseyDataViz.teal,
}

// Format helpers
const formatK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K` : n.toLocaleString()
const formatPct = (n: number) => `${n.toFixed(0)}%`

// Seeded random for consistent data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate consumer distribution data
function generateConsumerDistributionData(year: number) {
  const seed = year * 1000

  const lobs = ["Commercial", "Medicaid", "Medicare"]

  // Health Plan data by LOB
  const healthPlanData = lobs.map((lob, i) => {
    const rng = () => seededRandom(seed + i * 100 + 1)
    const baseMembers = lob === "Medicaid" ? 111000 : lob === "Commercial" ? 62000 : 30000
    const avgMonthlyMembers = Math.round(baseMembers * (0.95 + rng() * 0.1))
    const membersWithClaims = Math.round(avgMonthlyMembers * (0.55 + rng() * 0.15))
    const membersWithoutClaims = avgMonthlyMembers - membersWithClaims + Math.round(rng() * 30000)

    return {
      lob,
      avgMonthlyMembers,
      pctTotalMembers: 0, // calculated after
      membersWithClaims,
      pctMembersWithClaims: 0,
      membersWithoutClaims,
      pctMembersWithoutClaims: 0,
    }
  })

  // Calculate totals and percentages for Health Plan
  const totalAvgMembers = healthPlanData.reduce((s, r) => s + r.avgMonthlyMembers, 0)
  const totalWithClaims = healthPlanData.reduce((s, r) => s + r.membersWithClaims, 0)
  const totalWithoutClaims = healthPlanData.reduce((s, r) => s + r.membersWithoutClaims, 0)

  healthPlanData.forEach(row => {
    row.pctTotalMembers = totalAvgMembers > 0 ? (row.avgMonthlyMembers / totalAvgMembers) * 100 : 0
    row.pctMembersWithClaims = totalWithClaims > 0 ? (row.membersWithClaims / totalWithClaims) * 100 : 0
    row.pctMembersWithoutClaims = totalWithoutClaims > 0 ? (row.membersWithoutClaims / totalWithoutClaims) * 100 : 0
  })

  // Care Delivery data by LOB
  const careDeliveryData = lobs.map((lob, i) => {
    const rng = () => seededRandom(seed + i * 200 + 50)
    const basePatients = lob === "Commercial" ? 42000 : lob === "Medicaid" ? 79000 : 20000
    const distinctPatients = Math.round(basePatients * (0.95 + rng() * 0.1))
    const patientsOnly = Math.round(distinctPatients * (8 + rng() * 4))

    return {
      lob,
      distinctPatients,
      pctTotalPatients: 0,
      patientsOnly,
      pctPatientsOnly: 0,
    }
  })

  // Calculate totals for Care Delivery
  const totalDistinctPatients = careDeliveryData.reduce((s, r) => s + r.distinctPatients, 0)
  const totalPatientsOnly = careDeliveryData.reduce((s, r) => s + r.patientsOnly, 0)

  careDeliveryData.forEach(row => {
    row.pctTotalPatients = totalDistinctPatients > 0 ? (row.distinctPatients / totalDistinctPatients) * 100 : 0
    row.pctPatientsOnly = totalPatientsOnly > 0 ? (row.patientsOnly / totalPatientsOnly) * 100 : 0
  })

  // Other row (Care Delivery only)
  const otherPatientsOnly = Math.round(192000 * (0.95 + seededRandom(seed + 999) * 0.1))

  return {
    healthPlan: healthPlanData,
    healthPlanTotals: {
      avgMonthlyMembers: totalAvgMembers,
      pctTotalMembers: 25,
      membersWithClaims: totalWithClaims,
      pctMembersWithClaims: 59,
      membersWithoutClaims: totalWithoutClaims,
      pctMembersWithoutClaims: 16,
    },
    careDelivery: careDeliveryData,
    careDeliveryTotals: {
      distinctPatients: totalDistinctPatients,
      pctTotalPatients: 12,
      patientsOnly: totalPatientsOnly,
      pctPatientsOnly: 90,
    },
    otherPatientsOnly,
  }
}

// Generate quarterly trend data
function generateQuarterlyData() {
  const data: { quarter: string; year: number; q: number; healthPlanMembers: number; healthPlanPct: number; careDeliveryPatients: number; careDeliveryPct: number }[] = []

  const years = [2023, 2024, 2025]
  years.forEach((year, yi) => {
    for (let q = 1; q <= 4; q++) {
      const seed = year * 100 + q
      const rng = () => seededRandom(seed)

      const baseMembers = 200000 + yi * 5000
      const healthPlanMembers = Math.round(baseMembers * (0.98 + rng() * 0.04))
      const healthPlanPct = 23 + yi * 1.5 + rng() * 1.5

      const basePatients = 65000 + yi * 5000
      const careDeliveryPatients = Math.round(basePatients * (0.95 + rng() * 0.1))
      const careDeliveryPct = 12 + rng() * 1.5

      data.push({
        quarter: `${q}`,
        year,
        q,
        healthPlanMembers,
        healthPlanPct: Math.round(healthPlanPct * 10) / 10,
        careDeliveryPatients,
        careDeliveryPct: Math.round(careDeliveryPct * 10) / 10,
      })
    }
  })

  return data
}

export function ConsumerDistribution() {
  const {
    yearFilter, setYearFilter,
    availableLobs, availableSublobs,
    lobFilter, sublobFilter, handleLobChange, handleSublobChange,
    availableServiceAreas, availableConsumerMarkets, availableConsumerRegions,
    selectedServiceAreas, setSelectedServiceAreas,
    selectedConsumerMarkets, setSelectedConsumerMarkets,
    selectedConsumerRegions, setSelectedConsumerRegions,
  } = useGlobalFilters()

  const selectedYear = yearFilter === "all" ? "2024" : yearFilter

  const distributionData = useMemo(() => generateConsumerDistributionData(parseInt(selectedYear)), [selectedYear])
  const quarterlyData = useMemo(() => generateQuarterlyData(), [])

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 ml-64">
        <DashboardHeader title="Consumer Distribution" />

        <div className="flex">
          {/* Main content */}
          <main className="flex-1 p-6">
            {/* Consumer Distribution Table */}
            <Card className="border-border mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground italic">Consumer Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      {/* Header Row 1: Health Plan / Care Delivery */}
                      <tr>
                        <th className="px-3 py-2 text-left font-normal text-muted-foreground border-b border-border" />
                        <th colSpan={6} className="px-3 py-2 text-center font-bold text-white border-b border-l border-border" style={{ backgroundColor: COLORS.headerBg }}>
                          Health Plan
                        </th>
                        <th colSpan={4} className="px-3 py-2 text-center font-bold text-white border-b border-l border-border" style={{ backgroundColor: COLORS.headerBg }}>
                          Care Delivery
                        </th>
                      </tr>
                      {/* Header Row 2: Sub-categories */}
                      <tr className="bg-muted/30">
                        <th className="px-3 py-2 text-left font-normal text-muted-foreground border-b border-border" />
                        <th colSpan={2} className="px-3 py-1 text-center text-xs font-medium text-foreground border-b border-l border-border">
                          Patient members
                        </th>
                        <th colSpan={2} className="px-3 py-1 text-center text-xs font-medium text-foreground border-b border-l border-border">
                          Members only<br /><span className="text-muted-foreground">with claims</span>
                        </th>
                        <th colSpan={2} className="px-3 py-1 text-center text-xs font-medium text-foreground border-b border-l border-border">
                          Members only<br /><span className="text-muted-foreground">without claims</span>
                        </th>
                        <th colSpan={2} className="px-3 py-1 text-center text-xs font-medium text-foreground border-b border-l border-border">
                          Patient members
                        </th>
                        <th colSpan={2} className="px-3 py-1 text-center text-xs font-medium text-foreground border-b border-l border-border">
                          Patients only
                        </th>
                      </tr>
                      {/* Header Row 3: Column names */}
                      <tr className="bg-muted/20">
                        <th className="px-3 py-2 text-left text-xs font-medium text-foreground border-b border-border">Line of business</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-l border-border">Average<br />monthly<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-border">Percent of<br />total<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-l border-border">Average<br />monthly<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-border">Percent of<br />total<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-l border-border">Average<br />monthly<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-border">Percent of<br />total<br />members</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-l border-border">Distinct<br />patients<br />per year</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-border">Percent<br />of total<br />patients</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-l border-border">Distinct<br />patients<br />per year</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-foreground border-b border-border">Percent of<br />total patients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distributionData.healthPlan.map((hp, idx) => {
                        const cd = distributionData.careDelivery[idx]
                        return (
                          <tr key={hp.lob} className="border-b border-border hover:bg-muted/20">
                            <td className="px-3 py-2 text-foreground font-medium">{hp.lob}</td>
                            <td className="px-3 py-2 text-right text-foreground border-l border-border">{hp.avgMonthlyMembers.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-foreground">{formatPct(hp.pctTotalMembers)}</td>
                            <td className="px-3 py-2 text-right text-foreground border-l border-border">{hp.membersWithClaims.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-foreground">{formatPct(hp.pctMembersWithClaims)}</td>
                            <td className="px-3 py-2 text-right text-foreground border-l border-border">{hp.membersWithoutClaims.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-foreground">{formatPct(hp.pctMembersWithoutClaims)}</td>
                            <td className="px-3 py-2 text-right text-foreground border-l border-border">{cd.distinctPatients.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-foreground">{formatPct(cd.pctTotalPatients)}</td>
                            <td className="px-3 py-2 text-right text-foreground border-l border-border">{cd.patientsOnly.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-foreground">{formatPct(cd.pctPatientsOnly)}</td>
                          </tr>
                        )
                      })}
                      {/* Other row */}
                      <tr className="border-b border-border hover:bg-muted/20">
                        <td className="px-3 py-2 text-foreground font-medium">Other</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border" />
                        <td className="px-3 py-2 text-right text-foreground" />
                        <td className="px-3 py-2 text-right text-foreground border-l border-border" />
                        <td className="px-3 py-2 text-right text-foreground" />
                        <td className="px-3 py-2 text-right text-foreground border-l border-border" />
                        <td className="px-3 py-2 text-right text-foreground" />
                        <td className="px-3 py-2 text-right text-foreground border-l border-border" />
                        <td className="px-3 py-2 text-right text-foreground" />
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.otherPatientsOnly.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">100%</td>
                      </tr>
                      {/* Total row */}
                      <tr className="bg-muted/30 font-semibold">
                        <td className="px-3 py-2 text-foreground">Total</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.healthPlanTotals.avgMonthlyMembers.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">{distributionData.healthPlanTotals.pctTotalMembers}%</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.healthPlanTotals.membersWithClaims.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">{distributionData.healthPlanTotals.pctMembersWithClaims}%</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.healthPlanTotals.membersWithoutClaims.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">{distributionData.healthPlanTotals.pctMembersWithoutClaims}%</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.careDeliveryTotals.distinctPatients.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">{distributionData.careDeliveryTotals.pctTotalPatients}%</td>
                        <td className="px-3 py-2 text-right text-foreground border-l border-border">{distributionData.careDeliveryTotals.patientsOnly.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-foreground">{distributionData.careDeliveryTotals.pctPatientsOnly}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Patient-member Counts by Quarter */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground italic underline">Patient-member Counts by Quarter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Health Plan Chart */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Health Plan</h4>
                  <div className="flex items-center gap-4 mb-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.healthPlanBar }} />
                      <span className="text-foreground">Average monthly members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.healthPlanLine }} />
                      <span className="text-foreground">Percent of total members</span>
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={quarterlyData} margin={{ top: 25, right: 40, bottom: 25, left: 10 }}>
                        <XAxis
                          dataKey="quarter"
                          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                          axisLine={{ stroke: "var(--border)" }}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          tickFormatter={(v) => formatK(v)}
                          axisLine={false}
                          tickLine={false}
                          width={50}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          tickFormatter={(v) => `${v}%`}
                          domain={[20, 30]}
                          axisLine={false}
                          tickLine={false}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                          formatter={(value: number, name: string) => {
                            if (name === "healthPlanMembers") return [value.toLocaleString(), "Avg Monthly Members"]
                            return [`${value}%`, "% of Total"]
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `Q${label} ${payload[0].payload.year}`
                            }
                            return `Q${label}`
                          }}
                        />
                        <Bar yAxisId="left" dataKey="healthPlanMembers" fill={COLORS.healthPlanBar} barSize={32} radius={[2, 2, 0, 0]}>
                          <LabelList dataKey="healthPlanMembers" position="top" formatter={formatK} style={{ fontSize: 9, fill: "var(--foreground)" }} />
                        </Bar>
                        <Line yAxisId="right" type="monotone" dataKey="healthPlanPct" stroke={COLORS.healthPlanLine} strokeWidth={2} dot={{ fill: COLORS.healthPlanLine, r: 4 }}>
                          <LabelList dataKey="healthPlanPct" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 8, fill: "var(--foreground)" }} offset={10} />
                        </Line>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Year labels */}
                  <div className="flex justify-around text-xs text-muted-foreground mt-1 px-12">
                    <span>2023</span>
                    <span>2024</span>
                    <span>2025</span>
                  </div>
                </div>

                {/* Care Delivery Chart */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Care Delivery</h4>
                  <div className="flex items-center gap-4 mb-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.careDeliveryBar }} />
                      <span className="text-foreground">Distinct patients per quarter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.careDeliveryLine }} />
                      <span className="text-foreground">Percent of total patients</span>
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={quarterlyData} margin={{ top: 25, right: 40, bottom: 25, left: 10 }}>
                        <XAxis
                          dataKey="quarter"
                          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                          axisLine={{ stroke: "var(--border)" }}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          tickFormatter={(v) => formatK(v)}
                          axisLine={false}
                          tickLine={false}
                          width={50}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          tickFormatter={(v) => `${v}%`}
                          domain={[10, 15]}
                          axisLine={false}
                          tickLine={false}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                          formatter={(value: number, name: string) => {
                            if (name === "careDeliveryPatients") return [value.toLocaleString(), "Distinct Patients"]
                            return [`${value}%`, "% of Total"]
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `Q${label} ${payload[0].payload.year}`
                            }
                            return `Q${label}`
                          }}
                        />
                        <Bar yAxisId="left" dataKey="careDeliveryPatients" fill={COLORS.careDeliveryBar} barSize={32} radius={[2, 2, 0, 0]}>
                          <LabelList dataKey="careDeliveryPatients" position="top" formatter={formatK} style={{ fontSize: 9, fill: "var(--foreground)" }} />
                        </Bar>
                        <Line yAxisId="right" type="monotone" dataKey="careDeliveryPct" stroke={COLORS.careDeliveryLine} strokeWidth={2} dot={{ fill: COLORS.careDeliveryLine, r: 4 }}>
                          <LabelList dataKey="careDeliveryPct" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 8, fill: "var(--foreground)" }} offset={10} />
                        </Line>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Year labels */}
                  <div className="flex justify-around text-xs text-muted-foreground mt-1 px-12">
                    <span>2023</span>
                    <span>2024</span>
                    <span>2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Filter sidebar */}
          <aside className="w-72 shrink-0 space-y-4 overflow-y-auto p-4">
            {/* Global Filters */}
            <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.coral }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold" style={{ color: mckinseyDataViz.coral }}>Global Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Year</label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filterOptions.years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <MultiSelectFilter label="Service area" options={availableServiceAreas} selected={selectedServiceAreas} onChange={setSelectedServiceAreas} placeholder="All" compact />
                <MultiSelectFilter label="Consumer-driven market" options={availableConsumerMarkets} selected={selectedConsumerMarkets} onChange={setSelectedConsumerMarkets} placeholder="All" compact />
                <MultiSelectFilter label="Consumer-driven region" options={availableConsumerRegions} selected={selectedConsumerRegions} onChange={setSelectedConsumerRegions} placeholder="All" compact />
              </CardContent>
            </Card>

            {/* Local Filters */}
            <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.teal }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold" style={{ color: mckinseyDataViz.teal }}>Local Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">LOB</label>
                  <Select value={lobFilter} onValueChange={(v) => { handleLobChange(v); handleSublobChange("all") }}>
                    <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {availableLobs.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sub LOB</label>
                  <Select value={sublobFilter} onValueChange={handleSublobChange}>
                    <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {availableSublobs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
