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
import { getFilterOptions, getMLRByRegionsData, getMLRTableData, getChronicConditionCounts, serviceAreas, type MLRByRegionRow } from "@/lib/data/mlr-data"
import { Checkbox } from "@/components/ui/checkbox"
import { useGlobalFilters } from "@/contexts/global-filters-context"
import { mckinseyDataViz, mckinseyCore } from "@/lib/colors/mckinsey-palette"


const filterOptions = getFilterOptions()

// Chronic conditions list for display
const chronicConditionsList = [
  { key: "anxietyDisorders", name: "Anxiety Disorders" },
  { key: "depression", name: "Depression" },
  { key: "depressiveDisorder", name: "Depressive Disorder" },
  { key: "diabetes", name: "Diabetes" },
  { key: "hyperTension", name: "Hyper Tension" },
  { key: "hyperlipidemia", name: "Hyperlipidemia" },
  { key: "obesity", name: "Obesity" },
  { key: "tobaccoUse", name: "Tobacco Use" },
]

const formatCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(2)}M`
  }
  return `${Math.round(count / 1000)}K`
}

const getMlrBgColor = (value: number) => {
  if (value < 70) return mckinseyDataViz.midTeal
  if (value < 85) return mckinseyDataViz.brightBlue
  if (value < 90) return mckinseyDataViz.lavender
  if (value < 100) return mckinseyDataViz.peach
  return mckinseyDataViz.coral
}

const getMlrTextColor = (value: number) => {
  if (value < 70) return "#FFFFFF"
  if (value < 85) return "#FFFFFF"
  if (value < 90) return mckinseyCore.navy
  if (value < 100) return mckinseyCore.navy
  return "#FFFFFF"
}

export function ChronicConditionsDashboard() {
  const {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    yearFilter,
    setYearFilter,
    hyperTensionFilter,
    setHyperTensionFilter,
    depressionFilter,
    setDepressionFilter,
    hyperlipidFilter,
    setHyperlipidFilter,
    diabetesFilter,
    setDiabetesFilter,
    tobaccoFilter,
    setTobaccoFilter,
    obesityFilter,
    setObesityFilter,
    anxietyFilter,
    setAnxietyFilter,
    depressiveFilter,
    setDepressiveFilter,
    centralFilters,
  } = useGlobalFilters()
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<Set<string>>(new Set(serviceAreas))

  // Get chronic condition counts from central data (respects all filters + local service area)
  const baseChronicCounts = useMemo(() => {
    // Merge local service area selection into centralFilters
    const localServiceAreas = selectedServiceAreas.size < serviceAreas.length
      ? [...selectedServiceAreas]
      : undefined
    const mergedFilters: typeof centralFilters = localServiceAreas
      ? {
          ...centralFilters,
          geo: {
            ...centralFilters.geo,
            serviceAreas: localServiceAreas,
          },
        }
      : centralFilters
    return getChronicConditionCounts(mergedFilters)
  }, [centralFilters, selectedServiceAreas])

  // Filter MLR data based on all filters - uses centralFilters from context for core filters
  // plus local selectedServiceAreas for the multi-select checkboxes
  const filteredMlrData = useMemo(() => {
    const data = getMLRByRegionsData(centralFilters)
    // Apply local service area multi-select filter
    if (selectedServiceAreas.size < serviceAreas.length) {
      return data.filter(row => selectedServiceAreas.has(row.serviceArea))
    }
    return data
  }, [centralFilters, selectedServiceAreas])

  // Get table data aggregated with regional columns
  const tableData = useMemo(() => getMLRTableData(filteredMlrData), [filteredMlrData])

  // Helper to compute rolled-up region averages from a set of sublob rows
  const rollupRegions = (rows: typeof tableData) => {
    const regionSums = { centralVirginia: 0, greaterHamptonRoads: 0, northernVirginia: 0, southwestVirginia: 0, westernVirginia: 0 }
    const regionCounts = { centralVirginia: 0, greaterHamptonRoads: 0, northernVirginia: 0, southwestVirginia: 0, westernVirginia: 0 }
    for (const row of rows) {
      for (const key of Object.keys(regionSums) as (keyof typeof regionSums)[]) {
        if (row[key] > 0) {
          regionSums[key] += row[key]
          regionCounts[key]++
        }
      }
    }
    const avg = (k: keyof typeof regionSums) => regionCounts[k] > 0 ? Math.round(regionSums[k] / regionCounts[k]) : 0
    const regions = { centralVirginia: avg("centralVirginia"), greaterHamptonRoads: avg("greaterHamptonRoads"), northernVirginia: avg("northernVirginia"), southwestVirginia: avg("southwestVirginia"), westernVirginia: avg("westernVirginia") }
    const vals = Object.values(regions).filter(v => v > 0)
    const total = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    return { ...regions, total }
  }

  // Group table data by year and lob for hierarchical display
  const groupedData = useMemo(() => {
    const years = [...new Set(tableData.map(d => d.year))].sort()
    return years.map(year => {
      const yearData = tableData.filter(d => d.year === year)
      const lobs = [...new Set(yearData.map(d => d.lob))]
      const yearRollup = rollupRegions(yearData)
      return {
        year,
        rollup: yearRollup,
        lobs: lobs.map(lob => {
          const lobData = yearData.filter(d => d.lob === lob)
          const lobRollup = rollupRegions(lobData)
          return {
            lob,
            rollup: lobRollup,
            sublobs: lobData,
          }
        })
      }
    })
  }, [tableData])
  
  // Toggle service area selection
  const toggleServiceArea = (area: string) => {
    const newSelected = new Set(selectedServiceAreas)
    if (newSelected.has(area)) {
      newSelected.delete(area)
    } else {
      newSelected.add(area)
    }
    setSelectedServiceAreas(newSelected)
  }

  // Track expanded state for years and lobs
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const [expandedLobs, setExpandedLobs] = useState<Set<string>>(new Set())

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const toggleLob = (year: number, lob: string) => {
    const key = `${year}-${lob}`
    const newExpanded = new Set(expandedLobs)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedLobs(newExpanded)
  }

  // Use baseChronicCounts (derived from the central expanded data with correct per-row flags)
  const chronicConditions = useMemo(() => [
    { name: "Anxiety Disorders", count: baseChronicCounts.anxietyDisorders },
    { name: "Depression", count: baseChronicCounts.depression },
    { name: "Depressive Disorder", count: baseChronicCounts.depressiveDisorder },
    { name: "Diabetes", count: baseChronicCounts.diabetes },
    { name: "Hyper Tension", count: baseChronicCounts.hyperTension },
    { name: "Hyperlipidemia", count: baseChronicCounts.hyperlipidemia },
    { name: "Obesity", count: baseChronicCounts.obesity },
    { name: "Tobacco Use", count: baseChronicCounts.tobaccoUse },
  ], [baseChronicCounts])

  const totalUniqueMembers = baseChronicCounts.totalUniqueMembers

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6 overflow-auto">
        {/* Member counts with Chronic Conditions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Member counts with Chronic Conditions (# of Unique Members)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {/* First row of conditions */}
              {chronicConditions.slice(0, 4).map((condition) => (
                <Card key={condition.name} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{condition.name}</div>
                    <div className="text-3xl font-bold text-foreground">{formatCount(condition.count)}</div>
                  </CardContent>
                </Card>
              ))}
              {/* Highlighted total members card */}
              <Card className="border-0" style={{ backgroundColor: mckinseyDataViz.coral }}>
                <CardContent className="p-4">
                  <div className="text-sm mb-1" style={{ color: "#FFFFFF" }}># Unique Members</div>
                  <div className="text-3xl font-bold" style={{ color: "#FFFFFF" }}>{formatCount(totalUniqueMembers)}</div>
                </CardContent>
              </Card>
              {/* Second row of conditions */}
              {chronicConditions.slice(4).map((condition) => (
                <Card key={condition.name} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{condition.name}</div>
                    <div className="text-3xl font-bold text-foreground">{formatCount(condition.count)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MLR by regions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground underline">
              MLR by regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium text-muted-foreground">YEAR (date of service)</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">lob</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">sublob</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Central Region</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Eastern Region</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Northern Region</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Southwest Region</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Western Region</th>
                    <th className="text-center p-2 font-medium text-foreground font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData.map((yearGroup) => (
                    <>
                      {/* Year row */}
                      <tr 
                        key={`year-${yearGroup.year}`} 
                        className="border-b border-border cursor-pointer hover:bg-secondary/50 font-semibold"
                        onClick={() => toggleYear(yearGroup.year)}
                      >
                        <td className="p-2 font-semibold text-foreground">
                          <span className="mr-2">{expandedYears.has(yearGroup.year) ? "−" : "+"}</span>
                          {yearGroup.year}
                        </td>
                        <td className="p-2" />
                        <td className="p-2" />
                        <td className="p-1 text-center">
                          <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup.centralVirginia), color: getMlrTextColor(yearGroup.rollup.centralVirginia) }}>
                            {yearGroup.rollup.centralVirginia}%
                          </span>
                        </td>
                        <td className="p-1 text-center">
                          <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup.greaterHamptonRoads), color: getMlrTextColor(yearGroup.rollup.greaterHamptonRoads) }}>
                            {yearGroup.rollup.greaterHamptonRoads}%
                          </span>
                        </td>
                        <td className="p-1 text-center">
                          <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup.northernVirginia), color: getMlrTextColor(yearGroup.rollup.northernVirginia) }}>
                            {yearGroup.rollup.northernVirginia}%
                          </span>
                        </td>
                        <td className="p-1 text-center">
                          <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup.southwestVirginia), color: getMlrTextColor(yearGroup.rollup.southwestVirginia) }}>
                            {yearGroup.rollup.southwestVirginia}%
                          </span>
                        </td>
                        <td className="p-1 text-center">
                          <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(yearGroup.rollup.westernVirginia), color: getMlrTextColor(yearGroup.rollup.westernVirginia) }}>
                            {yearGroup.rollup.westernVirginia}%
                          </span>
                        </td>
                        <td className="p-2 text-center font-bold text-foreground">{yearGroup.rollup.total}%</td>
                      </tr>
                      {expandedYears.has(yearGroup.year) && yearGroup.lobs.map((lobGroup) => (
                        <>
                          {/* LOB row */}
                          <tr 
                            key={`lob-${yearGroup.year}-${lobGroup.lob}`} 
                            className="border-b border-border cursor-pointer hover:bg-secondary/50"
                            onClick={() => toggleLob(yearGroup.year, lobGroup.lob)}
                          >
                            <td className="p-2 pl-6" />
                            <td className="p-2 font-semibold text-foreground">
                              <span className="mr-2">{expandedLobs.has(`${yearGroup.year}-${lobGroup.lob}`) ? "−" : "+"}</span>
                              {lobGroup.lob}
                            </td>
                            <td className="p-2" />
                            <td className="p-1 text-center">
                              <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup.centralVirginia), color: getMlrTextColor(lobGroup.rollup.centralVirginia) }}>
                                {lobGroup.rollup.centralVirginia}%
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup.greaterHamptonRoads), color: getMlrTextColor(lobGroup.rollup.greaterHamptonRoads) }}>
                                {lobGroup.rollup.greaterHamptonRoads}%
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup.northernVirginia), color: getMlrTextColor(lobGroup.rollup.northernVirginia) }}>
                                {lobGroup.rollup.northernVirginia}%
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup.southwestVirginia), color: getMlrTextColor(lobGroup.rollup.southwestVirginia) }}>
                                {lobGroup.rollup.southwestVirginia}%
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <span className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]" style={{ backgroundColor: getMlrBgColor(lobGroup.rollup.westernVirginia), color: getMlrTextColor(lobGroup.rollup.westernVirginia) }}>
                                {lobGroup.rollup.westernVirginia}%
                              </span>
                            </td>
                            <td className="p-2 text-center font-bold text-foreground">{lobGroup.rollup.total}%</td>
                          </tr>
                          {expandedLobs.has(`${yearGroup.year}-${lobGroup.lob}`) && lobGroup.sublobs.map((row) => (
                            <tr key={`sublob-${yearGroup.year}-${lobGroup.lob}-${row.sublob}`} className="border-b border-border">
                              <td className="p-2" />
                              <td className="p-2" />
                              <td className="p-2 text-foreground">{row.sublob}</td>
                              <td className="p-1 text-center">
                                <span 
                                  className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]"
                                  style={{ backgroundColor: getMlrBgColor(row.centralVirginia), color: getMlrTextColor(row.centralVirginia) }}
                                >
                                  {row.centralVirginia}%
                                </span>
                              </td>
                              <td className="p-1 text-center">
                                <span 
                                  className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]"
                                  style={{ backgroundColor: getMlrBgColor(row.greaterHamptonRoads), color: getMlrTextColor(row.greaterHamptonRoads) }}
                                >
                                  {row.greaterHamptonRoads}%
                                </span>
                              </td>
                              <td className="p-1 text-center">
                                <span 
                                  className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]"
                                  style={{ backgroundColor: getMlrBgColor(row.northernVirginia), color: getMlrTextColor(row.northernVirginia) }}
                                >
                                  {row.northernVirginia}%
                                </span>
                              </td>
                              <td className="p-1 text-center">
                                <span 
                                  className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]"
                                  style={{ backgroundColor: getMlrBgColor(row.southwestVirginia), color: getMlrTextColor(row.southwestVirginia) }}
                                >
                                  {row.southwestVirginia}%
                                </span>
                              </td>
                              <td className="p-1 text-center">
                                <span 
                                  className="inline-block px-3 py-1 rounded text-sm font-medium min-w-[60px]"
                                  style={{ backgroundColor: getMlrBgColor(row.westernVirginia), color: getMlrTextColor(row.westernVirginia) }}
                                >
                                  {row.westernVirginia}%
                                </span>
                              </td>
                              <td className="p-2 text-center font-bold text-foreground">{row.total}%</td>
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
      <div className="w-64 shrink-0 space-y-4">
        {/* Global Filters */}
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Global Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
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
            </div>

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
                      id={`service-area-${area}`}
                      checked={selectedServiceAreas.has(area)}
                      onCheckedChange={() => toggleServiceArea(area)}
                      className="border-border"
                    />
                    <label 
                      htmlFor={`service-area-${area}`}
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

        {/* Chronic Condition Selector */}
        <Card className="bg-card border-border border-l-4" style={{ borderLeftColor: mckinseyDataViz.coral }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold" style={{ color: mckinseyDataViz.coral }}>Chronic Condition Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Hyper Tension</label>
                <Select value={hyperTensionFilter} onValueChange={setHyperTensionFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Depression</label>
                <Select value={depressionFilter} onValueChange={setDepressionFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Hyperlipidemia</label>
                <Select value={hyperlipidFilter} onValueChange={setHyperlipidFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Diabetes</label>
                <Select value={diabetesFilter} onValueChange={setDiabetesFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tobacco Use</label>
                <Select value={tobaccoFilter} onValueChange={setTobaccoFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Obesity</label>
                <Select value={obesityFilter} onValueChange={setObesityFilter}>
                  <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Anxiety Disorders</label>
              <Select value={anxietyFilter} onValueChange={setAnxietyFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Depressive Disorder</label>
              <Select value={depressiveFilter} onValueChange={setDepressiveFilter}>
                <SelectTrigger className="bg-secondary border-border text-foreground h-7 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
