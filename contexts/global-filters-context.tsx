"use client"

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react"
import {
  getFilterOptions,
  marketRegionServiceAreaOntology,
  type AggregationLevel,
} from "@/lib/data/mlr-data"

const filterOptions = getFilterOptions()

// Get LOB-Sublob mappings from the filter options
const lobSublobMap: Record<string, string[]> = {
  COMMERCIAL: ["Fully Insured Individual", "Large Group", "Small Group"],
  MEDICAID: ["MLTSS", "Managed Care Medicaid"],
  MEDICARE: ["DSNP", "Medicare Advantage"],
}

// Reverse mapping: sublob to lob
const sublobLobMap: Record<string, string> = {}
for (const [lob, sublobs] of Object.entries(lobSublobMap)) {
  for (const sublob of sublobs) {
    sublobLobMap[sublob] = lob
  }
}

interface GlobalFiltersContextType {
  // Core filters
  yearFilter: string
  setYearFilter: (value: string) => void
  lobFilter: string
  sublobFilter: string
  handleLobChange: (value: string) => void
  handleSublobChange: (value: string) => void
  availableLobs: string[]
  availableSublobs: string[]
  
  // Aggregation level
  aggregationLevel: AggregationLevel
  setAggregationLevel: (value: AggregationLevel) => void
  
  // Additional filters - multi-select market/region/service area
  // Empty array = "all" (no filter applied)
  selectedConsumerMarkets: string[]
  setSelectedConsumerMarkets: (value: string[]) => void
  selectedConsumerRegions: string[]
  setSelectedConsumerRegions: (value: string[]) => void
  selectedServiceAreas: string[]
  setSelectedServiceAreas: (value: string[]) => void
  availableConsumerMarkets: string[]
  availableConsumerRegions: string[]
  availableServiceAreas: string[]
  // Convenience object for passing to data functions
  geoFilters: { consumerMarkets?: string[]; consumerRegions?: string[]; serviceAreas?: string[] } | undefined
  // Full central filters object for passing to all data functions
  centralFilters: import("@/lib/data/mlr-data").CentralDataFilters
  payercodeFilter: string
  setPayercodeFilter: (value: string) => void
  
  // Chronic condition filters
  hyperTensionFilter: string
  setHyperTensionFilter: (value: string) => void
  depressionFilter: string
  setDepressionFilter: (value: string) => void
  hyperlipidFilter: string
  setHyperlipidFilter: (value: string) => void
  diabetesFilter: string
  setDiabetesFilter: (value: string) => void
  tobaccoFilter: string
  setTobaccoFilter: (value: string) => void
  obesityFilter: string
  setObesityFilter: (value: string) => void
  anxietyFilter: string
  setAnxietyFilter: (value: string) => void
  depressiveFilter: string
  setDepressiveFilter: (value: string) => void
  
  // Reset all filters
  resetAllFilters: () => void
}

const GlobalFiltersContext = createContext<GlobalFiltersContextType | undefined>(undefined)

