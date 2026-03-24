"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
import { mckinseyDataViz, mckinseyGrays } from "@/lib/colors/mckinsey-palette"
import {
  getCareDeliveryFilterOptions, getCareDeliveryByFacility,
  type CareDeliveryFilters,
} from "@/lib/data/care-delivery-data"
import { useCareDeliveryFilters } from "@/contexts/care-delivery-filters-context"

const filterOpts = getCareDeliveryFilterOptions()

const formatCurrency = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}
const formatNumber = (n: number) => Math.round(n).toLocaleString()
const formatK = (n: number) => {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(Math.round(n))
}

const COLORS = {
  encounters: mckinseyGrays.gray3,
  revenue: mckinseyDataViz.teal,
  cost: mckinseyDataViz.darkTeal,
  marginPositive: mckinseyDataViz.midTeal,
  marginNegative: mckinseyDataViz.coral,
}

export function CareDeliveryFacility() {
  const { yearFilter, setYearFilter, selectedFacilities, setSelectedFacilities, selectedLobs, setSelectedLobs, globalFilters } = useCareDeliveryFilters()

  // Local filters
  const [selectedServiceLines, setSelectedServiceLines] = useState<string[]>([])
  const [selectedBillingTypes, setSelectedBillingTypes] = useState<string[]>([])
  const [selectedPatientTypes, setSelectedPatientTypes] = useState<string[]>([])

  const filters = useMemo((): CareDeliveryFilters => {
    const f: CareDeliveryFilters = { ...globalFilters }
    if (selectedServiceLines.length) f.serviceLines = selectedServiceLines
    if (selectedBillingTypes.length) f.billingTypes = selectedBillingTypes
    if (selectedPatientTypes.length) f.patientTypes = selectedPatientTypes
    return f
  }, [globalFilters, selectedServiceLines, selectedBillingTypes, selectedPatientTypes])

  const data = useMemo(() => getCareDeliveryByFacility(filters), [filters])

  const maxEncounters = useMemo(() => Math.max(...data.map(d => d.encounters), 1), [data])
  const maxAbsMargin = useMemo(() => Math.max(...data.map(d => Math.abs(d.margin)), 1), [data])

  return (
    <div className="flex gap-0 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <p className="text-sm italic text-muted-foreground">Care Delivery</p>
          <h2 className="text-lg font-bold text-foreground">Facility Performance</h2>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-2 mb-2 px-2">
          <div className="text-xs font-semibold text-foreground">Facility</div>
          <div className="text-xs font-semibold text-foreground text-center">Encounters</div>
          <div className="text-xs font-semibold text-foreground text-center">Revenue vs Cost ($)</div>
          <div className="text-xs font-semibold text-foreground text-center">Margin ($)</div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 px-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS.encounters }} /> Encounters</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS.revenue }} /> Revenue</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS.cost }} /> Cost</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS.marginPositive }} /> Positive Margin</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS.marginNegative }} /> Negative Margin</span>
        </div>

        {/* Facility Rows */}
        <div className="space-y-1">
          {data.map(facility => {
            const isPositive = facility.margin >= 0
            const marginColor = isPositive ? COLORS.marginPositive : COLORS.marginNegative
            const marginBarWidth = (Math.abs(facility.margin) / maxAbsMargin) * 100

            return (
              <Card key={facility.facilityName} className="border-border">
                <CardContent className="p-3">
                  <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-2 items-center">
                    {/* Facility Name + billing split */}
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">{facility.facilityName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatNumber(facility.encounters)} enc | HB: {facility.hbPct.toFixed(0)}% | PB: {facility.pbPct.toFixed(0)}%
                      </p>
                    </div>

                    {/* Encounters Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-6 rounded bg-muted/30 overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${(facility.encounters / maxEncounters) * 100}%`,
                            backgroundColor: COLORS.encounters,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-10 text-right">{formatK(facility.encounters)}</span>
                    </div>

                    {/* Revenue vs Cost Stacked Bar */}
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-6 rounded overflow-hidden flex">
                        <div
                          className="h-full flex items-center justify-center text-[9px] text-white font-medium"
                          style={{
                            width: `${(facility.revenue / (facility.revenue + facility.cost)) * 100}%`,
                            backgroundColor: COLORS.revenue,
                          }}
                        >
                          {formatCurrency(facility.revenue)}
                        </div>
                        <div
                          className="h-full flex items-center justify-center text-[9px] text-white font-medium"
                          style={{
                            width: `${(facility.cost / (facility.revenue + facility.cost)) * 100}%`,
                            backgroundColor: COLORS.cost,
                          }}
                        >
                          {formatCurrency(facility.cost)}
                        </div>
                      </div>
                    </div>

                    {/* Margin - single directional bar */}
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <>
                          <div className="flex-1 h-6 rounded bg-muted/20 overflow-hidden flex items-center">
                            <div className="h-full rounded" style={{ width: `${marginBarWidth}%`, backgroundColor: marginColor, minWidth: "4px" }} />
                            <span className="text-[9px] font-semibold ml-2 whitespace-nowrap" style={{ color: marginColor }}>{formatCurrency(facility.margin)}</span>
                          </div>
                          <span className="text-[10px] font-semibold w-12 text-right shrink-0" style={{ color: marginColor }}>{facility.marginPct.toFixed(1)}%</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-semibold w-12 text-left shrink-0" style={{ color: marginColor }}>{facility.marginPct.toFixed(1)}%</span>
                          <div className="flex-1 h-6 rounded bg-muted/20 overflow-hidden flex items-center justify-end">
                            <span className="text-[9px] font-semibold mr-2 whitespace-nowrap" style={{ color: marginColor }}>{formatCurrency(facility.margin)}</span>
                            <div className="h-full rounded" style={{ width: `${marginBarWidth}%`, backgroundColor: marginColor, minWidth: "4px" }} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
