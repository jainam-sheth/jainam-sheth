"use client"

import { CareDeliveryFiltersProvider } from "@/contexts/care-delivery-filters-context"

export default function CareDeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <CareDeliveryFiltersProvider>
      {children}
    </CareDeliveryFiltersProvider>
  )
}
