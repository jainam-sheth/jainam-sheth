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
  getFilterOptions, getPatientMembersByLob, type CentralDataFilters,
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

const lobDisplayNames: Record<string, string> = {
  COMMERCIAL: "Commercial",
  MEDICAID: "Medicaid",
  MEDICARE: "Medicare",
}

export function PatientMembersByLobDashboard() {
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

  const [sublobFilter, setSublobFilter] = useState("All")
  const [attributionFilter, setAttributionFilter] = useState("All")

  const dataFilters = useMemo((): CentralDataFilters => {
    const f: CentralDataFilters = {}
    if (yearFilter !== "all") f.years = [Number(yearFilter)]
    if (centralFilters.geo) f.geo = centralFilters.geo
    if (centralFilters.chronicConditions) f.chronicConditions = centralFilters.chronicConditions
    if (sublobFilter !== "All") f.sublobs = [sublobFilter]
    if (attributionFilter === "Attributed") {
      f.providerAttributions = ["Provider Group 2", "Provider Group 1"]
    } else if (attributionFilter === "Non-Attributed") {
      f.providerAttributions = ["Non-Provider Group 2", "Non-Provider Group 1"]
    }
    return f
  }, [yearFilter, centralFilters, sublobFilter, attributionFilter])

  const rawRows = useMemo(() => getPatientMembersByLob(dataFilters), [dataFilters])

  // Aggregate by LOB + compute totals
  const lobData = useMemo(() => {
    const lobGroups = ["COMMERCIAL", "MEDICAID", "MEDICARE"]
    const rows = lobGroups.map(lob => {
      const lobRows = rawRows.filter(r => r.lob === lob)
      const memberMonths = lobRows.reduce((s, r) => s + r.memberMonths, 0)
      const revenue = lobRows.reduce((s, r) => s + r.revenue, 0)
      const cost = lobRows.reduce((s, r) => s + r.cost, 0)
      const planProviderCost = lobRows.reduce((s, r) => s + r.planProviderCost, 0)
      const otherPlanCost = lobRows.reduce((s, r) => s + r.otherPlanCost, 0)
      const distinctPatients = lobRows.reduce((s, r) => s + r.distinctPatients, 0)
      const careRevenue = lobRows.reduce((s, r) => s + r.careRevenue, 0)
      const careCost = lobRows.reduce((s, r) => s + r.careCost, 0)
      const memberYears = memberMonths / 12
      return {
        label: lobDisplayNames[lob] || lob,
        avgMonthlyMembers: Math.round(memberMonths / 12),
        planProviderCostPMPY: memberYears > 0 ? Math.round(planProviderCost / memberYears) : 0,
        otherPlanCostPMPY: memberYears > 0 ? Math.round(otherPlanCost / memberYears) : 0,
        totalCostPMPY: memberYears > 0 ? Math.round((planProviderCost + otherPlanCost) / memberYears) : 0,
        planMarginPMPY: memberYears > 0 ? Math.round((revenue - cost) / memberYears) : 0,
        careMarginPerPatient: distinctPatients > 0 ? Math.round((careRevenue - careCost) / distinctPatients) : 0,
        integratedMargin: memberYears > 0 ? Math.round(((revenue - cost) / memberYears) + ((careRevenue - careCost) / memberYears)) : 0,
        isTotal: false,
      }
    })

    // Total row
    const totalMM = rawRows.reduce((s, r) => s + r.memberMonths, 0)
    const totalRev = rawRows.reduce((s, r) => s + r.revenue, 0)
    const totalCost = rawRows.reduce((s, r) => s + r.cost, 0)
    const totalProvCost = rawRows.reduce((s, r) => s + r.planProviderCost, 0)
    const totalOtherCost = rawRows.reduce((s, r) => s + r.otherPlanCost, 0)
    const totalPatients = rawRows.reduce((s, r) => s + r.distinctPatients, 0)
    const totalCareRev = rawRows.reduce((s, r) => s + r.careRevenue, 0)
    const totalCareCost = rawRows.reduce((s, r) => s + r.careCost, 0)
    const totalMY = totalMM / 12
    rows.push({
      label: "Total",
      avgMonthlyMembers: Math.round(totalMM / 12),
      planProviderCostPMPY: totalMY > 0 ? Math.round(totalProvCost / totalMY) : 0,
      otherPlanCostPMPY: totalMY > 0 ? Math.round(totalOtherCost / totalMY) : 0,
      totalCostPMPY: totalMY > 0 ? Math.round((totalProvCost + totalOtherCost) / totalMY) : 0,
      planMarginPMPY: totalMY > 0 ? Math.round((totalRev - totalCost) / totalMY) : 0,
      careMarginPerPatient: totalPatients > 0 ? Math.round((totalCareRev - totalCareCost) / totalPatients) : 0,
      integratedMargin: totalMY > 0 ? Math.round(((totalRev - totalCost) / totalMY) + ((totalCareRev - totalCareCost) / totalMY)) : 0,
      isTotal: true,
    })
    return rows
  }, [rawRows])

  const availableSublobs = useMemo(() => [...new Set(rawRows.map(r => r.sublob))].sort(), [rawRows])
  const maxMembers = Math.max(...lobData.map(d => d.avgMonthlyMembers), 1)
  const maxCost = Math.max(...lobData.map(d => d.totalCostPMPY), 1)

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
          <h3 className="text-base font-semibold italic text-foreground mt-1">Patient-members by Line of Business</h3>
        </div>

        {/* Visualization */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            {/* Column headers */}
            <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-0 mb-2">
              <div />
              <div className="text-center border-l border-border px-2">
                <h4 className="text-sm font-bold text-foreground">Average monthly members</h4>
              </div>
              <div className="text-center border-l border-border px-2">
                <h4 className="text-sm font-bold text-foreground">Plan spend PMPY at providers versus non-providers ($)</h4>
                <p className="text-xs text-muted-foreground">Based on total plan costs and plan payments to providers</p>
              </div>
              <div className="text-center border-l border-border px-2">
                <h4 className="text-sm font-bold text-foreground">Integrated total margin per patient-member ($)</h4>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mb-4 flex-wrap text-xs pl-[180px]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.providerCost }} />
                <span className="text-foreground">Plan payments to providers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.otherCost }} />
                <span className="text-foreground">Other plan costs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.planMargin }} />
                <span className="text-foreground">Plan total margin PMPY</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.careMargin }} />
                <span className="text-foreground">Care Delivery total margin per patient</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.integrated }} />
                <span className="text-foreground">Integrated total margin</span>
              </div>
            </div>

            {/* Data rows */}
            {lobData.map((data, idx) => (
              <div key={data.label}
                className={`grid grid-cols-[180px_1fr_1fr_1fr] gap-0 items-center ${
                  idx < lobData.length - 1 ? "border-b border-border" : ""
                } ${data.isTotal ? "bg-muted/30" : ""}`}
                style={{ minHeight: "140px" }}
              >
                <div className="pr-3 py-4">
                  <h5 className={`text-sm text-foreground leading-tight ${data.isTotal ? "font-extrabold" : "font-bold"}`}>
                    {data.label}
                  </h5>
                </div>

                {/* Avg monthly members */}
                <div className="flex items-center gap-2 border-l border-border px-4 py-4">
                  <div className="h-7 rounded-sm"
                    style={{ backgroundColor: COLORS.memberBar, width: `${Math.max((data.avgMonthlyMembers / maxMembers) * 120, 20)}px` }}
                  />
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{formatK(data.avgMonthlyMembers)}</span>
                </div>

                {/* Stacked cost bar */}
                <div className="flex items-center gap-1 border-l border-border px-4 py-4">
                  <div className="h-8 flex items-center justify-center text-xs font-bold text-white rounded-l-sm"
                    style={{ backgroundColor: COLORS.providerCost, width: `${Math.max((data.planProviderCostPMPY / maxCost) * 140, 40)}px` }}
                  >{formatDollar(data.planProviderCostPMPY)}</div>
                  <div className="h-8 flex items-center justify-center text-xs font-bold text-white rounded-r-sm"
                    style={{ backgroundColor: COLORS.otherCost, width: `${Math.max((data.otherPlanCostPMPY / maxCost) * 140, 40)}px` }}
                  >{formatDollar(data.otherPlanCostPMPY)}</div>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{formatDollar(data.totalCostPMPY)}</span>
                </div>

                {/* Margin bar chart */}
                <div className="h-[140px] border-l border-border px-2 py-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Plan Margin", value: data.planMarginPMPY },
                        { name: "Care Margin", value: data.careMarginPerPatient },
                        { name: "Integrated", value: data.integratedMargin },
                      ]}
                      margin={{ top: 25, right: 5, bottom: 5, left: 5 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatDollarK} width={45} />
                      <ReferenceLine y={0} stroke="var(--border)" />
                      <Tooltip formatter={(value: number) => [formatDollar(value)]}
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                      />
                      <Bar dataKey="value" barSize={28}>
                        <Cell fill={COLORS.planMargin} />
                        <Cell fill={COLORS.careMargin} />
                        <Cell fill={COLORS.integrated} />
                        <LabelList dataKey="value" position="top" formatter={formatDollarK} style={{ fontSize: 9, fill: "var(--foreground)" }} />
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
              <label className="text-xs text-muted-foreground block mb-1">Sub LOB</label>
              <Select value={sublobFilter} onValueChange={setSublobFilter}>
                <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {availableSublobs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Attribution status</label>
              <Select value={attributionFilter} onValueChange={setAttributionFilter}>
                <SelectTrigger className="h-8 text-sm bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Attributed">Attributed</SelectItem>
                  <SelectItem value="Non-Attributed">Non-Attributed</SelectItem>
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
