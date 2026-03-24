"use client"

import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import type { CareDeliveryFilters } from "@/lib/data/care-delivery-data"

interface CareDeliveryFiltersState {
  // Global filters (shared across all care delivery views)
  yearFilter: string
  setYearFilter: (v: string) => void
  selectedFacilities: string[]
  setSelectedFacilities: (v: string[]) => void
  selectedLobs: string[]
  setSelectedLobs: (v: string[]) => void
  // Computed filter object for data queries
  globalFilters: CareDeliveryFilters
}

const CareDeliveryFiltersCtx = createContext<CareDeliveryFiltersState | null>(null)

export function CareDeliveryFiltersProvider({ children }: { children: ReactNode }) {
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [selectedLobs, setSelectedLobs] = useState<string[]>([])

  const globalFilters = useMemo((): CareDeliveryFilters => {
    const f: CareDeliveryFilters = {}
    if (yearFilter !== "all") f.years = [Number(yearFilter)]
    if (selectedFacilities.length) f.facilities = selectedFacilities
    if (selectedLobs.length) f.lobs = selectedLobs
    return f
  }, [yearFilter, selectedFacilities, selectedLobs])

  return (
    <CareDeliveryFiltersCtx.Provider value={{
      yearFilter, setYearFilter,
      selectedFacilities, setSelectedFacilities,
      selectedLobs, setSelectedLobs,
      globalFilters,
    }}>
      {children}
    </CareDeliveryFiltersCtx.Provider>
  )
}

export function useCareDeliveryFilters() {
  const ctx = useContext(CareDeliveryFiltersCtx)
  if (!ctx) throw new Error("useCareDeliveryFilters must be used within CareDeliveryFiltersProvider")
  return ctx
}
