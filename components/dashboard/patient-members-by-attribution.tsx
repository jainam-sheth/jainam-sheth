"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { mckinseyDataViz } from "@/lib/colors/mckinsey-palette"
import {
  getFilterOptions, getPatientMembersByAttribution, type CentralDataFilters,
} from "@/lib/data/mlr-data"
import {
  Bar, BarChart, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList,
} from "recharts"

const filterOptions = getFilterOptions()



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

const formatK = (n: number) => {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`
  return Math.round(n).toLocaleString()
}
const formatDollarK = (n: number) => {
  if (n < 0) return `($${formatK(Math.abs(n))})`
  return `$${formatK(n)}`
}
const formatDollar = (n: number) => {
  if (n < 0) return `($${Math.abs(Math.round(n)).toLocaleString()})`
  return `$${Math.round(n).toLocaleString()}`
}

// Chart colors - McKinsey palette only
const COLORS = {
  providerCost: mckinseyDataViz.teal,         // #027AB1
  otherCost: mckinseyDataViz.darkTeal,        // #034B6F
  planMargin: mckinseyDataViz.coral,          // #E5546C
  careMargin: mckinseyDataViz.midTeal,        // #3C96B4
  integrated: mckinseyDataViz.brightBlue,     // #39BDF3
  memberBar: mckinseyDataViz.paleBlue,        // #AAE6F0
}

export function PatientMembersByAttributionDashboard() {
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

  const [lobFilter, setLobFilter] = useState("All")
  const [sublobFilter, setSublobFilter] = useState("All")

  const dataFilters = useMemo((): CentralDataFilters => {
    const f: CentralDataFilters = {}
    if (yearFilter !== "all") f.years = [Number(yearFilter)]
    if (centralFilters.geo) f.geo = centralFilters.geo
    if (centralFilters.chronicConditions) f.chronicConditions = centralFilters.chronicConditions
    if (lobFilter !== "All") f.lobs = [lobFilter]
    if (sublobFilter !== "All") f.sublobs = [sublobFilter]
    return f
  }, [yearFilter, centralFilters, lobFilter, sublobFilter])

  const rawRows = useMemo(() => getPatientMembersByAttribution(dataFilters), [dataFilters])

  const attributionData = useMemo(() => {
    const groups = ["Provider Group 2 attributed", "Other network attributed", "Unattributed"]
    return groups.map(group => {
      const rows = rawRows.filter(r => r.attributionGroup === group)
      const memberMonths = rows.reduce((s, r) => s + r.memberMonths, 0)
      const revenue = rows.reduce((s, r) => s + r.revenue, 0)
      const cost = rows.reduce((s, r) => s + r.cost, 0)
      const planProviderCost = rows.reduce((s, r) => s + r.planProviderCost, 0)
      const otherPlanCost = rows.reduce((s, r) => s + r.otherPlanCost, 0)
      const distinctPatients = rows.reduce((s, r) => s + r.distinctPatients, 0)
      const careRevenue = rows.reduce((s, r) => s + r.careRevenue, 0)
      const careCost = rows.reduce((s, r) => s + r.careCost, 0)
      const memberYears = memberMonths / 12
      const planProviderCostPMPY = memberYears > 0 ? planProviderCost / memberYears : 0
      const otherPlanCostPMPY = memberYears > 0 ? otherPlanCost / memberYears : 0
      const revPMPY = memberYears > 0 ? revenue / memberYears : 0
      const costPMPY = memberYears > 0 ? cost / memberYears : 0
      return {
        group,
        avgMonthlyMembers: Math.round(memberMonths / 12),
        planProviderCostPMPY: Math.round(planProviderCostPMPY),
        otherPlanCostPMPY: Math.round(otherPlanCostPMPY),
        totalCostPMPY: Math.round(planProviderCostPMPY + otherPlanCostPMPY),
        planMarginPMPY: Math.round(revPMPY - costPMPY),
        careMarginPerPatient: distinctPatients > 0 ? Math.round((careRevenue - careCost) / distinctPatients) : 0,
        integratedMargin: memberYears > 0 ? Math.round((revPMPY - costPMPY) + ((careRevenue - careCost) / memberYears)) : 0,
      }
    })
  }, [rawRows])

  const availableLobs = useMemo(() => [...new Set(rawRows.map(r => r.lob))].sort(), [rawRows])
  const availableSublobs = useMemo(() => {
    const rows = lobFilter !== "All" ? rawRows.filter(r => r.lob === lobFilter) : rawRows
    return [...new Set(rows.map(r => r.sublob))].sort()
  }, [rawRows, lobFilter])

  const maxMembers = Math.max(...attributionData.map(d => d.avgMonthlyMembers), 1)
  const maxCost = Math.max(...attributionData.map(d => d.totalCostPMPY), 1)

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
      <div className="flex-1 min-w-0 space-y-4 overflow-x-auto">
        {/* Title */}
        <div>
          <p className="text-sm italic text-muted-foreground">Preliminary</p>
          <h2 className="text-lg font-bold text-center text-foreground">Consumer economics summary dashboard</h2>
          <h3 className="text-base font-semibold italic text-foreground mt-1">Patient-members by Attribution</h3>
        </div>

        {/* Visualization */}
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            {/* Three column header row with per-section legends */}
            <div className="grid grid-cols-[200px_1fr_1.6fr_1.6fr] border-b border-border">
              {/* Row label spacer */}
              <div />

              {/* Section 1: Average monthly members */}
              <div className="border-l border-border px-4 py-3">
                <h4 className="text-xs font-bold text-foreground leading-tight">Average monthly members</h4>
                {/* No legend for this section */}
              </div>

              {/* Section 2: Plan spend */}
              <div className="border-l border-border px-4 py-3">
                <h4 className="text-xs font-bold text-foreground leading-tight">Plan spend PMPY at providers versus non-providers ($)</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Based on total plan costs and plan payments to providers</p>
                {/* Section 2 legend */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS.providerCost }} />
                    <span className="text-[10px] text-foreground">Plan payments to providers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS.otherCost }} />
                    <span className="text-[10px] text-foreground">Other plan costs</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Integrated margin */}
              <div className="border-l border-border px-4 py-3">
                <h4 className="text-xs font-bold text-foreground leading-tight">Integrated total margin per patient-member ($)</h4>
                {/* Section 3 legend */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS.planMargin }} />
                    <span className="text-[10px] text-foreground">Plan total margin PMPY</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS.careMargin }} />
                    <span className="text-[10px] text-foreground">Care Delivery total margin per patient</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS.integrated }} />
                    <span className="text-[10px] text-foreground">Integrated total margin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data rows */}
            {attributionData.map((data, idx) => (
              <div
                key={data.group}
                className={`grid grid-cols-[200px_1fr_1.6fr_1.6fr] items-stretch ${idx < attributionData.length - 1 ? "border-b border-border" : ""}`}
                style={{ minHeight: "150px" }}
              >
                {/* Attribution group label */}
                <div className="pr-3 py-5 flex items-center">
                  <h5 className="text-sm font-bold text-foreground leading-snug">{data.group}</h5>
                </div>

                {/* Col 1: Avg monthly members - horizontal bar */}
                <div className="flex flex-col justify-center gap-2 border-l border-border px-4 py-4">
                  <div className="h-6 rounded-sm"
                    style={{ backgroundColor: COLORS.memberBar, width: `${Math.max((data.avgMonthlyMembers / maxMembers) * 100, 15)}%` }}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {formatK(data.avgMonthlyMembers)}
                  </span>
                </div>

                {/* Col 2: Stacked horizontal cost bar */}
                <div className="flex flex-col justify-center border-l border-border px-4 py-4 gap-2">
                  <div className="flex items-stretch h-8">
                    <div
                      className="flex items-center justify-center text-[10px] font-bold text-white rounded-l-sm px-1"
                      style={{ backgroundColor: COLORS.providerCost, flex: data.planProviderCostPMPY, minWidth: "36px" }}
                    >
                      {formatDollar(data.planProviderCostPMPY)}
                    </div>
                    <div
                      className="flex items-center justify-center text-[10px] font-bold text-white rounded-r-sm px-1"
                      style={{ backgroundColor: COLORS.otherCost, flex: data.otherPlanCostPMPY, minWidth: "36px" }}
                    >
                      {formatDollar(data.otherPlanCostPMPY)}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{formatDollar(data.totalCostPMPY)}</span>
                </div>

                {/* Col 3: Grouped vertical margin bars */}
                <div className="border-l border-border px-2 py-2" style={{ minHeight: "150px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Plan", value: data.planMarginPMPY },
                        { name: "Care", value: data.careMarginPerPatient },
                        { name: "Integrated", value: data.integratedMargin },
                      ]}
                      margin={{ top: 22, right: 10, bottom: 5, left: 10 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatDollarK} width={48} axisLine={false} tickLine={false} />
                      <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatDollar(value), name]}
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                      />
                      <Bar dataKey="value" barSize={30} radius={[2, 2, 0, 0]}>
                        <Cell fill={COLORS.planMargin} />
                        <Cell fill={COLORS.careMargin} />
                        <Cell fill={COLORS.integrated} />
                        <LabelList
                          dataKey="value"
                          position="top"
                          formatter={formatDollarK}
                          style={{ fontSize: 9, fill: "var(--foreground)", fontWeight: 600 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
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
              <label className="text-xs text-muted-foreground block mb-1">LOB</label>
              <Select value={lobFilter} onValueChange={(v) => { setLobFilter(v); setSublobFilter("All") }}>
                <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {availableLobs.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Sub LOB</label>
              <Select value={sublobFilter} onValueChange={setSublobFilter}>
                <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {availableSublobs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
