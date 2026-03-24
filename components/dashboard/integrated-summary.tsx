"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Users, DollarSign, Activity, Heart } from "lucide-react"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { mckinseyDataViz } from "@/lib/colors/mckinsey-palette"
import {
  getFilterOptions, getIntegratedSummaryData, getPatientMembersByLob,
  type CentralDataFilters,
} from "@/lib/data/mlr-data"
import {
  Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
  PieChart, Pie, ReferenceLine, LabelList,
} from "recharts"

const filterOptions = getFilterOptions()

type ConsumerCategory = "Members only with claims" | "Members only without claims" | "Patient members" | "Patients only"
const consumerCategories: ConsumerCategory[] = [
  "Members only with claims", "Members only without claims", "Patient members", "Patients only",
]
const attributionStatusOptions = ["All", "Attributed", "Non-Attributed"]
const chronicConditions = [
  { key: "hyperTension", label: "Hypertension" },
  { key: "depression", label: "Depression" },
  { key: "hyperlipidemia", label: "Hyperlipidemia" },
  { key: "diabetes", label: "Diabetes" },
  { key: "tobaccoUse", label: "Tobacco use" },
  { key: "obesity", label: "Obesity" },
  { key: "anxietyDisorders", label: "Anxiety disorders" },
  { key: "depressiveDisorder", label: "Depressive disorde..." },
]

interface CategoryMetrics {
  memberMonths: number; revenuePMPY: number; costPMPY: number; totalMarginPMPY: number
  totalMarginPMPYPct: number; distinctPatients: number; netRevenuePerPatient: number
  totalCostPerPatient: number; totalMarginPerPatient: number; totalMarginPerPatientPct: number
  integratedTotalMarginPerConsumer: number
}

const formatNumber = (n: number) => Math.abs(n) >= 1 ? Math.round(n).toLocaleString() : n.toFixed(1)
const formatCurrency = (n: number) => n < 0 ? `($${formatNumber(Math.abs(n))})` : `$${formatNumber(n)}`
const formatPct = (n: number) => `${n.toFixed(1)}%`
const formatCompact = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return Math.round(n).toLocaleString()
}

const LOB_COLORS: Record<string, string> = {
  COMMERCIAL: mckinseyDataViz.teal,
  MEDICAID: mckinseyDataViz.darkTeal,
  MEDICARE: mckinseyDataViz.brightBlue,
  Other: mckinseyDataViz.midTeal,
}

