"use client"

import { useGlobalFilters } from "@/contexts/global-filters-context"

// This hook now uses the global filters context
// All filter state is shared across pages
export function useCascadingFilters() {
  const {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
  } = useGlobalFilters()

  return {
    lobFilter,
    sublobFilter,
    availableLobs,
    availableSublobs,
    handleLobChange,
    handleSublobChange,
    setLobFilter: handleLobChange,
    setSublobFilter: handleSublobChange,
  }
}
