"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { mckinseyDataViz } from "@/lib/colors/mckinsey-palette"
import {
  getCareDeliveryFilterOptions, getPatientMixByDimension, getCareDeliveryByLob,
  type CareDeliveryFilters,
} from "@/lib/data/care-delivery-data"
import { useCareDeliveryFilters } from "@/contexts/care-delivery-filters-context"
import {
  Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from "recharts"

const filterOpts = getCareDeliveryFilterOptions()

const formatCurrency = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}
const formatNumber = (n: number) => Math.round(n).toLocaleString()

const DIMENSION_COLORS = [
  mckinseyDataViz.teal, mckinseyDataViz.darkTeal, mckinseyDataViz.brightBlue,
  mckinseyDataViz.midTeal, mckinseyDataViz.coral, mckinseyDataViz.lavender,
  mckinseyDataViz.paleBlue, mckinseyDataViz.lightBlue,
]

const LOB_COLORS: Record<string, string> = {
  COMMERCIAL: mckinseyDataViz.teal,
  MEDICAID: mckinseyDataViz.brightBlue,
  MEDICARE: mckinseyDataViz.darkTeal,
}

export function CareDeliveryPatientMix() {
  const { yearFilter, setYearFilter, selectedFacilities, setSelectedFacilities, selectedLobs, setSelectedLobs, globalFilters } = useCareDeliveryFilters()

  // Local filters
  const [selectedServiceLines, setSelectedServiceLines] = useState<string[]>([])

  const filters = useMemo((): CareDeliveryFilters => {
    const f: CareDeliveryFilters = { ...globalFilters }
    if (selectedServiceLines.length) f.serviceLines = selectedServiceLines
    return f
  }, [globalFilters, selectedServiceLines])

  const billingMix = useMemo(() => getPatientMixByDimension("billingType", filters), [filters])
  const genderMix = useMemo(() => getPatientMixByDimension("gender", filters), [filters])
  const ptMix = useMemo(() => getPatientMixByDimension("patientType", filters), [filters])
  const lobData = useMemo(() => getCareDeliveryByLob(filters), [filters])

  return (
    <div className="flex gap-0 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <p className="text-sm italic text-muted-foreground">Care Delivery</p>
          <h2 className="text-lg font-bold text-foreground">Patient Mix & Demographics</h2>
        </div>

        {/* Billing Type + Gender */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Billing Type (HB vs PB)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billingMix} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="value" tick={{ fontSize: 11, fill: "var(--foreground)" }} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} width={55} />
                    <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "var(--foreground)" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={mckinseyDataViz.teal} barSize={28} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="cost" name="Cost" fill={mckinseyDataViz.coral} barSize={28} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="margin" name="Margin" fill={mckinseyDataViz.brightBlue} barSize={28} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                {billingMix.map(d => (
                  <div key={d.value} className="text-center flex-1">
                    <p className="text-xs font-semibold text-foreground">{d.value}</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(d.encounters)} enc ({d.pctOfTotal.toFixed(1)}%)</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Gender Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genderMix} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="value" tick={{ fontSize: 11, fill: "var(--foreground)" }} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} width={55} />
                    <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "var(--foreground)" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={mckinseyDataViz.brightBlue} barSize={28} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="cost" name="Cost" fill={mckinseyDataViz.darkTeal} barSize={28} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="margin" name="Margin" fill={mckinseyDataViz.midTeal} barSize={28} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                {genderMix.map(d => (
                  <div key={d.value} className="text-center flex-1">
                    <p className="text-xs font-semibold text-foreground">{d.value}</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(d.encounters)} enc ({d.pctOfTotal.toFixed(1)}%)</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Type + LOB */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Patient Type Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ptMix} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="value" tick={{ fontSize: 10, fill: "var(--foreground)" }} width={85} />
                    <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "var(--foreground)" }} />
                    <Bar dataKey="revenue" name="Revenue" fill={mckinseyDataViz.teal} barSize={14} radius={[0, 3, 3, 0]} />
                    <Bar dataKey="cost" name="Cost" fill={mckinseyDataViz.coral} barSize={14} radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 border-t border-border pt-2">
                {ptMix.map(d => (
                  <div key={d.value} className="flex items-center justify-between py-1 text-[10px]">
                    <span className="text-foreground font-medium">{d.value}</span>
                    <span className="text-muted-foreground">{formatNumber(d.encounters)} ({d.pctOfTotal.toFixed(1)}%) | Margin: {formatCurrency(d.margin)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">LOB Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={lobData} dataKey="encounters" nameKey="lob" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                      {lobData.map((entry, i) => (
                        <Cell key={entry.lob} fill={LOB_COLORS[entry.lob] || DIMENSION_COLORS[i % DIMENSION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [formatNumber(value), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "var(--foreground)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 border-t border-border pt-2">
                {lobData.map(d => (
                  <div key={d.lob} className="flex items-center justify-between py-1 text-[10px]">
                    <span className="text-foreground font-medium">{d.lob}</span>
                    <span className="text-muted-foreground">{formatNumber(d.encounters)} enc | Rev: {formatCurrency(d.revenue)} | Margin: {formatCurrency(d.margin)}</span>
                  </div>
                ))}
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
              <p className="text-xs font-semibold text-foreground mb-1">Service Line</p>
              <MultiSelectFilter options={filterOpts.serviceLines} selected={selectedServiceLines} onChange={setSelectedServiceLines} placeholder="All" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