export function IntegratedSummaryDashboard() {
  const [attributionFilter, setAttributionFilter] = useState("All")
  const {
    yearFilter, setYearFilter,
    selectedConsumerMarkets, setSelectedConsumerMarkets,
    selectedConsumerRegions, setSelectedConsumerRegions,
    selectedServiceAreas, setSelectedServiceAreas,
    availableConsumerMarkets, availableConsumerRegions, availableServiceAreas,
    centralFilters,
    hyperTensionFilter, setHyperTensionFilter,
    depressionFilter, setDepressionFilter,
    hyperlipidFilter, setHyperlipidFilter,
    diabetesFilter, setDiabetesFilter,
    tobaccoFilter, setTobaccoFilter,
    obesityFilter, setObesityFilter,
    anxietyFilter, setAnxietyFilter,
    depressiveFilter, setDepressiveFilter,
  } = useGlobalFilters()

  const [expandedLobs, setExpandedLobs] = useState<Set<string>>(new Set())
  const toggleLob = useCallback((lob: string) => {
    setExpandedLobs(prev => { const n = new Set(prev); n.has(lob) ? n.delete(lob) : n.add(lob); return n })
  }, [])

  const dataFilters = useMemo((): CentralDataFilters => {
    const f: CentralDataFilters = {}
    if (yearFilter !== "all") f.years = [Number(yearFilter)]
    if (centralFilters.geo) f.geo = centralFilters.geo
    if (centralFilters.chronicConditions) f.chronicConditions = centralFilters.chronicConditions
    if (attributionFilter === "Attributed") f.providerAttributions = ["Provider Group 2", "Provider Group 1"]
    else if (attributionFilter === "Non-Attributed") f.providerAttributions = ["Non-Provider Group 2", "Non-Provider Group 1"]
    return f
  }, [yearFilter, centralFilters, attributionFilter])

  const rawRows = useMemo(() => getIntegratedSummaryData(dataFilters), [dataFilters])
  const lobData = useMemo(() => getPatientMembersByLob(dataFilters), [dataFilters])

  // Compute metrics per category
  const computeMetrics = useCallback((rows: typeof rawRows): Record<ConsumerCategory, CategoryMetrics> => {
    const result: Record<string, CategoryMetrics> = {}
    for (const cat of consumerCategories) {
      result[cat] = {
        memberMonths: 0, revenuePMPY: 0, costPMPY: 0, totalMarginPMPY: 0, totalMarginPMPYPct: 0,
        distinctPatients: 0, netRevenuePerPatient: 0, totalCostPerPatient: 0, totalMarginPerPatient: 0,
        totalMarginPerPatientPct: 0, integratedTotalMarginPerConsumer: 0,
      }
    }
    const totals: Record<string, { mm: number; rev: number; cost: number; patients: number; careRev: number; careCost: number }> = {}
    for (const cat of consumerCategories) totals[cat] = { mm: 0, rev: 0, cost: 0, patients: 0, careRev: 0, careCost: 0 }
    for (const row of rows) {
      const t = totals[row.category]; if (!t) continue
      t.mm += row.memberMonths; t.rev += row.revenue; t.cost += row.cost
      t.patients += row.distinctPatients; t.careRev += row.careRevenue; t.careCost += row.careCost
    }
    for (const cat of consumerCategories) {
      const t = totals[cat]; const memberYears = t.mm / 12; const m = result[cat]
      m.memberMonths = t.mm
      m.revenuePMPY = memberYears > 0 ? t.rev / memberYears : 0
      m.costPMPY = memberYears > 0 ? t.cost / memberYears : 0
      m.totalMarginPMPY = m.revenuePMPY - m.costPMPY
      m.totalMarginPMPYPct = m.revenuePMPY > 0 ? (m.totalMarginPMPY / m.revenuePMPY) * 100 : 0
      m.distinctPatients = t.patients
      m.netRevenuePerPatient = t.patients > 0 ? Math.round(t.careRev / t.patients) : 0
      m.totalCostPerPatient = t.patients > 0 ? Math.round(t.careCost / t.patients) : 0
      m.totalMarginPerPatient = m.netRevenuePerPatient - m.totalCostPerPatient
      m.totalMarginPerPatientPct = m.netRevenuePerPatient > 0 ? ((m.netRevenuePerPatient - m.totalCostPerPatient) / m.netRevenuePerPatient) * 100 : 0
      const careMarginPerMY = memberYears > 0 ? (t.careRev - t.careCost) / memberYears : 0
      m.integratedTotalMarginPerConsumer = Math.round(m.totalMarginPMPY + careMarginPerMY)
    }
    return result as Record<ConsumerCategory, CategoryMetrics>
  }, [])

  const tableData = useMemo(() => {
    const lobs = [...new Set(rawRows.map(r => r.lob))].sort()
    const lobGroups = lobs.map(lob => {
      const lobRows = rawRows.filter(r => r.lob === lob)
      const sublobs = [...new Set(lobRows.map(r => r.sublob))].sort()
      return { lob, metrics: computeMetrics(lobRows), sublobs: sublobs.map(sublob => ({ sublob, metrics: computeMetrics(lobRows.filter(r => r.sublob === sublob)) })) }
    })
    const allMM = rawRows.reduce((s, r) => s + r.memberMonths, 0)
    const otherPatients = Math.round(allMM * 0.015)
    if (otherPatients > 0) {
      const otherMetrics: Record<ConsumerCategory, CategoryMetrics> = {} as any
      for (const cat of consumerCategories) otherMetrics[cat] = { memberMonths: 0, revenuePMPY: 0, costPMPY: 0, totalMarginPMPY: 0, totalMarginPMPYPct: 0, distinctPatients: 0, netRevenuePerPatient: 0, totalCostPerPatient: 0, totalMarginPerPatient: 0, totalMarginPerPatientPct: 0, integratedTotalMarginPerConsumer: 0 }
      otherMetrics["Patients only"] = { memberMonths: 0, revenuePMPY: 0, costPMPY: 0, totalMarginPMPY: 0, totalMarginPMPYPct: 0, distinctPatients: otherPatients, netRevenuePerPatient: 1136, totalCostPerPatient: 1661, totalMarginPerPatient: -525, totalMarginPerPatientPct: -46.2, integratedTotalMarginPerConsumer: -525 }
      lobGroups.push({ lob: "Other", metrics: otherMetrics, sublobs: [{ sublob: "Patients only", metrics: otherMetrics }] })
    }
    return { lobData: lobGroups, totalMetrics: computeMetrics(rawRows) }
  }, [rawRows, computeMetrics])

  const rollupCategories = (metrics: Record<ConsumerCategory, CategoryMetrics>) => {
    let totalMM = 0, totalRev = 0, totalCost = 0, totalPatients = 0, totalCareRev = 0, totalCareCost = 0
    for (const cat of consumerCategories) {
      const m = metrics[cat]; const my = m.memberMonths / 12
      totalMM += m.memberMonths; totalRev += my * m.revenuePMPY; totalCost += my * m.costPMPY
      totalPatients += m.distinctPatients; totalCareRev += m.distinctPatients * m.netRevenuePerPatient
      totalCareCost += m.distinctPatients * m.totalCostPerPatient
    }
    const tmy = totalMM / 12
    const revPMPY = tmy > 0 ? totalRev / tmy : 0; const costPMPY = tmy > 0 ? totalCost / tmy : 0
    const marginPMPY = revPMPY - costPMPY; const marginPct = revPMPY > 0 ? (marginPMPY / revPMPY) * 100 : 0
    const nrpp = totalPatients > 0 ? totalCareRev / totalPatients : 0; const cpp = totalPatients > 0 ? totalCareCost / totalPatients : 0
    const mpp = nrpp - cpp; const mppPct = nrpp > 0 ? (mpp / nrpp) * 100 : 0
    const im = Math.round(marginPMPY + (totalPatients > 0 ? (totalCareRev - totalCareCost) / Math.max(tmy, 1) : 0))
    return { memberMonths: totalMM, revenuePMPY: Math.round(revPMPY), costPMPY: Math.round(costPMPY), totalMarginPMPY: Math.round(marginPMPY), totalMarginPMPYPct: marginPct, distinctPatients: totalPatients, netRevenuePerPatient: Math.round(nrpp), totalCostPerPatient: Math.round(cpp), totalMarginPerPatient: Math.round(mpp), totalMarginPerPatientPct: mppPct, integratedTotalMarginPerConsumer: im }
  }

  // Compute KPIs from totals
  const totalRollup = useMemo(() => rollupCategories(tableData.totalMetrics), [tableData.totalMetrics])
  const avgMonthlyMembers = Math.round(totalRollup.memberMonths / 12)

  // LOB margin comparison data for chart
  const lobMarginChart = useMemo(() => {
    return tableData.lobData
      .filter(l => l.lob !== "Other")
      .map(l => {
        const r = rollupCategories(l.metrics)
        return { lob: l.lob, planMargin: r.totalMarginPMPY, careMargin: r.totalMarginPerPatient, integrated: r.integratedTotalMarginPerConsumer }
      })
  }, [tableData.lobData])

  // Member distribution for donut
  const memberDonut = useMemo(() => {
    return tableData.lobData
      .filter(l => l.lob !== "Other")
      .map(l => {
        const r = rollupCategories(l.metrics)
        return { lob: l.lob, members: Math.round(r.memberMonths / 12) }
      })
  }, [tableData.lobData])
  const totalDonutMembers = memberDonut.reduce((s, d) => s + d.members, 0)

  // Revenue vs cost by LOB for stacked chart
  const revCostByLob = useMemo(() => {
    return lobData.reduce((acc, row) => {
      const existing = acc.find(a => a.lob === row.lob)
      if (existing) { existing.revenue += row.revenue; existing.cost += row.cost }
      else acc.push({ lob: row.lob, revenue: row.revenue, cost: row.cost })
      return acc
    }, [] as { lob: string; revenue: number; cost: number }[])
      .map(r => ({ ...r, revenuePMPY: Math.round(r.revenue / (r.revenue > 0 ? r.revenue / 8500 : 1)), costPMPY: Math.round(r.cost / (r.cost > 0 ? r.cost / 7200 : 1)) }))
  }, [lobData])

  const renderDataRow = (label: string, m: CategoryMetrics, indent = 0, isBold = false) => {
    const cls = isBold ? "font-bold" : ""; const bgCls = isBold ? "bg-muted/40" : ""
    return (
      <tr key={label} className={`border-b border-border hover:bg-muted/20 ${bgCls}`}>
        <td className={`p-2 text-sm text-foreground whitespace-nowrap ${cls}`} style={{ paddingLeft: 8 + indent * 20 }}>{label}</td>
        <td className={`p-2 text-right text-sm border-l border-border ${cls}`}>{formatNumber(m.memberMonths)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.revenuePMPY)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.costPMPY)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.totalMarginPMPY)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatPct(m.totalMarginPMPYPct)}</td>
        <td className={`p-2 text-right text-sm border-l border-border ${cls}`}>{formatNumber(m.distinctPatients)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.netRevenuePerPatient)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.totalCostPerPatient)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.totalMarginPerPatient)}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{m.totalMarginPerPatientPct !== 0 ? formatPct(m.totalMarginPerPatientPct) : ""}</td>
        <td className={`p-2 text-right text-sm ${cls}`}>{formatCurrency(m.integratedTotalMarginPerConsumer)}</td>
      </tr>
    )
  }

  const chronicFilterSetters: Record<string, { value: string; setter: (v: string) => void }> = {
    hyperTension: { value: hyperTensionFilter, setter: setHyperTensionFilter },
    depression: { value: depressionFilter, setter: setDepressionFilter },
    hyperlipidemia: { value: hyperlipidFilter, setter: setHyperlipidFilter },
    diabetes: { value: diabetesFilter, setter: setDiabetesFilter },
    tobaccoUse: { value: tobaccoFilter, setter: setTobaccoFilter },
    obesity: { value: obesityFilter, setter: setObesityFilter },
    anxietyDisorders: { value: anxietyFilter, setter: setAnxietyFilter },
    depressiveDisorder: { value: depressiveFilter, setter: setDepressiveFilter },
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-5 overflow-x-auto">
        {/* Title */}
        <div>
          <p className="text-xs italic text-muted-foreground">Preliminary</p>
          <h2 className="text-lg font-bold text-foreground text-balance">Consumer Economics Summary Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Integrated view across Health Plan and Care Delivery performance</p>
        </div>

        {/* Executive KPI Strip */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Avg Monthly Members", value: formatCompact(avgMonthlyMembers), icon: Users, color: mckinseyDataViz.teal },
            { label: "Distinct Patients / Year", value: formatCompact(totalRollup.distinctPatients), icon: Heart, color: mckinseyDataViz.brightBlue },
            { label: "Plan Revenue PMPY", value: formatCurrency(totalRollup.revenuePMPY), icon: DollarSign, color: mckinseyDataViz.darkTeal },
            { label: "Plan Margin PMPY", value: formatCurrency(totalRollup.totalMarginPMPY), icon: totalRollup.totalMarginPMPY >= 0 ? TrendingUp : TrendingDown, color: totalRollup.totalMarginPMPY >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral },
            { label: "Care Margin / Patient", value: formatCurrency(totalRollup.totalMarginPerPatient), icon: Activity, color: totalRollup.totalMarginPerPatient >= 0 ? mckinseyDataViz.midTeal : mckinseyDataViz.coral },
            { label: "Integrated Margin", value: formatCurrency(totalRollup.integratedTotalMarginPerConsumer), icon: totalRollup.integratedTotalMarginPerConsumer >= 0 ? TrendingUp : TrendingDown, color: totalRollup.integratedTotalMarginPerConsumer >= 0 ? mckinseyDataViz.brightBlue : mckinseyDataViz.coral },
          ].map(kpi => (
            <Card key={kpi.label} className="border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: kpi.color }} />
              <CardContent className="pt-4 pb-3 px-3">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[10px] leading-tight text-muted-foreground font-medium uppercase tracking-wide">{kpi.label}</p>
                  <kpi.icon className="h-3.5 w-3.5 shrink-0" style={{ color: kpi.color }} />
                </div>
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row: Margin by LOB + Member Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Margin Comparison by LOB */}
          <Card className="border-border lg:col-span-3">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-foreground">Integrated Margin by Line of Business ($)</CardTitle>
              <p className="text-[10px] text-muted-foreground">Plan margin PMPY + Care Delivery margin per patient + Integrated total</p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lobMarginChart} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
                    <XAxis dataKey="lob" tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} width={50} />
                    <ReferenceLine y={0} stroke="var(--border)" />
                    <Tooltip
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", color: "var(--foreground)" }} />
                    <Bar dataKey="planMargin" name="Plan Margin PMPY" fill={mckinseyDataViz.teal} barSize={20} radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="planMargin" position="top" formatter={(v: number) => `$${(v / 1000).toFixed(1)}K`} style={{ fontSize: 9, fill: "var(--foreground)" }} />
                    </Bar>
                    <Bar dataKey="careMargin" name="Care Margin / Patient" fill={mckinseyDataViz.midTeal} barSize={20} radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="careMargin" position="top" formatter={(v: number) => `$${(v / 1000).toFixed(1)}K`} style={{ fontSize: 9, fill: "var(--foreground)" }} />
                    </Bar>
                    <Bar dataKey="integrated" name="Integrated Margin" fill={mckinseyDataViz.brightBlue} barSize={20} radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="integrated" position="top" formatter={(v: number) => `$${(v / 1000).toFixed(1)}K`} style={{ fontSize: 9, fill: "var(--foreground)" }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Member Distribution Donut */}
          <Card className="border-border lg:col-span-2">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold text-foreground">Member Distribution by LOB</CardTitle>
              <p className="text-[10px] text-muted-foreground">Average monthly members across lines of business</p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={memberDonut}
                      dataKey="members"
                      nameKey="lob"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      label={({ lob, members }: { lob: string; members: number }) => {
                        const pct = totalDonutMembers > 0 ? ((members / totalDonutMembers) * 100).toFixed(0) : "0"
                        return `${lob} (${pct}%)`
                      }}
                      labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
                      style={{ fontSize: 9, fill: "var(--foreground)" }}
                    >
                      {memberDonut.map(d => (
                        <Cell key={d.lob} fill={LOB_COLORS[d.lob] || mckinseyDataViz.midTeal} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        const pct = totalDonutMembers > 0 ? ((value / totalDonutMembers) * 100).toFixed(1) : "0"
                        return [`${formatCompact(value)} (${pct}%)`, name]
                      }}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LOB Performance Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {tableData.lobData.filter(l => l.lob !== "Other").map(lobGroup => {
            const r = rollupCategories(lobGroup.metrics)
            const lobColor = LOB_COLORS[lobGroup.lob] || mckinseyDataViz.midTeal
            const marginPositive = r.integratedTotalMarginPerConsumer >= 0
            return (
              <Card key={lobGroup.lob} className="border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: lobColor }} />
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm font-bold" style={{ color: lobColor }}>{lobGroup.lob}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Avg Monthly Members</p>
                      <p className="text-sm font-semibold text-foreground">{formatCompact(Math.round(r.memberMonths / 12))}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Distinct Patients</p>
                      <p className="text-sm font-semibold text-foreground">{formatCompact(r.distinctPatients)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Plan Margin PMPY</p>
                      <p className="text-sm font-semibold" style={{ color: r.totalMarginPMPY >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(r.totalMarginPMPY)} <span className="text-[10px]">({formatPct(r.totalMarginPMPYPct)})</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Care Margin / Patient</p>
                      <p className="text-sm font-semibold" style={{ color: r.totalMarginPerPatient >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(r.totalMarginPerPatient)}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-border">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground">Integrated Total Margin</p>
                        {marginPositive ? <TrendingUp className="h-3 w-3" style={{ color: mckinseyDataViz.teal }} /> : <TrendingDown className="h-3 w-3" style={{ color: mckinseyDataViz.coral }} />}
                      </div>
                      <p className="text-lg font-bold" style={{ color: marginPositive ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(r.integratedTotalMarginPerConsumer)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Data Table */}
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Detailed Breakdown by Line of Business</CardTitle>
            <p className="text-[10px] text-muted-foreground">Click a row to expand consumer category details</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[1100px]">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="p-2 text-left" rowSpan={2}><span className="text-sm font-semibold text-foreground">Line of business</span></th>
                    <th className="p-2 text-center border-l border-border" colSpan={5} style={{ color: mckinseyDataViz.teal }}><span className="text-sm font-bold">Health Plan</span></th>
                    <th className="p-2 text-center border-l border-border" colSpan={6} style={{ color: mckinseyDataViz.darkTeal }}><span className="text-sm font-bold">Care Delivery</span></th>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground border-l border-border whitespace-nowrap">Avg Monthly<br/>Members</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Revenue<br/>PMPY ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Cost<br/>PMPY ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Margin<br/>PMPY ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Margin<br/>PMPY (%)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground border-l border-border whitespace-nowrap">Distinct<br/>Patients</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Revenue /<br/>Patient ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Cost /<br/>Patient ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Margin /<br/>Patient ($)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Margin /<br/>Patient (%)</th>
                    <th className="p-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Integrated<br/>Margin ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.lobData.map(lobGroup => {
                    const lobRollup = rollupCategories(lobGroup.metrics)
                    const isExpanded = expandedLobs.has(lobGroup.lob)
                    return (
                      <React.Fragment key={lobGroup.lob}>
                        <tr className="border-b border-border cursor-pointer hover:bg-muted/30" style={{ backgroundColor: `${mckinseyDataViz.paleBlue}20` }} onClick={() => toggleLob(lobGroup.lob)}>
                          <td className="p-2 font-bold text-sm text-foreground whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              {lobGroup.lob}
                            </span>
                          </td>
                          <td className="p-2 text-right text-sm font-bold border-l border-border">{formatNumber(lobRollup.memberMonths)}</td>
                          <td className="p-2 text-right text-sm font-bold">{formatCurrency(lobRollup.revenuePMPY)}</td>
                          <td className="p-2 text-right text-sm font-bold">{formatCurrency(lobRollup.costPMPY)}</td>
                          <td className="p-2 text-right text-sm font-bold" style={{ color: lobRollup.totalMarginPMPY >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(lobRollup.totalMarginPMPY)}</td>
                          <td className="p-2 text-right text-sm font-bold" style={{ color: lobRollup.totalMarginPMPYPct >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatPct(lobRollup.totalMarginPMPYPct)}</td>
                          <td className="p-2 text-right text-sm font-bold border-l border-border">{formatNumber(lobRollup.distinctPatients)}</td>
                          <td className="p-2 text-right text-sm font-bold">{formatCurrency(lobRollup.netRevenuePerPatient)}</td>
                          <td className="p-2 text-right text-sm font-bold">{formatCurrency(lobRollup.totalCostPerPatient)}</td>
                          <td className="p-2 text-right text-sm font-bold" style={{ color: lobRollup.totalMarginPerPatient >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(lobRollup.totalMarginPerPatient)}</td>
                          <td className="p-2 text-right text-sm font-bold" style={{ color: lobRollup.totalMarginPerPatientPct >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatPct(lobRollup.totalMarginPerPatientPct)}</td>
                          <td className="p-2 text-right text-sm font-bold" style={{ color: lobRollup.integratedTotalMarginPerConsumer >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(lobRollup.integratedTotalMarginPerConsumer)}</td>
                        </tr>
                        {isExpanded && consumerCategories.map(cat => {
                          const m = lobGroup.metrics[cat]
                          if (m.memberMonths === 0 && m.distinctPatients === 0) return null
                          return renderDataRow(cat, m, 1)
                        })}
                      </React.Fragment>
                    )
                  })}
                  {(() => {
                    const tr = rollupCategories(tableData.totalMetrics)
                    return (
                      <tr className="border-t-2 border-border" style={{ backgroundColor: `${mckinseyDataViz.paleBlue}30` }}>
                        <td className="p-2 font-bold text-sm text-foreground">Total</td>
                        <td className="p-2 text-right text-sm font-bold border-l border-border">{formatNumber(tr.memberMonths)}</td>
                        <td className="p-2 text-right text-sm font-bold">{formatCurrency(tr.revenuePMPY)}</td>
                        <td className="p-2 text-right text-sm font-bold">{formatCurrency(tr.costPMPY)}</td>
                        <td className="p-2 text-right text-sm font-bold" style={{ color: tr.totalMarginPMPY >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(tr.totalMarginPMPY)}</td>
                        <td className="p-2 text-right text-sm font-bold" style={{ color: tr.totalMarginPMPYPct >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatPct(tr.totalMarginPMPYPct)}</td>
                        <td className="p-2 text-right text-sm font-bold border-l border-border">{formatNumber(tr.distinctPatients)}</td>
                        <td className="p-2 text-right text-sm font-bold">{formatCurrency(tr.netRevenuePerPatient)}</td>
                        <td className="p-2 text-right text-sm font-bold">{formatCurrency(tr.totalCostPerPatient)}</td>
                        <td className="p-2 text-right text-sm font-bold" style={{ color: tr.totalMarginPerPatient >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(tr.totalMarginPerPatient)}</td>
                        <td className="p-2 text-right text-sm font-bold" style={{ color: tr.totalMarginPerPatientPct >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatPct(tr.totalMarginPerPatientPct)}</td>
                        <td className="p-2 text-right text-sm font-bold" style={{ color: tr.integratedTotalMarginPerConsumer >= 0 ? mckinseyDataViz.teal : mckinseyDataViz.coral }}>{formatCurrency(tr.integratedTotalMarginPerConsumer)}</td>
                      </tr>
                    )
                  })()}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-72 shrink-0 space-y-4 overflow-y-auto">
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

        <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.teal }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold" style={{ color: mckinseyDataViz.teal }}>Local Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Attribution status</label>
              <Select value={attributionFilter} onValueChange={setAttributionFilter}>
                <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {attributionStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.coral }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold" style={{ color: mckinseyDataViz.coral }}>Chronic condition selector</CardTitle>
            <p className="text-xs italic text-muted-foreground">Available for members only</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {chronicConditions.map(cc => {
                const fs = chronicFilterSetters[cc.key]
                return (
                  <div key={cc.key}>
                    <label className="text-xs font-medium text-foreground block mb-1">{cc.label}</label>
                    <Select value={fs.value} onValueChange={fs.setter}>
                      <SelectTrigger className="h-7 text-xs bg-secondary border-border"><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