export function GlobalFiltersProvider({ children }: { children: ReactNode }) {
  // Core filters
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [lobFilter, setLobFilter] = useState<string>("all")
  const [sublobFilter, setSublobFilter] = useState<string>("all")
  const [aggregationLevel, setAggregationLevel] = useState<AggregationLevel>("quarter")
  
  // Additional filters - multi-select market/region/service area (empty = all)
  const [selectedConsumerMarkets, setSelectedConsumerMarkets] = useState<string[]>([])
  const [selectedConsumerRegions, setSelectedConsumerRegions] = useState<string[]>([])
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([])
  const [payercodeFilter, setPayercodeFilter] = useState<string>("all")

  // Cascading available lists: each geo filter narrows the others based on the ontology
  const availableConsumerMarkets = useMemo(() => {
    let entries = marketRegionServiceAreaOntology
    if (selectedConsumerRegions.length > 0) {
      entries = entries.filter((o) => selectedConsumerRegions.includes(o.region))
    }
    if (selectedServiceAreas.length > 0) {
      entries = entries.filter((o) => selectedServiceAreas.includes(o.serviceArea))
    }
    return [...new Set(entries.map((o) => o.market))].sort()
  }, [selectedConsumerRegions, selectedServiceAreas])

  const availableConsumerRegions = useMemo(() => {
    let entries = marketRegionServiceAreaOntology
    if (selectedConsumerMarkets.length > 0) {
      entries = entries.filter((o) => selectedConsumerMarkets.includes(o.market))
    }
    if (selectedServiceAreas.length > 0) {
      entries = entries.filter((o) => selectedServiceAreas.includes(o.serviceArea))
    }
    return [...new Set(entries.map((o) => o.region))].sort()
  }, [selectedConsumerMarkets, selectedServiceAreas])

  const availableServiceAreas = useMemo(() => {
    let entries = marketRegionServiceAreaOntology
    if (selectedConsumerMarkets.length > 0) {
      entries = entries.filter((o) => selectedConsumerMarkets.includes(o.market))
    }
    if (selectedConsumerRegions.length > 0) {
      entries = entries.filter((o) => selectedConsumerRegions.includes(o.region))
    }
    return [...new Set(entries.map((o) => o.serviceArea))].sort()
  }, [selectedConsumerMarkets, selectedConsumerRegions])
  
  // Chronic condition filters
  const [hyperTensionFilter, setHyperTensionFilter] = useState<string>("all")
  const [depressionFilter, setDepressionFilter] = useState<string>("all")
  const [hyperlipidFilter, setHyperlipidFilter] = useState<string>("all")
  const [diabetesFilter, setDiabetesFilter] = useState<string>("all")
  const [tobaccoFilter, setTobaccoFilter] = useState<string>("all")
  const [obesityFilter, setObesityFilter] = useState<string>("all")
  const [anxietyFilter, setAnxietyFilter] = useState<string>("all")
  const [depressiveFilter, setDepressiveFilter] = useState<string>("all")

  // Cascading filter options - sublobs depend on selected LOB and vice versa
  const availableLobs = useMemo(() => {
  if (sublobFilter === "all") {
  return [...filterOptions.lobs].sort()
  }
  const lob = sublobLobMap[sublobFilter]
  return lob ? [lob] : [...filterOptions.lobs].sort()
  }, [sublobFilter])

  const availableSublobs = useMemo(() => {
  if (lobFilter === "all") {
  return [...filterOptions.sublobs].sort()
  }
  return [...(lobSublobMap[lobFilter] || filterOptions.sublobs)].sort()
  }, [lobFilter])

  const handleLobChange = useCallback((value: string) => {
    setLobFilter(value)
    if (value !== "all" && sublobFilter !== "all") {
      const validSublobs = lobSublobMap[value] || []
      if (!validSublobs.includes(sublobFilter)) {
        setSublobFilter("all")
      }
    }
  }, [sublobFilter])

  const handleSublobChange = useCallback((value: string) => {
    setSublobFilter(value)
    if (value !== "all" && lobFilter !== "all") {
      const validLob = sublobLobMap[value]
      if (validLob && validLob !== lobFilter) {
        setLobFilter("all")
      }
    }
  }, [lobFilter])

  const resetAllFilters = useCallback(() => {
    setYearFilter("all")
    setLobFilter("all")
    setSublobFilter("all")
    setAggregationLevel("quarter")
    setSelectedConsumerMarkets([])
    setSelectedConsumerRegions([])
    setSelectedServiceAreas([])
    setPayercodeFilter("all")
    setHyperTensionFilter("all")
    setDepressionFilter("all")
    setHyperlipidFilter("all")
    setDiabetesFilter("all")
    setTobaccoFilter("all")
    setObesityFilter("all")
    setAnxietyFilter("all")
    setDepressiveFilter("all")
  }, [])

  // Build geoFilters object for data functions - undefined if all filters are empty (= all)
  const geoFilters = useMemo(() => {
    const geo: { consumerMarkets?: string[]; consumerRegions?: string[]; serviceAreas?: string[] } = {}
    if (selectedConsumerMarkets.length > 0) geo.consumerMarkets = selectedConsumerMarkets
    if (selectedConsumerRegions.length > 0) geo.consumerRegions = selectedConsumerRegions
    if (selectedServiceAreas.length > 0) geo.serviceAreas = selectedServiceAreas
    return Object.keys(geo).length > 0 ? geo : undefined
  }, [selectedConsumerMarkets, selectedConsumerRegions, selectedServiceAreas])

  // Build full centralFilters object from all filter state
  const centralFilters = useMemo(() => {
    const f: import("@/lib/data/mlr-data").CentralDataFilters = {}
    if (yearFilter !== "all") f.years = [Number.parseInt(yearFilter)]
    if (lobFilter !== "all") f.lobs = [lobFilter]
    if (sublobFilter !== "all") f.sublobs = [sublobFilter]
    if (geoFilters) f.geo = geoFilters
    // Chronic condition filters
    const chronicConditions: Record<string, boolean> = {}
    if (hyperTensionFilter !== "all") chronicConditions.hyperTension = hyperTensionFilter === "yes"
    if (depressionFilter !== "all") chronicConditions.depression = depressionFilter === "yes"
    if (hyperlipidFilter !== "all") chronicConditions.hyperlipidemia = hyperlipidFilter === "yes"
    if (diabetesFilter !== "all") chronicConditions.diabetes = diabetesFilter === "yes"
    if (tobaccoFilter !== "all") chronicConditions.tobaccoUse = tobaccoFilter === "yes"
    if (obesityFilter !== "all") chronicConditions.obesity = obesityFilter === "yes"
    if (anxietyFilter !== "all") chronicConditions.anxietyDisorders = anxietyFilter === "yes"
    if (depressiveFilter !== "all") chronicConditions.depressiveDisorder = depressiveFilter === "yes"
    if (Object.keys(chronicConditions).length > 0) f.chronicConditions = chronicConditions
    return f
  }, [yearFilter, lobFilter, sublobFilter, geoFilters, hyperTensionFilter, depressionFilter, hyperlipidFilter, diabetesFilter, tobaccoFilter, obesityFilter, anxietyFilter, depressiveFilter])

  const value = useMemo(() => ({
    yearFilter,
    setYearFilter,
    lobFilter,
    sublobFilter,
    handleLobChange,
    handleSublobChange,
    availableLobs,
    availableSublobs,
    aggregationLevel,
    setAggregationLevel,
    selectedConsumerMarkets,
    setSelectedConsumerMarkets,
    selectedConsumerRegions,
    setSelectedConsumerRegions,
    selectedServiceAreas,
    setSelectedServiceAreas,
    availableConsumerMarkets,
    availableConsumerRegions,
    availableServiceAreas,
    geoFilters,
    centralFilters,
    payercodeFilter,
    setPayercodeFilter,
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
    resetAllFilters,
  }), [
    yearFilter,
    lobFilter,
    sublobFilter,
    handleLobChange,
    handleSublobChange,
    availableLobs,
    availableSublobs,
    aggregationLevel,
    selectedConsumerMarkets,
    selectedConsumerRegions,
    selectedServiceAreas,
    availableConsumerMarkets,
    availableConsumerRegions,
    availableServiceAreas,
    geoFilters,
    centralFilters,
    payercodeFilter,
    hyperTensionFilter,
    depressionFilter,
    hyperlipidFilter,
    diabetesFilter,
    tobaccoFilter,
    obesityFilter,
    anxietyFilter,
    depressiveFilter,
    resetAllFilters,
  ])

  return (
    <GlobalFiltersContext.Provider value={value}>
      {children}
    </GlobalFiltersContext.Provider>
  )
}

export function useGlobalFilters() {
  const context = useContext(GlobalFiltersContext)
  if (context === undefined) {
    throw new Error("useGlobalFilters must be used within a GlobalFiltersProvider")
  }
  return context
}
