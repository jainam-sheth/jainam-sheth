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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts"
import { getFilterOptions, getCostComponentData, type AggregationLevel } from "@/lib/data/mlr-data"
import { costComponentColors, medicalCostColors } from "@/lib/colors/mckinsey-palette"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"

const filterOptions = getFilterOptions()

type ViewMode = "percent" | "absolute" | "pmpm"

export function CostComponentSummary() {
  const [viewMode, setViewMode] = useState<ViewMode>("percent")
  const {
    aggregationLevel,
    setAggregationLevel,
    yearFilter,
    setYearFilter,
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    selectedConsumerMarkets,
    setSelectedConsumerMarkets,
    selectedConsumerRegions,
    setSelectedConsumerRegions,
    availableConsumerMarkets,
    availableConsumerRegions,
    geoFilters,
    centralFilters,
    payercodeFilter,
    setPayercodeFilter,
  } = useGlobalFilters()

  // Get cost component data from central source with all filters
  const chartData = useMemo(() => {
    return getCostComponentData(aggregationLevel, centralFilters)
  }, [aggregationLevel, centralFilters])

  const formatValue = (value: number, mode: ViewMode) => {
    if (mode === "percent") return `${value.toFixed(0)}%`
    if (mode === "pmpm") return `$${value.toFixed(0)}`
    return `$${(value / 1000000).toFixed(0)}M`
  }

  const formatYAxis = (value: number, mode: ViewMode) => {
    if (mode === "percent") return `${value}%`
    if (mode === "pmpm") return `$${value}`
    return `$${(value / 1000000000).toFixed(1)}bn`
  }

  // Get dataKeys based on view mode
  const getCostComponentKeys = () => {
    const suffix = viewMode === "percent" ? "Pct" : viewMode === "pmpm" ? "Pmpm" : ""
    return {
      medicalCost: viewMode === "percent" ? "medicalCostPct" : viewMode === "pmpm" ? "medicalCostPmpm" : "medicalCost",
      ibnr: viewMode === "percent" ? "ibnrPct" : viewMode === "pmpm" ? "ibnrPmpm" : "ibnr",
      rxCost: viewMode === "percent" ? "rxCostPct" : viewMode === "pmpm" ? "rxCostPmpm" : "rxCost",
      reinsurance: viewMode === "percent" ? "reinsurancePct" : viewMode === "pmpm" ? "reinsurancePmpm" : "reinsurance",
      supplementalBenefits: viewMode === "percent" ? "supplementalBenefitsPct" : viewMode === "pmpm" ? "supplementalBenefitsPmpm" : "supplementalBenefits",
      rxRebates: viewMode === "percent" ? "rxRebatesPct" : viewMode === "pmpm" ? "rxRebatesPmpm" : "rxRebates",
      transplantReimbursement: viewMode === "percent" ? "transplantReimbursementPct" : viewMode === "pmpm" ? "transplantReimbursementPmpm" : "transplantReimbursement",
      waiverCost: viewMode === "percent" ? "waiverCostPct" : viewMode === "pmpm" ? "waiverCostPmpm" : "waiverCost",
    }
  }

  const getMedicalCostKeys = () => {
    return {
      facilityInpatient: viewMode === "percent" ? "facilityInpatientPct" : viewMode === "pmpm" ? "facilityInpatientPmpm" : "facilityInpatient",
      facilityOutpatient: viewMode === "percent" ? "facilityOutpatientPct" : viewMode === "pmpm" ? "facilityOutpatientPmpm" : "facilityOutpatient",
      professional: viewMode === "percent" ? "professionalPct" : viewMode === "pmpm" ? "professionalPmpm" : "professional",
      others: viewMode === "percent" ? "othersPct" : viewMode === "pmpm" ? "othersPmpm" : "others",
    }
  }

  const costKeys = getCostComponentKeys()
  const medicalKeys = getMedicalCostKeys()

  const getYAxisDomain = () => {
    if (viewMode === "percent") return [0, 100]
    if (viewMode === "pmpm") return [0, 700]
    return [0, 'auto']
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null
    
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm py-0.5">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }} />
              <span className="text-muted-foreground">{entry.name}</span>
            </span>
            <span className="font-medium text-foreground">{formatValue(entry.value, viewMode)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Page Title with Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Cost Component Summary ({viewMode === "percent" ? "% view" : viewMode === "pmpm" ? "PMPM view" : "Absolute view"})
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">View by:</span>
            <Select value={aggregationLevel} onValueChange={(v) => setAggregationLevel(v as AggregationLevel)}>
              <SelectTrigger className="bg-secondary border-border text-foreground h-8 w-28 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex border border-border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("percent")}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                viewMode === "percent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Percent View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("absolute")}
              className={`px-6 py-2 text-sm font-medium transition-colors border-l border-r border-border ${
                viewMode === "absolute"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Absolute Numbers
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pmpm")}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                viewMode === "pmpm"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              PMPM
            </button>
          </div>
        </div>

        {/* Cost Component Summary Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground underline">
                Cost Component Summary ({viewMode === "percent" ? "%" : viewMode === "pmpm" ? "PMPM" : "$"} view)
              </CardTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="font-medium text-muted-foreground">Cost Components</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.ibnr }} />
                  <span className="text-muted-foreground">IBNR</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.medicalCost }} />
                  <span className="text-muted-foreground">Medical Cost</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.reinsurance }} />
                  <span className="text-muted-foreground">Reinsurance</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.rxCost }} />
                  <span className="text-muted-foreground">Rx Cost</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.rxRebates }} />
                  <span className="text-muted-foreground">Rx Rebates</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.supplementalBenefits }} />
                  <span className="text-muted-foreground">Supplemental Benefits</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.transplantReimbursement }} />
                  <span className="text-muted-foreground">Transplant Reimbursement</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: costComponentColors.waiverCost }} />
                  <span className="text-muted-foreground">Waiver Cost</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }} stackOffset={viewMode === "percent" ? "expand" : undefined}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval={aggregationLevel === "month" ? 2 : 0}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => viewMode === "percent" ? `${(v * 100).toFixed(0)}%` : formatYAxis(v, viewMode)}
                    domain={viewMode === "percent" ? [0, 1] : getYAxisDomain()}
                    label={{ 
                      value: 'Cost $', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={costKeys.medicalCost} name="Medical Cost" stackId="a" fill={costComponentColors.medicalCost}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "medicalCostPct" : costKeys.medicalCost} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={costKeys.ibnr} name="IBNR" stackId="a" fill={costComponentColors.ibnr}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "ibnrPct" : costKeys.ibnr} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={costKeys.rxCost} name="Rx Cost" stackId="a" fill={costComponentColors.rxCost}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "rxCostPct" : costKeys.rxCost} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 8, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={costKeys.reinsurance} name="Reinsurance" stackId="a" fill={costComponentColors.reinsurance} />
                  <Bar dataKey={costKeys.supplementalBenefits} name="Supplemental Benefits" stackId="a" fill={costComponentColors.supplementalBenefits} />
                  <Bar dataKey={costKeys.rxRebates} name="Rx Rebates" stackId="a" fill={costComponentColors.rxRebates} />
                  <Bar dataKey={costKeys.transplantReimbursement} name="Transplant Reimbursement" stackId="a" fill={costComponentColors.transplantReimbursement} />
                  <Bar dataKey={costKeys.waiverCost} name="Waiver Cost" stackId="a" fill={costComponentColors.waiverCost} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {aggregationLevel === "month" ? "MONTH" : aggregationLevel === "quarter" ? "QUARTER" : "YEAR"} (date of service)
            </div>
          </CardContent>
        </Card>

        {/* Medical Cost Component Summary Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground underline">
                Medical Cost Component Summary
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-medium text-muted-foreground">Detailed Cost Components</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: medicalCostColors.facilityInpatient }} />
                  <span className="text-muted-foreground">Facility Inpatient</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: medicalCostColors.facilityOutpatient }} />
                  <span className="text-muted-foreground">Facility Outpatient</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: medicalCostColors.others }} />
                  <span className="text-muted-foreground">Others</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: medicalCostColors.professional }} />
                  <span className="text-muted-foreground">Professional</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }} stackOffset={viewMode === "percent" ? "expand" : undefined}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval={aggregationLevel === "month" ? 2 : 0}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => viewMode === "percent" ? `${(v * 100).toFixed(0)}%` : formatYAxis(v, viewMode)}
                    domain={viewMode === "percent" ? [0, 1] : getYAxisDomain()}
                    label={{ 
                      value: 'Cost $', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'var(--muted-foreground)', fontSize: 11 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={medicalKeys.facilityInpatient} name="Facility Inpatient" stackId="a" fill={medicalCostColors.facilityInpatient}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "facilityInpatientPct" : medicalKeys.facilityInpatient} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={medicalKeys.facilityOutpatient} name="Facility Outpatient" stackId="a" fill={medicalCostColors.facilityOutpatient}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "facilityOutpatientPct" : medicalKeys.facilityOutpatient} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={medicalKeys.others} name="Others" stackId="a" fill={medicalCostColors.others}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "othersPct" : medicalKeys.others} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                  <Bar dataKey={medicalKeys.professional} name="Professional" stackId="a" fill={medicalCostColors.professional}>
                    <LabelList 
                      dataKey={viewMode === "percent" ? "professionalPct" : medicalKeys.professional} 
                      position="center" 
                      formatter={(v: number) => viewMode === "percent" ? `${v.toFixed(0)}%` : viewMode === "pmpm" ? `$${v.toFixed(0)}` : `$${(v / 1000000).toFixed(0)}M`}
                      style={{ fill: 'white', fontSize: 9, fontWeight: 500 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {aggregationLevel === "month" ? "MONTH" : aggregationLevel === "quarter" ? "QUARTER" : "YEAR"} (date of service)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-64 shrink-0">
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Filters</CardTitle>
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

            <MultiSelectFilter
              label="Consumer Market"
              options={availableConsumerMarkets}
              selected={selectedConsumerMarkets}
              onChange={setSelectedConsumerMarkets}
              compact
            />

            <MultiSelectFilter
              label="Consumer Region"
              options={availableConsumerRegions}
              selected={selectedConsumerRegions}
              onChange={setSelectedConsumerRegions}
              compact
            />

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">payercode</label>
              <Select value={payercodeFilter} onValueChange={setPayercodeFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
