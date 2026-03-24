"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { mckinseyDataViz, mckinseyGrays } from "@/lib/colors/mckinsey-palette"
import {
  getCareDeliveryFilterOptions, getCareDeliveryByServiceLine,
  type CareDeliveryFilters,
} from "@/lib/data/care-delivery-data"
import { useCareDeliveryFilters } from "@/contexts/care-delivery-filters-context"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts"

const filterOpts = getCareDeliveryFilterOptions()

const formatCurrency = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}
const formatNumber = (n: number) => Math.round(n).toLocaleString()

export function CareDeliveryServiceLine() {
  const { yearFilter, setYearFilter, selectedFacilities, setSelectedFacilities, selectedLobs, setSelectedLobs, globalFilters } = useCareDeliveryFilters()

  // Local filters
  const [selectedBillingTypes, setSelectedBillingTypes] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])

  const filters = useMemo((): CareDeliveryFilters => {
    const f: CareDeliveryFilters = { ...globalFilters }
    if (selectedBillingTypes.length) f.billingTypes = selectedBillingTypes
    if (selectedGenders.length) f.genders = selectedGenders
    return f
  }, [globalFilters, selectedBillingTypes, selectedGenders])

  const data = useMemo(() => getCareDeliveryByServiceLine(filters), [filters])

  const totals = useMemo(() => {
    const t = { encounters: 0, charges: 0, payments: 0, revenue: 0, cost: 0, margin: 0 }
    for (const d of data) { t.encounters += d.encounters; t.charges += d.charges; t.payments += d.payments; t.revenue += d.revenue; t.cost += d.cost; t.margin += d.margin }
    return { ...t, marginPct: t.revenue > 0 ? ((t.margin) / t.revenue) * 100 : 0, avgRev: t.encounters > 0 ? Math.round(t.revenue / t.encounters) : 0, avgCost: t.encounters > 0 ? Math.round(t.cost / t.encounters) : 0 }
  }, [data])

  return (
    <div className="flex gap-0 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <p className="text-sm italic text-muted-foreground">Care Delivery</p>
          <h2 className="text-lg font-bold text-foreground">Service Line Analysis</h2>
        </div>

        {/* Stacked Bar Chart */}
        <Card className="border-border mb-6">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-foreground">Revenue vs Cost by Service Line</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 20, bottom: 80, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="serviceLine" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} angle={-40} textAnchor="end" interval={0} height={100} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} width={60} />
                  <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="revenue" name="Revenue" fill={mckinseyDataViz.teal} barSize={20} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cost" name="Cost" fill={mckinseyDataViz.darkTeal} barSize={20} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Service Line Detail</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: mckinseyDataViz.teal }}>
                    {["Service Line", "Encounters", "Total Charges", "Total Payments", "Total Revenue", "Total Cost", "Margin ($)", "Margin (%)", "Avg Rev/Enc", "Avg Cost/Enc"].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-white font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={row.serviceLine} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{row.serviceLine}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatNumber(row.encounters)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.charges)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.payments)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.revenue)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.cost)}</td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: row.margin >= 0 ? mckinseyDataViz.midTeal : mckinseyDataViz.coral }}>{formatCurrency(row.margin)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{row.marginPct.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.avgRevenuePerEncounter)}</td>
                      <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.avgCostPerEncounter)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-foreground font-bold" style={{ backgroundColor: mckinseyGrays.gray6 }}>
                    <td className="px-3 py-2 text-foreground">Total</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatNumber(totals.encounters)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.charges)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.payments)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.revenue)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.cost)}</td>
                    <td className="px-3 py-2 text-right font-bold" style={{ color: totals.margin >= 0 ? mckinseyDataViz.midTeal : mckinseyDataViz.coral }}>{formatCurrency(totals.margin)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{totals.marginPct.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.avgRev)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(totals.avgCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
              <p className="text-xs font-semibold text-foreground mb-1">Gender</p>
              <MultiSelectFilter options={filterOpts.genders} selected={selectedGenders} onChange={setSelectedGenders} placeholder="All" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
