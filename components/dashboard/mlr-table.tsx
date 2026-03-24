"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { aggregateMLRData, getFilterOptions } from "@/lib/data/mlr-data"
  import { useGlobalFilters } from "@/contexts/global-filters-context"
import { MultiSelectFilter } from "@/components/ui/multi-select-filter"
  
  type SortColumn = "year" | "lob" | "sublob" | "memberMonths" | "revenue" | "pmpmRevenue" | "cost" | "pmpmCost" | "mlr"
  type SortDirection = "asc" | "desc"
  type SortCriteria = { column: SortColumn; direction: SortDirection }
  
  const filterOptions = getFilterOptions()

function getMlrColor(mlr: number): string {
  if (mlr > 100) return "bg-red-500/80 text-white"
  if (mlr >= 95) return "bg-amber-500/80 text-white"
  if (mlr >= 90) return "bg-lime-500/80 text-foreground"
  return "bg-green-500/80 text-white"
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  }
  return `$${value.toLocaleString()}`
}

function formatMemberMonths(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

export function MLRTable() {
  const [includeIBNR, setIncludeIBNR] = useState(false)
  const {
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
  const setLobFilter = handleLobChange
  const setSublobFilter = handleSublobChange
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([
    { column: "year", direction: "desc" },
    { column: "lob", direction: "asc" },
    { column: "sublob", direction: "asc" },
  ])

  const handleSort = (column: SortColumn, event: React.MouseEvent) => {
    if (event.shiftKey) {
      // Shift+click: add to sort criteria or toggle direction
      setSortCriteria((prev) => {
        const existingIndex = prev.findIndex((s) => s.column === column)
        if (existingIndex >= 0) {
          // Toggle direction
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            direction: updated[existingIndex].direction === "asc" ? "desc" : "asc",
          }
          return updated
        }
        // Add new column
        return [...prev, { column, direction: "desc" }]
      })
    } else {
      // Regular click: single column sort or toggle direction
      setSortCriteria((prev) => {
        if (prev.length === 1 && prev[0].column === column) {
          return [{ column, direction: prev[0].direction === "asc" ? "desc" : "asc" }]
        }
        return [{ column, direction: "desc" }]
      })
    }
  }

  const clearSort = () => {
    setSortCriteria([])
  }

  const getSortIndex = (column: SortColumn): number => {
    return sortCriteria.findIndex((s) => s.column === column)
  }

  const getSortDirection = (column: SortColumn): SortDirection | null => {
    const criteria = sortCriteria.find((s) => s.column === column)
    return criteria?.direction ?? null
  }

  const SortIcon = ({ column }: { column: SortColumn }) => {
    const index = getSortIndex(column)
    const direction = getSortDirection(column)
    
    if (index < 0) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    }
    
    return (
      <span className="ml-1 inline-flex items-center gap-0.5">
        {sortCriteria.length > 1 && (
          <span className="text-[10px] font-bold text-primary">{index + 1}</span>
        )}
        {direction === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
      </span>
    )
  }

  const { years, lobs, sublobs } = filterOptions

const filteredData = useMemo(() => {
  const mlrData = aggregateMLRData("year", centralFilters)
  let data = mlrData.map((row) => {
      // Apply IBNR adjustment if includeIBNR is true
      // IBNR increases cost for recent years: 2025 ~1% MLR increase, 2024 ~0.1% MLR increase
      if (includeIBNR) {
        let ibnrMultiplier = 1
        if (row.year === 2025) {
          // ~1% MLR increase means cost increases by ~1% of revenue
          ibnrMultiplier = 1 + (0.01 * row.revenue) / row.cost
        } else if (row.year === 2024) {
          // ~0.1% MLR increase means cost increases by ~0.1% of revenue
          ibnrMultiplier = 1 + (0.001 * row.revenue) / row.cost
        }
        
        const adjustedCost = Math.round(row.cost * ibnrMultiplier)
        const adjustedPmpmCost = adjustedCost / row.memberMonths
        const adjustedMlr = (adjustedCost / row.revenue) * 100
        
        return {
          ...row,
          cost: adjustedCost,
          pmpmCost: adjustedPmpmCost,
          mlr: adjustedMlr,
        }
      }
      return row
    })

    if (yearFilter !== "all") {
      data = data.filter((d) => d.year === parseInt(yearFilter))
    }
    if (lobFilter !== "all") {
      data = data.filter((d) => d.lob === lobFilter)
    }
    if (sublobFilter !== "all") {
      data = data.filter((d) => d.sublob === sublobFilter)
    }

    // Sort based on selected column and direction
    data.sort((a, b) => {
      let comparison = 0
      
      for (const criteria of sortCriteria) {
        switch (criteria.column) {
          case "year":
            comparison = a.year - b.year
            break
          case "lob":
            comparison = a.lob.localeCompare(b.lob)
            break
          case "sublob":
            comparison = a.sublob.localeCompare(b.sublob)
            break
          case "memberMonths":
            comparison = a.memberMonths - b.memberMonths
            break
          case "revenue":
            comparison = a.revenue - b.revenue
            break
          case "pmpmRevenue":
            comparison = a.pmpmRevenue - b.pmpmRevenue
            break
          case "cost":
            comparison = a.cost - b.cost
            break
          case "pmpmCost":
            comparison = a.pmpmCost - b.pmpmCost
            break
          case "mlr":
            comparison = a.mlr - b.mlr
            break
        }
        
        if (comparison !== 0) {
          return criteria.direction === "asc" ? comparison : -comparison
        }
      }

      return 0
    })

    return data
  }, [yearFilter, lobFilter, sublobFilter, includeIBNR, sortCriteria, centralFilters])

  return (
    <div className="flex gap-6">
      {/* Main Table */}
      <Card className="flex-1 bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                Yearly MLR by Sub line of business {includeIBNR ? "(includes IBNR)" : "(excludes IBNR)"}
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Click column to sort. Shift+click to add multiple sort columns.
                {sortCriteria.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSort}
                    className="ml-2 text-primary hover:underline"
                  >
                    Clear sort ({sortCriteria.length})
                  </button>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={!includeIBNR ? "default" : "outline"}
                size="sm"
                onClick={() => setIncludeIBNR(false)}
                className={cn(
                  "text-sm",
                  !includeIBNR && "bg-primary text-primary-foreground"
                )}
              >
                Exclude IBNR
              </Button>
              <Button
                variant={includeIBNR ? "default" : "outline"}
                size="sm"
                onClick={() => setIncludeIBNR(true)}
                className={cn(
                  "text-sm",
                  includeIBNR && "bg-primary text-primary-foreground"
                )}
              >
                Include IBNR
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead 
                    className="text-muted-foreground font-semibold whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("year", event)}
                  >
                    <div className="flex items-center">
                      YEAR (date of service)
                      <SortIcon column="year" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("lob", event)}
                  >
                    <div className="flex items-center">
                      lob
                      <SortIcon column="lob" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("sublob", event)}
                  >
                    <div className="flex items-center">
                      sublob
                      <SortIcon column="sublob" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("memberMonths", event)}
                  >
                    <div className="flex items-center justify-end">
                      Member Months
                      <SortIcon column="memberMonths" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("revenue", event)}
                  >
                    <div className="flex items-center justify-end">
                      Revenue
                      <SortIcon column="revenue" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("pmpmRevenue", event)}
                  >
                    <div className="flex items-center justify-end">
                      PMPM (Revenue)
                      <SortIcon column="pmpmRevenue" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("cost", event)}
                  >
                    <div className="flex items-center justify-end">
                      Cost
                      <SortIcon column="cost" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("pmpmCost", event)}
                  >
                    <div className="flex items-center justify-end">
                      PMPM (Cost)
                      <SortIcon column="pmpmCost" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground font-semibold text-right whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                    onClick={(event) => handleSort("mlr", event)}
                  >
                    <div className="flex items-center justify-end">
                      MLR (Cost/Revenue)
                      <SortIcon column="mlr" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={`${row.year}-${row.lob}-${row.sublob}-${index}`}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell className="font-medium text-foreground">{row.year}</TableCell>
                    <TableCell className="text-foreground">{row.lob}</TableCell>
                    <TableCell className="text-foreground">{row.sublob}</TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {formatMemberMonths(row.memberMonths)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {formatCurrency(row.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      ${row.pmpmRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {formatCurrency(row.cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      ${row.pmpmCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right p-0">
                      <div
                        className={cn(
                          "px-3 py-2 font-semibold font-mono text-sm",
                          getMlrColor(row.mlr)
                        )}
                      >
                        {row.mlr.toFixed(1)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Sidebar */}
      <div className="w-72 space-y-6">
        {/* Global Filters */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-primary">Global Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">YEAR (date of service)</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">lob</label>
              <Select value={lobFilter} onValueChange={setLobFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {availableLobs.map((lob) => (
                    <SelectItem key={lob} value={lob}>
                      {lob}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">sublob</label>
              <Select value={sublobFilter} onValueChange={setSublobFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
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
            />

            <MultiSelectFilter
              label="Consumer Region"
              options={availableConsumerRegions}
              selected={selectedConsumerRegions}
              onChange={setSelectedConsumerRegions}
            />
          </CardContent>
        </Card>

        {/* Local Filters */}
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-primary">Local Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">payercode</label>
              <Select value={payercodeFilter} onValueChange={setPayercodeFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
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
