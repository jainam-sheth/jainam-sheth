"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import {
  mckinseyDataViz, sequentialColors, chartColors,
} from "@/lib/colors/mckinsey-palette"
import {
  getCareDeliveryFilterOptions, getCareDeliveryKPIs, getCareDeliveryMonthlyTrend,
  getCareDeliveryByLob, getCareDeliveryByServiceLine,
  type CareDeliveryFilters,
} from "@/lib/data/care-delivery-data"
import { useCareDeliveryFilters } from "@/contexts/care-delivery-filters-context"
import {
  Line, Bar, BarChart, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts"

const filterOpts = getCareDeliveryFilterOptions()

const formatCurrency = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}
const formatNumber = (n: number) => Math.round(n).toLocaleString()

const LOB_COLORS: Record<string, string> = {
  COMMERCIAL: mckinseyDataViz.teal,
  MEDICAID: mckinseyDataViz.brightBlue,
  MEDICARE: mckinseyDataViz.darkTeal,
}

const SL_COLORS = [
  mckinseyDataViz.teal, mckinseyDataViz.darkTeal, mckinseyDataViz.brightBlue,
  mckinseyDataViz.purple, mckinseyDataViz.coral, mckinseyDataViz.peach,
  mckinseyDataViz.midTeal, mckinseyDataViz.lavender,
]

export function CareDeliveryOverview() {
  const { yearFilter, setYearFilter, selectedFacilities, setSelectedFacilities, selectedLobs, setSelectedLobs, globalFilters } = useCareDeliveryFilters()

  // Local filters
  const [selectedBillingTypes, setSelectedBillingTypes] = useState<string[]>([])
  const [selectedPatientTypes, setSelectedPatientTypes] = useState<string[]>([])

  const filters = useMemo((): CareDeliveryFilters => {
    const f: CareDeliveryFilters = { ...globalFilters }
    if (selectedBillingTypes.length) f.billingTypes = selectedBillingTypes
    if (selectedPatientTypes.length) f.patientTypes = selectedPatientTypes
    return f
  }, [globalFilters, selectedBillingTypes, selectedPatientTypes])

  const kpis = useMemo(() => getCareDeliveryKPIs(filters), [filters])
  const trend = useMemo(() => getCareDeliveryMonthlyTrend(filters), [filters])
  const byLob = useMemo(() => getCareDeliveryByLob(filters), [filters])
  const byServiceLine = useMemo(() => getCareDeliveryByServiceLine(filters).slice(0, 8), [filters])

  return (
    <div className="flex gap-0 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <p className="text-sm italic text-muted-foreground">Care Delivery</p>
          <h2 className="text-lg font-bold text-foreground">Provider Performance Overview</h2>
        </div>

        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Encounters", value: formatNumber(kpis.totalEncounters), color: mckinseyDataViz.teal },
            { label: "Total Revenue", value: formatCurrency(kpis.totalRevenue), color: sequentialColors.revenue },
            { label: "Total Cost", value: formatCurrency(kpis.totalCost), color: sequentialColors.cost },
            { label: "Margin", value: `${formatCurrency(kpis.margin)} (${kpis.marginPct.toFixed(1)}%)`, color: kpis.margin >= 0 ? chartColors.positive : chartColors.negative },
          ].map(kpi => (
            <Card key={kpi.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* KPI Cards Row 2 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Charges", value: formatCurrency(kpis.totalCharges), color: mckinseyDataViz.darkTeal },
            { label: "Total Payments", value: formatCurrency(kpis.totalPayments), color: mckinseyDataViz.brightBlue },
            { label: "Avg Revenue / Encounter", value: formatCurrency(kpis.avgRevenuePerEncounter), color: mckinseyDataViz.midTeal },
            { label: "Avg Cost / Encounter", value: formatCurrency(kpis.avgCostPerEncounter), color: mckinseyDataViz.coral },
          ].map(kpi => (
            <Card key={kpi.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-lg font-semibold" style={{ color: kpi.color }}>{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue & Cost Trend */}
        <Card className="border-border mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Revenue & Cost Trend (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} angle={-45} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} width={65} />
                  <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke={sequentialColors.revenue} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cost" name="Cost" stroke={sequentialColors.cost} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="margin" name="Margin" stroke={mckinseyDataViz.purple} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "var(--foreground)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* LOB donut + Top Service Lines */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="border-border col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Encounters by LOB</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                {(() => {
                  const totalEnc = byLob.reduce((s, r) => s + r.encounters, 0)
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={byLob}
                          dataKey="encounters"
                          nameKey="lob"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          label={({ lob, encounters }: { lob: string; encounters: number }) => {
                            const pct = totalEnc > 0 ? ((encounters / totalEnc) * 100).toFixed(1) : "0"
                            return `${lob} (${pct}%)`
                          }}
                          labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
                          style={{ fontSize: 10, fill: "var(--foreground)" }}
                        >
                          {byLob.map((entry, i) => (
                            <Cell key={entry.lob} fill={LOB_COLORS[entry.lob] || SL_COLORS[i % SL_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            const pct = totalEnc > 0 ? ((value / totalEnc) * 100).toFixed(1) : "0"
                            return [`${formatNumber(value)} (${pct}%)`, name]
                          }}
                          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border col-span-3">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Top Service Lines by Revenue</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byServiceLine} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="serviceLine" tick={{ fontSize: 10, fill: "var(--foreground)" }} width={110} />
                    <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={mckinseyDataViz.teal} barSize={16} radius={[0, 3, 3, 0]} />
                    <Bar dataKey="cost" name="Cost" fill={mckinseyDataViz.darkTeal} barSize={16} radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Sidebar */}
      <aside className="w-[280px] shrink-0 border-l border-border bg-card overflow-y-auto p-4">
        <div className="mb-1">
          <div className="text-xs font-bold text-white px-2 py-1 rounded-t" style={{ backgroundColor: mckinseyDataViz.teal }}>Global Filters</div>
          <div className="border border-t-0 border-border rounded-b p-3 space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Year</p>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOpts.years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Facility</p>
              <MultiSelectFilter options={filterOpts.facilities} selected={selectedFacilities} onChange={setSelectedFacilities} placeholder="All" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">LOB</p>
              <MultiSelectFilter options={filterOpts.lobs} selected={selectedLobs} onChange={setSelectedLobs} placeholder="All" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs font-bold text-white px-2 py-1 rounded-t" style={{ backgroundColor: mckinseyDataViz.coral }}>Local Filters</div>
          <div className="border border-t-0 border-border rounded-b p-3 space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Billing Type</p>
              <MultiSelectFilter options={filterOpts.billingTypes} selected={selectedBillingTypes} onChange={setSelectedBillingTypes} placeholder="All" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Patient Type</p>
              <MultiSelectFilter options={filterOpts.patientTypes} selected={selectedPatientTypes} onChange={setSelectedPatientTypes} placeholder="All" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
