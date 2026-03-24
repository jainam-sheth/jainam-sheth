// Shared MLR data for consistent numbers across all dashboard pages
// Base data is at MONTH level - the most granular level

export interface MLRMonthlyDataRow {
  year: number
  month: number // 1-12
  lob: string
  sublob: string
  memberMonths: number
  revenue: number
  cost: number
  pmpmRevenue?: number
  pmpmCost?: number
  consumerMarket: string
  consumerRegion: string
  serviceArea: string
  consumerCohort: string
  providerAttribution: string
  riskScore: number
  // Chronic condition flags
  hyperTension: boolean
  depression: boolean
  hyperlipidemia: boolean
  diabetes: boolean
  tobaccoUse: boolean
  obesity: boolean
  anxietyDisorders: boolean
  depressiveDisorder: boolean
}

// Geo filter interface shared across all data functions
export interface GeoFilters {
  consumerMarkets?: string[]
  consumerRegions?: string[]
  serviceAreas?: string[]
}

// Full filter interface shared across all data functions
export interface CentralDataFilters {
  years?: number[]
  lobs?: string[]
  sublobs?: string[]
  geo?: GeoFilters
  consumerCohorts?: string[]
  providerAttributions?: string[]
  chronicConditions?: Partial<Record<string, boolean>>
}

export type AggregationLevel = "month" | "quarter" | "year"

// Helper to get quarter from month
export function getQuarter(month: number): number {
  return Math.ceil(month / 3)
}

// Helper to get month name
export function getMonthName(month: number): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[month - 1]
}

// Sanitized demo data at MONTH level
export const mlrMonthlyData: MLRMonthlyDataRow[] = [
  // 2022
  // Medicare Medicare Advantage
  { year: 2022, month: 1, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9700, revenue: 8400000, pmpmRevenue: 865.98, cost: 9100000, pmpmCost: 938.14 },
  { year: 2022, month: 2, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9600, revenue: 8300000, pmpmRevenue: 864.58, cost: 8900000, pmpmCost: 927.08 },
  { year: 2022, month: 3, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9700, revenue: 8300000, pmpmRevenue: 855.67, cost: 9000000, pmpmCost: 927.84 },
  { year: 2022, month: 4, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 10000, revenue: 8700000, pmpmRevenue: 870.00, cost: 9400000, pmpmCost: 940.00 },
  { year: 2022, month: 5, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 10000, revenue: 8600000, pmpmRevenue: 860.00, cost: 9300000, pmpmCost: 930.00 },
  { year: 2022, month: 6, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 10000, revenue: 8700000, pmpmRevenue: 870.00, cost: 9300000, pmpmCost: 930.00 },
  { year: 2022, month: 7, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9800, revenue: 8500000, pmpmRevenue: 867.35, cost: 9200000, pmpmCost: 938.78 },
  { year: 2022, month: 8, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9900, revenue: 8500000, pmpmRevenue: 858.59, cost: 9150000, pmpmCost: 924.24 },
  { year: 2022, month: 9, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9800, revenue: 8500000, pmpmRevenue: 867.35, cost: 9150000, pmpmCost: 933.67 },
  { year: 2022, month: 10, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9500, revenue: 8500000, pmpmRevenue: 894.74, cost: 9000000, pmpmCost: 947.37 },
  { year: 2022, month: 11, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9500, revenue: 8500000, pmpmRevenue: 894.74, cost: 9000000, pmpmCost: 947.37 },
  { year: 2022, month: 12, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 9500, revenue: 8500000, pmpmRevenue: 894.74, cost: 9000000, pmpmCost: 947.37 },
  // Medicare DSNP
  { year: 2022, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10300000, pmpmRevenue: 1471.43, cost: 8700000, pmpmCost: 1242.86 },
  { year: 2022, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10400000, pmpmRevenue: 1485.71, cost: 8600000, pmpmCost: 1228.57 },
  { year: 2022, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10300000, pmpmRevenue: 1471.43, cost: 8700000, pmpmCost: 1242.86 },
  { year: 2022, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7200, revenue: 10700000, pmpmRevenue: 1486.11, cost: 9300000, pmpmCost: 1291.67 },
  { year: 2022, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7100, revenue: 10600000, pmpmRevenue: 1492.96, cost: 9400000, pmpmCost: 1323.94 },
  { year: 2022, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7200, revenue: 10700000, pmpmRevenue: 1486.11, cost: 9300000, pmpmCost: 1291.67 },
  { year: 2022, month: 7, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7100, revenue: 10500000, pmpmRevenue: 1478.87, cost: 9000000, pmpmCost: 1267.61 },
  { year: 2022, month: 8, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10500000, pmpmRevenue: 1500.00, cost: 9000000, pmpmCost: 1285.71 },
  { year: 2022, month: 9, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7100, revenue: 10500000, pmpmRevenue: 1478.87, cost: 9000000, pmpmCost: 1267.61 },
  { year: 2022, month: 10, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10500000, pmpmRevenue: 1500.00, cost: 9000000, pmpmCost: 1285.71 },
  { year: 2022, month: 11, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10500000, pmpmRevenue: 1500.00, cost: 9000000, pmpmCost: 1285.71 },
  { year: 2022, month: 12, lob: "MEDICARE", sublob: "DSNP", memberMonths: 7000, revenue: 10500000, pmpmRevenue: 1500.00, cost: 9000000, pmpmCost: 1285.71 },
  // Medicaid MLTSS
  { year: 2022, month: 1, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109000000, pmpmCost: 1758.06 },
  { year: 2022, month: 2, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109500000, pmpmCost: 1766.13 },
  { year: 2022, month: 3, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109500000, pmpmCost: 1766.13 },
  { year: 2022, month: 4, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62500, revenue: 133000000, pmpmRevenue: 2128.00, cost: 111000000, pmpmCost: 1776.00 },
  { year: 2022, month: 5, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 63000, revenue: 134000000, pmpmRevenue: 2126.98, cost: 112000000, pmpmCost: 1777.78 },
  { year: 2022, month: 6, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62500, revenue: 133000000, pmpmRevenue: 2128.00, cost: 111000000, pmpmCost: 1776.00 },
  { year: 2022, month: 7, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62500, revenue: 133000000, pmpmRevenue: 2128.00, cost: 110000000, pmpmCost: 1760.00 },
  { year: 2022, month: 8, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 110000000, pmpmCost: 1774.19 },
  { year: 2022, month: 9, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62500, revenue: 133000000, pmpmRevenue: 2128.00, cost: 110000000, pmpmCost: 1760.00 },
  { year: 2022, month: 10, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109000000, pmpmCost: 1758.06 },
  { year: 2022, month: 11, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109500000, pmpmCost: 1766.13 },
  { year: 2022, month: 12, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62000, revenue: 132000000, pmpmRevenue: 2129.03, cost: 109500000, pmpmCost: 1766.13 },
  // Commercial Fully Insured Individual
  { year: 2022, month: 1, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8000000, pmpmCost: 666.67 },
  { year: 2022, month: 2, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8000000, pmpmCost: 666.67 },
  { year: 2022, month: 3, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8000000, pmpmCost: 666.67 },
  { year: 2022, month: 4, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12200, revenue: 10200000, pmpmRevenue: 836.07, cost: 8400000, pmpmCost: 688.52 },
  { year: 2022, month: 5, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12100, revenue: 10100000, pmpmRevenue: 834.71, cost: 8300000, pmpmCost: 685.95 },
  { year: 2022, month: 6, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12200, revenue: 10200000, pmpmRevenue: 836.07, cost: 8300000, pmpmCost: 680.33 },
  { year: 2022, month: 7, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8200000, pmpmCost: 683.33 },
  { year: 2022, month: 8, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8200000, pmpmCost: 683.33 },
  { year: 2022, month: 9, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 12000, revenue: 10000000, pmpmRevenue: 833.33, cost: 8100000, pmpmCost: 675.00 },
  { year: 2022, month: 10, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 11800, revenue: 9800000, pmpmRevenue: 830.51, cost: 8200000, pmpmCost: 694.92 },
  { year: 2022, month: 11, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 11900, revenue: 9900000, pmpmRevenue: 831.93, cost: 8200000, pmpmCost: 689.08 },
  { year: 2022, month: 12, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 11800, revenue: 9800000, pmpmRevenue: 830.51, cost: 8100000, pmpmCost: 686.44 },
  // Commercial Large Group
  { year: 2022, month: 1, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10200000, pmpmCost: 463.64 },
  { year: 2022, month: 2, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22100, revenue: 12550000, pmpmRevenue: 567.87, cost: 10250000, pmpmCost: 463.80 },
  { year: 2022, month: 3, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10200000, pmpmCost: 463.64 },
  { year: 2022, month: 4, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22200, revenue: 12600000, pmpmRevenue: 567.57, cost: 10350000, pmpmCost: 466.22 },
  { year: 2022, month: 5, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22100, revenue: 12550000, pmpmRevenue: 567.87, cost: 10300000, pmpmCost: 466.06 },
  { year: 2022, month: 6, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22200, revenue: 12600000, pmpmRevenue: 567.57, cost: 10350000, pmpmCost: 466.22 },
  { year: 2022, month: 7, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10250000, pmpmCost: 465.91 },
  { year: 2022, month: 8, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22100, revenue: 12550000, pmpmRevenue: 567.87, cost: 10280000, pmpmCost: 465.16 },
  { year: 2022, month: 9, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10250000, pmpmCost: 465.91 },
  { year: 2022, month: 10, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10200000, pmpmCost: 463.64 },
  { year: 2022, month: 11, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22100, revenue: 12550000, pmpmRevenue: 567.87, cost: 10250000, pmpmCost: 463.80 },
  { year: 2022, month: 12, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 22000, revenue: 12500000, pmpmRevenue: 568.18, cost: 10200000, pmpmCost: 463.64 },
  // Commercial Small Group
  { year: 2022, month: 1, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7050000, pmpmCost: 470.00 },
  { year: 2022, month: 2, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15100, revenue: 8650000, pmpmRevenue: 572.85, cost: 7100000, pmpmCost: 470.20 },
  { year: 2022, month: 3, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7050000, pmpmCost: 470.00 },
  { year: 2022, month: 4, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15200, revenue: 8700000, pmpmRevenue: 572.37, cost: 7180000, pmpmCost: 472.37 },
  { year: 2022, month: 5, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15100, revenue: 8650000, pmpmRevenue: 572.85, cost: 7150000, pmpmCost: 473.51 },
  { year: 2022, month: 6, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15200, revenue: 8700000, pmpmRevenue: 572.37, cost: 7180000, pmpmCost: 472.37 },
  { year: 2022, month: 7, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7080000, pmpmCost: 472.00 },
  { year: 2022, month: 8, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15100, revenue: 8650000, pmpmRevenue: 572.85, cost: 7120000, pmpmCost: 471.52 },
  { year: 2022, month: 9, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7080000, pmpmCost: 472.00 },
  { year: 2022, month: 10, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7050000, pmpmCost: 470.00 },
  { year: 2022, month: 11, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15100, revenue: 8650000, pmpmRevenue: 572.85, cost: 7100000, pmpmCost: 470.20 },
  { year: 2022, month: 12, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 15000, revenue: 8600000, pmpmRevenue: 573.33, cost: 7050000, pmpmCost: 470.00 },
  // Medicaid Managed Care Medicaid
  { year: 2022, month: 1, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 340000, revenue: 148000000, pmpmRevenue: 435.29, cost: 118000000, pmpmCost: 347.06 },
  { year: 2022, month: 2, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 342000, revenue: 149000000, pmpmRevenue: 435.67, cost: 119000000, pmpmCost: 347.95 },
  { year: 2022, month: 3, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 340000, revenue: 148000000, pmpmRevenue: 435.29, cost: 118000000, pmpmCost: 347.06 },
  { year: 2022, month: 4, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 345000, revenue: 150000000, pmpmRevenue: 434.78, cost: 120000000, pmpmCost: 347.83 },
  { year: 2022, month: 5, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 343000, revenue: 149500000, pmpmRevenue: 435.86, cost: 119500000, pmpmCost: 348.40 },
  { year: 2022, month: 6, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 345000, revenue: 150000000, pmpmRevenue: 434.78, cost: 120000000, pmpmCost: 347.83 },
  { year: 2022, month: 7, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 342000, revenue: 149000000, pmpmRevenue: 435.67, cost: 119000000, pmpmCost: 347.95 },
  { year: 2022, month: 8, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 343000, revenue: 149500000, pmpmRevenue: 435.86, cost: 119200000, pmpmCost: 347.52 },
  { year: 2022, month: 9, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 342000, revenue: 149000000, pmpmRevenue: 435.67, cost: 119000000, pmpmCost: 347.95 },
  { year: 2022, month: 10, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 340000, revenue: 148000000, pmpmRevenue: 435.29, cost: 118000000, pmpmCost: 347.06 },
  { year: 2022, month: 11, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 342000, revenue: 149000000, pmpmRevenue: 435.67, cost: 119000000, pmpmCost: 347.95 },
  { year: 2022, month: 12, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 340000, revenue: 148000000, pmpmRevenue: 435.29, cost: 118000000, pmpmCost: 347.06 },
  
  // 2023
  // Medicare Medicare Advantage
  { year: 2023, month: 1, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12100000, pmpmRevenue: 983.74, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 2, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12400, revenue: 12200000, pmpmRevenue: 983.87, cost: 12500000, pmpmCost: 1008.06 },
  { year: 2023, month: 3, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12200000, pmpmRevenue: 991.87, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 4, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12100000, pmpmRevenue: 983.74, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 5, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12400, revenue: 12200000, pmpmRevenue: 983.87, cost: 12500000, pmpmCost: 1008.06 },
  { year: 2023, month: 6, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12200000, pmpmRevenue: 991.87, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 7, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12200000, pmpmRevenue: 991.87, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 8, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12400, revenue: 12200000, pmpmRevenue: 983.87, cost: 12500000, pmpmCost: 1008.06 },
  { year: 2023, month: 9, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12100000, pmpmRevenue: 983.74, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 10, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12200000, pmpmRevenue: 991.87, cost: 12500000, pmpmCost: 1016.26 },
  { year: 2023, month: 11, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12400, revenue: 12200000, pmpmRevenue: 983.87, cost: 12500000, pmpmCost: 1008.06 },
  { year: 2023, month: 12, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 12300, revenue: 12100000, pmpmRevenue: 983.74, cost: 12500000, pmpmCost: 1016.26 },
  // Medicare DSNP
  { year: 2023, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 730, revenue: 1100000, pmpmRevenue: 1506.85, cost: 1030000, pmpmCost: 1410.96 },
  { year: 2023, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 720, revenue: 1080000, pmpmRevenue: 1500.00, cost: 1010000, pmpmCost: 1402.78 },
  { year: 2023, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 750, revenue: 1120000, pmpmRevenue: 1493.33, cost: 1060000, pmpmCost: 1413.33 },
  { year: 2023, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 710, revenue: 1060000, pmpmRevenue: 1492.96, cost: 985000, pmpmCost: 1387.32 },
  { year: 2023, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 720, revenue: 1070000, pmpmRevenue: 1486.11, cost: 995000, pmpmCost: 1381.94 },
  { year: 2023, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 720, revenue: 1070000, pmpmRevenue: 1486.11, cost: 995000, pmpmCost: 1381.94 },
  { year: 2023, month: 7, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1085000, pmpmRevenue: 1496.55, cost: 1005000, pmpmCost: 1386.21 },
  { year: 2023, month: 8, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1080000, pmpmRevenue: 1489.66, cost: 1002500, pmpmCost: 1382.76 },
  { year: 2023, month: 9, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1085000, pmpmRevenue: 1496.55, cost: 1005000, pmpmCost: 1386.21 },
  { year: 2023, month: 10, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1085000, pmpmRevenue: 1496.55, cost: 1005000, pmpmCost: 1386.21 },
  { year: 2023, month: 11, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1080000, pmpmRevenue: 1489.66, cost: 1002500, pmpmCost: 1382.76 },
  { year: 2023, month: 12, lob: "MEDICARE", sublob: "DSNP", memberMonths: 725, revenue: 1085000, pmpmRevenue: 1496.55, cost: 1005000, pmpmCost: 1386.21 },
  // Medicaid Managed Care Medicaid
  { year: 2023, month: 1, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128000000, pmpmCost: 350.68 },
  { year: 2023, month: 2, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 3, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 4, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128000000, pmpmCost: 350.68 },
  { year: 2023, month: 5, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 6, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 7, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128000000, pmpmCost: 350.68 },
  { year: 2023, month: 8, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 9, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 10, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  { year: 2023, month: 11, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128000000, pmpmCost: 350.68 },
  { year: 2023, month: 12, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 365000, revenue: 160000000, pmpmRevenue: 438.36, cost: 128500000, pmpmCost: 352.05 },
  // Medicaid MLTSS
  { year: 2023, month: 1, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138300000, pmpmRevenue: 2201.59, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 2, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62900, revenue: 138500000, pmpmRevenue: 2201.91, cost: 120000000, pmpmCost: 1907.00 },
  { year: 2023, month: 3, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138200000, pmpmRevenue: 2200.64, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 4, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138300000, pmpmRevenue: 2201.59, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 5, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62900, revenue: 138500000, pmpmRevenue: 2201.91, cost: 120000000, pmpmCost: 1907.00 },
  { year: 2023, month: 6, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138200000, pmpmRevenue: 2200.64, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 7, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138300000, pmpmRevenue: 2201.59, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 8, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62900, revenue: 138500000, pmpmRevenue: 2201.91, cost: 120000000, pmpmCost: 1907.00 },
  { year: 2023, month: 9, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138200000, pmpmRevenue: 2200.64, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 10, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138300000, pmpmRevenue: 2201.59, cost: 120000000, pmpmCost: 1910.83 },
  { year: 2023, month: 11, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62900, revenue: 138500000, pmpmRevenue: 2201.91, cost: 120000000, pmpmCost: 1907.00 },
  { year: 2023, month: 12, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 62800, revenue: 138200000, pmpmRevenue: 2200.64, cost: 120000000, pmpmCost: 1910.83 },
  // Commercial Fully Insured Individual
  { year: 2023, month: 1, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11700000, pmpmCost: 436.57 },
  { year: 2023, month: 2, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26900, revenue: 13750000, pmpmRevenue: 511.15, cost: 11650000, pmpmCost: 433.09 },
  { year: 2023, month: 3, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11650000, pmpmCost: 434.70 },
  { year: 2023, month: 4, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11700000, pmpmCost: 436.57 },
  { year: 2023, month: 5, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26900, revenue: 13750000, pmpmRevenue: 511.15, cost: 11650000, pmpmCost: 433.09 },
  { year: 2023, month: 6, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11650000, pmpmCost: 434.70 },
  { year: 2023, month: 7, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11700000, pmpmCost: 436.57 },
  { year: 2023, month: 8, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26900, revenue: 13750000, pmpmRevenue: 511.15, cost: 11650000, pmpmCost: 433.09 },
  { year: 2023, month: 9, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11650000, pmpmCost: 434.70 },
  { year: 2023, month: 10, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11700000, pmpmCost: 436.57 },
  { year: 2023, month: 11, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26900, revenue: 13750000, pmpmRevenue: 511.15, cost: 11650000, pmpmCost: 433.09 },
  { year: 2023, month: 12, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 26800, revenue: 13750000, pmpmRevenue: 513.06, cost: 11650000, pmpmCost: 434.70 },
  // Commercial Large Group
  { year: 2023, month: 1, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 2, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 3, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11840000, pmpmCost: 483.27 },
  { year: 2023, month: 4, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 5, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 6, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11840000, pmpmCost: 483.27 },
  { year: 2023, month: 7, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 8, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 9, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11840000, pmpmCost: 483.27 },
  { year: 2023, month: 10, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 11, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11830000, pmpmCost: 482.86 },
  { year: 2023, month: 12, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 24500, revenue: 14000000, pmpmRevenue: 571.43, cost: 11840000, pmpmCost: 483.27 },
  // Commercial Small Group
  { year: 2023, month: 1, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 2, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17100, revenue: 9800000, pmpmRevenue: 573.10, cost: 8250000, pmpmCost: 482.46 },
  { year: 2023, month: 3, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 4, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 5, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17100, revenue: 9800000, pmpmRevenue: 573.10, cost: 8250000, pmpmCost: 482.46 },
  { year: 2023, month: 6, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 7, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 8, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17100, revenue: 9800000, pmpmRevenue: 573.10, cost: 8250000, pmpmCost: 482.46 },
  { year: 2023, month: 9, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 10, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },
  { year: 2023, month: 11, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17100, revenue: 9800000, pmpmRevenue: 573.10, cost: 8250000, pmpmCost: 482.46 },
  { year: 2023, month: 12, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 17200, revenue: 9850000, pmpmRevenue: 572.67, cost: 8250000, pmpmCost: 479.65 },

  // 2024
  // Medicare DSNP
  { year: 2024, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1610, revenue: 2660000, pmpmRevenue: 1652.17, cost: 2410000, pmpmCost: 1496.89 },
  { year: 2024, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1610, revenue: 2660000, pmpmRevenue: 1652.17, cost: 2410000, pmpmCost: 1496.89 },
  { year: 2024, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 7, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 8, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1610, revenue: 2660000, pmpmRevenue: 1652.17, cost: 2410000, pmpmCost: 1496.89 },
  { year: 2024, month: 9, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 10, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  { year: 2024, month: 11, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1610, revenue: 2660000, pmpmRevenue: 1652.17, cost: 2410000, pmpmCost: 1496.89 },
  { year: 2024, month: 12, lob: "MEDICARE", sublob: "DSNP", memberMonths: 1620, revenue: 2670000, pmpmRevenue: 1648.15, cost: 2420000, pmpmCost: 1493.83 },
  // Medicare DSNP
  { year: 2024, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9090000, pmpmCost: 1420.31 },
  { year: 2024, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11160000, pmpmRevenue: 1743.75, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9090000, pmpmCost: 1420.31 },
  { year: 2024, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11160000, pmpmRevenue: 1743.75, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 7, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 8, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9090000, pmpmCost: 1420.31 },
  { year: 2024, month: 9, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11160000, pmpmRevenue: 1743.75, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 10, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9080000, pmpmCost: 1418.75 },
  { year: 2024, month: 11, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11170000, pmpmRevenue: 1745.31, cost: 9090000, pmpmCost: 1420.31 },
  { year: 2024, month: 12, lob: "MEDICARE", sublob: "DSNP", memberMonths: 6400, revenue: 11160000, pmpmRevenue: 1743.75, cost: 9080000, pmpmCost: 1418.75 },
  // Medicaid Managed Care Medicaid
  { year: 2024, month: 1, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 2, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 3, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 4, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 5, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 6, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 7, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 8, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 9, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 10, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 11, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  { year: 2024, month: 12, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 315000, revenue: 132500000, pmpmRevenue: 420.63, cost: 130000000, pmpmCost: 412.70 },
  // Medicaid MLTSS
  { year: 2024, month: 1, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 2, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 3, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57600, revenue: 132500000, pmpmRevenue: 2300.35, cost: 121600000, pmpmCost: 2111.11 },
  { year: 2024, month: 4, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 5, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 6, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57600, revenue: 132500000, pmpmRevenue: 2300.35, cost: 121600000, pmpmCost: 2111.11 },
  { year: 2024, month: 7, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 8, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 9, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57600, revenue: 132500000, pmpmRevenue: 2300.35, cost: 121600000, pmpmCost: 2111.11 },
  { year: 2024, month: 10, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 11, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57700, revenue: 132500000, pmpmRevenue: 2296.36, cost: 121700000, pmpmCost: 2109.19 },
  { year: 2024, month: 12, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 57600, revenue: 132500000, pmpmRevenue: 2300.35, cost: 121600000, pmpmCost: 2111.11 },
  // Commercial Fully Insured Individual
  { year: 2024, month: 1, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 2, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42600, revenue: 19750000, pmpmRevenue: 463.62, cost: 19750000, pmpmCost: 463.62 },
  { year: 2024, month: 3, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 4, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 5, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42600, revenue: 19750000, pmpmRevenue: 463.62, cost: 19750000, pmpmCost: 463.62 },
  { year: 2024, month: 6, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 7, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 8, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42600, revenue: 19750000, pmpmRevenue: 463.62, cost: 19750000, pmpmCost: 463.62 },
  { year: 2024, month: 9, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 10, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  { year: 2024, month: 11, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42600, revenue: 19750000, pmpmRevenue: 463.62, cost: 19750000, pmpmCost: 463.62 },
  { year: 2024, month: 12, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 42700, revenue: 19750000, pmpmRevenue: 462.53, cost: 19750000, pmpmCost: 462.53 },
  // Commercial Small Group
  { year: 2024, month: 1, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 2, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10590000, pmpmRevenue: 580.27, cost: 9910000, pmpmCost: 543.01 },
  { year: 2024, month: 3, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 4, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 5, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10590000, pmpmRevenue: 580.27, cost: 9910000, pmpmCost: 543.01 },
  { year: 2024, month: 6, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 7, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 8, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10590000, pmpmRevenue: 580.27, cost: 9910000, pmpmCost: 543.01 },
  { year: 2024, month: 9, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 10, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  { year: 2024, month: 11, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10590000, pmpmRevenue: 580.27, cost: 9910000, pmpmCost: 543.01 },
  { year: 2024, month: 12, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 18250, revenue: 10580000, pmpmRevenue: 579.73, cost: 9920000, pmpmCost: 543.56 },
  // Commercial Large Group
  { year: 2024, month: 1, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16080000, pmpmRevenue: 577.38, cost: 14420000, pmpmCost: 517.77 },
  { year: 2024, month: 2, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27800, revenue: 16080000, pmpmRevenue: 578.42, cost: 14430000, pmpmCost: 519.06 },
  { year: 2024, month: 3, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16090000, pmpmRevenue: 577.74, cost: 14400000, pmpmCost: 517.06 },
  { year: 2024, month: 4, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16080000, pmpmRevenue: 577.38, cost: 14420000, pmpmCost: 517.77 },
  { year: 2024, month: 5, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27800, revenue: 16080000, pmpmRevenue: 578.42, cost: 14430000, pmpmCost: 519.06 },
  { year: 2024, month: 6, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16090000, pmpmRevenue: 577.74, cost: 14400000, pmpmCost: 517.06 },
  { year: 2024, month: 7, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16080000, pmpmRevenue: 577.38, cost: 14420000, pmpmCost: 517.77 },
  { year: 2024, month: 8, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27800, revenue: 16080000, pmpmRevenue: 578.42, cost: 14430000, pmpmCost: 519.06 },
  { year: 2024, month: 9, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16090000, pmpmRevenue: 577.74, cost: 14400000, pmpmCost: 517.06 },
  { year: 2024, month: 10, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16080000, pmpmRevenue: 577.38, cost: 14420000, pmpmCost: 517.77 },
  { year: 2024, month: 11, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27800, revenue: 16080000, pmpmRevenue: 578.42, cost: 14430000, pmpmCost: 519.06 },
  { year: 2024, month: 12, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 27850, revenue: 16090000, pmpmRevenue: 577.74, cost: 14400000, pmpmCost: 517.06 },

  // 2025 (Q1 and Q2 only)
  // Medicare Medicare Advantage
  { year: 2025, month: 1, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45800, revenue: 48700000, pmpmRevenue: 1063.32, cost: 53500000, pmpmCost: 1168.12 },
  { year: 2025, month: 2, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45900, revenue: 48700000, pmpmRevenue: 1061.00, cost: 53500000, pmpmCost: 1165.58 },
  { year: 2025, month: 3, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45800, revenue: 48600000, pmpmRevenue: 1061.14, cost: 53500000, pmpmCost: 1168.12 },
  { year: 2025, month: 4, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45800, revenue: 48700000, pmpmRevenue: 1063.32, cost: 53500000, pmpmCost: 1168.12 },
  { year: 2025, month: 5, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45900, revenue: 48700000, pmpmRevenue: 1061.00, cost: 53500000, pmpmCost: 1165.58 },
  { year: 2025, month: 6, lob: "MEDICARE", sublob: "Medicare Advantage", memberMonths: 45800, revenue: 48600000, pmpmRevenue: 1061.14, cost: 53500000, pmpmCost: 1168.12 },
  // Medicare DSNP
  { year: 2025, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5330000, pmpmRevenue: 1522.86, cost: 6000000, pmpmCost: 1714.29 },
  { year: 2025, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5340000, pmpmRevenue: 1525.71, cost: 6000000, pmpmCost: 1714.29 },
  { year: 2025, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5330000, pmpmRevenue: 1522.86, cost: 6000000, pmpmCost: 1714.29 },
  { year: 2025, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5330000, pmpmRevenue: 1522.86, cost: 6000000, pmpmCost: 1714.29 },
  { year: 2025, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5340000, pmpmRevenue: 1525.71, cost: 6000000, pmpmCost: 1714.29 },
  { year: 2025, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 3500, revenue: 5330000, pmpmRevenue: 1522.86, cost: 6000000, pmpmCost: 1714.29 },
  // Medicare DSNP
  { year: 2025, month: 1, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5930, revenue: 11830000, pmpmRevenue: 1994.94, cost: 10330000, pmpmCost: 1742.16 },
  { year: 2025, month: 2, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5940, revenue: 11840000, pmpmRevenue: 1993.27, cost: 10340000, pmpmCost: 1740.74 },
  { year: 2025, month: 3, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5930, revenue: 11830000, pmpmRevenue: 1994.94, cost: 10330000, pmpmCost: 1742.16 },
  { year: 2025, month: 4, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5930, revenue: 11830000, pmpmRevenue: 1994.94, cost: 10330000, pmpmCost: 1742.16 },
  { year: 2025, month: 5, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5940, revenue: 11840000, pmpmRevenue: 1993.27, cost: 10340000, pmpmCost: 1740.74 },
  { year: 2025, month: 6, lob: "MEDICARE", sublob: "DSNP", memberMonths: 5930, revenue: 11830000, pmpmRevenue: 1994.94, cost: 10330000, pmpmCost: 1742.16 },
  // Medicaid Managed Care Medicaid
  { year: 2025, month: 1, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286700, revenue: 120500000, pmpmRevenue: 420.30, cost: 125330000, pmpmCost: 437.14 },
  { year: 2025, month: 2, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286600, revenue: 120500000, pmpmRevenue: 420.45, cost: 125340000, pmpmCost: 437.30 },
  { year: 2025, month: 3, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286700, revenue: 120500000, pmpmRevenue: 420.30, cost: 125330000, pmpmCost: 437.14 },
  { year: 2025, month: 4, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286700, revenue: 120500000, pmpmRevenue: 420.30, cost: 125330000, pmpmCost: 437.14 },
  { year: 2025, month: 5, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286600, revenue: 120500000, pmpmRevenue: 420.45, cost: 125340000, pmpmCost: 437.30 },
  { year: 2025, month: 6, lob: "MEDICAID", sublob: "Managed Care Medicaid", memberMonths: 286700, revenue: 120500000, pmpmRevenue: 420.30, cost: 125330000, pmpmCost: 437.14 },
  // Medicaid MLTSS
  { year: 2025, month: 1, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49700, revenue: 121330000, pmpmRevenue: 2441.25, cost: 114500000, pmpmCost: 2303.82 },
  { year: 2025, month: 2, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49600, revenue: 121340000, pmpmRevenue: 2446.37, cost: 114500000, pmpmCost: 2308.47 },
  { year: 2025, month: 3, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49700, revenue: 121330000, pmpmRevenue: 2441.25, cost: 114500000, pmpmCost: 2303.82 },
  { year: 2025, month: 4, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49700, revenue: 121330000, pmpmRevenue: 2441.25, cost: 114500000, pmpmCost: 2303.82 },
  { year: 2025, month: 5, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49600, revenue: 121340000, pmpmRevenue: 2446.37, cost: 114500000, pmpmCost: 2308.47 },
  { year: 2025, month: 6, lob: "MEDICAID", sublob: "MLTSS", memberMonths: 49700, revenue: 121330000, pmpmRevenue: 2441.25, cost: 114500000, pmpmCost: 2303.82 },
  // Commercial Fully Insured Individual
  { year: 2025, month: 1, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67200, revenue: 31000000, pmpmRevenue: 461.31, cost: 28670000, pmpmCost: 426.64 },
  { year: 2025, month: 2, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67100, revenue: 31000000, pmpmRevenue: 461.99, cost: 28660000, pmpmCost: 427.13 },
  { year: 2025, month: 3, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67200, revenue: 31000000, pmpmRevenue: 461.31, cost: 28670000, pmpmCost: 426.64 },
  { year: 2025, month: 4, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67200, revenue: 31000000, pmpmRevenue: 461.31, cost: 28670000, pmpmCost: 426.64 },
  { year: 2025, month: 5, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67100, revenue: 31000000, pmpmRevenue: 461.99, cost: 28660000, pmpmCost: 427.13 },
  { year: 2025, month: 6, lob: "COMMERCIAL", sublob: "Fully Insured Individual", memberMonths: 67200, revenue: 31000000, pmpmRevenue: 461.31, cost: 28670000, pmpmCost: 426.64 },
  // Commercial Small Group
  { year: 2025, month: 1, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12830000, pmpmRevenue: 583.18, cost: 12170000, pmpmCost: 553.18 },
  { year: 2025, month: 2, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12840000, pmpmRevenue: 583.64, cost: 12160000, pmpmCost: 552.73 },
  { year: 2025, month: 3, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12830000, pmpmRevenue: 583.18, cost: 12170000, pmpmCost: 553.18 },
  { year: 2025, month: 4, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12830000, pmpmRevenue: 583.18, cost: 12170000, pmpmCost: 553.18 },
  { year: 2025, month: 5, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12840000, pmpmRevenue: 583.64, cost: 12160000, pmpmCost: 552.73 },
  { year: 2025, month: 6, lob: "COMMERCIAL", sublob: "Small Group", memberMonths: 22000, revenue: 12830000, pmpmRevenue: 583.18, cost: 12170000, pmpmCost: 553.18 },
  // Commercial Large Group
  { year: 2025, month: 1, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32170, revenue: 19000000, pmpmRevenue: 590.61, cost: 16830000, pmpmCost: 523.16 },
  { year: 2025, month: 2, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32160, revenue: 19000000, pmpmRevenue: 590.80, cost: 16840000, pmpmCost: 523.60 },
  { year: 2025, month: 3, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32170, revenue: 19000000, pmpmRevenue: 590.61, cost: 16830000, pmpmCost: 523.16 },
  { year: 2025, month: 4, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32170, revenue: 19000000, pmpmRevenue: 590.61, cost: 16830000, pmpmCost: 523.16 },
  { year: 2025, month: 5, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32160, revenue: 19000000, pmpmRevenue: 590.80, cost: 16840000, pmpmCost: 523.60 },
  { year: 2025, month: 6, lob: "COMMERCIAL", sublob: "Large Group", memberMonths: 32170, revenue: 19000000, pmpmRevenue: 590.61, cost: 16830000, pmpmCost: 523.16 },
] as (MLRMonthlyDataRow & { pmpmRevenue?: number; pmpmCost?: number })[]

// Aggregation helper type
interface AggregatedRow {
  year: number
  month?: number
  quarter?: number
  lob: string
  sublob: string
  memberMonths: number
  revenue: number
  cost: number
  pmpmRevenue: number
  pmpmCost: number
  mlr: number
}

// Aggregate data at specified level with optional LOB/Sublob breakdown
export function aggregateMLRData(
  level: AggregationLevel,
  filters?: CentralDataFilters
): AggregatedRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)

  const aggregateMap = new Map<string, {
    year: number
    month?: number
    quarter?: number
    lob: string
    sublob: string
    memberMonths: number
    revenue: number
    cost: number
  }>()

  for (const row of data) {
    let key: string
    let period: { year: number; month?: number; quarter?: number }

    switch (level) {
      case "month":
        key = `${row.year}-${row.month}-${row.lob}-${row.sublob}`
        period = { year: row.year, month: row.month }
        break
      case "quarter":
        const quarter = getQuarter(row.month)
        key = `${row.year}-Q${quarter}-${row.lob}-${row.sublob}`
        period = { year: row.year, quarter }
        break
      case "year":
        key = `${row.year}-${row.lob}-${row.sublob}`
        period = { year: row.year }
        break
    }

    const existing = aggregateMap.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
    } else {
      aggregateMap.set(key, {
        ...period,
        lob: row.lob,
        sublob: row.sublob,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
      })
    }
  }

  return Array.from(aggregateMap.values()).map((row) => ({
    ...row,
    pmpmRevenue: row.revenue / row.memberMonths,
    pmpmCost: row.cost / row.memberMonths,
    mlr: (row.cost / row.revenue) * 100,
  }))
}

// Aggregate data by time period only (no LOB/Sublob breakdown) - for Cost/Revenue component charts
export function aggregateByTimePeriod(
  level: AggregationLevel,
  filters?: CentralDataFilters
): { year: number; month?: number; quarter?: number; memberMonths: number; revenue: number; cost: number; mlr: number }[] {
  const data = applyCentralFilters(mlrExpandedData, filters)

  const aggregateMap = new Map<string, {
    year: number
    month?: number
    quarter?: number
    memberMonths: number
    revenue: number
    cost: number
  }>()

  for (const row of data) {
    let key: string
    let period: { year: number; month?: number; quarter?: number }

    switch (level) {
      case "month":
        key = `${row.year}-${row.month}`
        period = { year: row.year, month: row.month }
        break
      case "quarter":
        const quarter = getQuarter(row.month)
        key = `${row.year}-Q${quarter}`
        period = { year: row.year, quarter }
        break
      case "year":
        key = `${row.year}`
        period = { year: row.year }
        break
    }

    const existing = aggregateMap.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
    } else {
      aggregateMap.set(key, {
        ...period,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
      })
    }
  }

  return Array.from(aggregateMap.values())
    .map((row) => ({
      ...row,
      mlr: (row.cost / row.revenue) * 100,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (level === "quarter") return (a.quarter || 0) - (b.quarter || 0)
      if (level === "month") return (a.month || 0) - (b.month || 0)
      return 0
    })
}

// Get aggregated trends data (totals across all LOB/Sublob for charts)
export function getTrendsData(
  level: AggregationLevel,
  filters?: CentralDataFilters
) {
  const data = applyCentralFilters(mlrExpandedData, filters)

  const aggregateMap = new Map<string, {
    year: number
    month?: number
    quarter?: number
    memberMonths: number
    revenue: number
    cost: number
    label: string
    shortLabel: string
  }>()

  for (const row of data) {
    let key: string
    let period: { year: number; month?: number; quarter?: number; label: string; shortLabel: string }

    switch (level) {
      case "month":
        key = `${row.year}-${row.month}`
        period = {
          year: row.year,
          month: row.month,
          label: `${getMonthName(row.month)} ${row.year}`,
          shortLabel: `${getMonthName(row.month)}`,
        }
        break
      case "quarter":
        const quarter = getQuarter(row.month)
        key = `${row.year}-Q${quarter}`
        period = {
          year: row.year,
          quarter,
          label: `Q${quarter} ${row.year}`,
          shortLabel: `Q${quarter} '${String(row.year).slice(-2)}`,
        }
        break
      case "year":
        key = `${row.year}`
        period = {
          year: row.year,
          label: `${row.year}`,
          shortLabel: `${row.year}`,
        }
        break
    }

    const existing = aggregateMap.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
    } else {
      aggregateMap.set(key, {
        ...period,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
      })
    }
  }

  return Array.from(aggregateMap.values())
    .map((row) => ({
      ...row,
      pmpmRevenue: row.revenue / row.memberMonths,
      pmpmCost: row.cost / row.memberMonths,
      mlr: (row.cost / row.revenue) * 100,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (level === "quarter" && a.quarter && b.quarter) return a.quarter - b.quarter
      if (level === "month" && a.month && b.month) return a.month - b.month
      return 0
    })
}

// Legacy function for MLR Analysis table
export function getYearlyMLRData() {
  return aggregateMLRData("year")
}

// Legacy function for trends charts
export function getQuarterlyTrendsData() {
  return getTrendsData("quarter")
}

// Consumer driven market values
export const consumerMarkets = [
  "Amarillo",
  "Austin",
  "Dallas",
  "Edinburg",
  "Ft. Worth",
  "Houston",
  "Huntsville",
  "Lubbock",
  "Odessa",
  "Pecos",
  "San Angelo",
  "San Antonio",
  "Tyler",
] as const

export type ConsumerMarket = typeof consumerMarkets[number]

// Consumer driven region values
export const consumerRegions = [
  "Amarillo Region",
  "Austin Region",
  "DFW Region",
  "Houston Region",
  "San Antonio Region",
  "Western Region",
] as const

export type ConsumerRegion = typeof consumerRegions[number]

// Ontology: Market -> Region -> Service Area mapping
export interface MarketOntology {
  market: string
  region: string
  serviceArea: string
}

export const marketRegionServiceAreaOntology: MarketOntology[] = [
  { market: "Amarillo", region: "Amarillo Region", serviceArea: "Northern Region" },
  { market: "Lubbock", region: "Amarillo Region", serviceArea: "Northern Region" },
  { market: "San Angelo", region: "Austin Region", serviceArea: "Central Region" },
  { market: "Dallas", region: "DFW Region", serviceArea: "Northern Region" },
  { market: "Austin", region: "Austin Region", serviceArea: "Central Region" },
  { market: "Houston", region: "Houston Region", serviceArea: "Eastern Region" },
  { market: "San Antonio", region: "San Antonio Region", serviceArea: "Southwest Region" },
  { market: "Huntsville", region: "Houston Region", serviceArea: "Eastern Region" },
  { market: "Edinburg", region: "San Antonio Region", serviceArea: "Southwest Region" },
  { market: "Pecos", region: "Western Region", serviceArea: "Western Region" },
  { market: "Odessa", region: "Western Region", serviceArea: "Western Region" },
  { market: "Tyler", region: "DFW Region", serviceArea: "Northern Region" },
  { market: "Ft. Worth", region: "DFW Region", serviceArea: "Northern Region" },
]

// Market share weights for distributing data across markets
// These represent the relative share of members in each market
const marketShareWeights: Record<string, number> = {
  "Amarillo": 0.04,
  "Austin": 0.10,
  "Dallas": 0.15,
  "Edinburg": 0.05,
  "Ft. Worth": 0.12,
  "Houston": 0.18,
  "Huntsville": 0.03,
  "Lubbock": 0.04,
  "Odessa": 0.03,
  "Pecos": 0.02,
  "San Angelo": 0.03,
  "San Antonio": 0.12,
  "Tyler": 0.09,
}

// Consumer Cohort values (used by expansion)
const consumerCohortValues = [
  "Patient-Member",
  "Member-only-with-claims",
  "Member-only-without-claims",
] as const

// Provider Attribution values (used by expansion)
const providerAttributionValues = [
  "Provider Group 2",
  "Non-Provider Group 2",
  "Provider Group 1",
  "Non-Provider Group 1",
] as const

// Cohort distribution factors (what percentage of members fall into each cohort)
const cohortDistribution: Record<string, { share: number; mlrFactor: number; riskScore: number }> = {
  "Patient-Member": { share: 0.21, mlrFactor: 1.15, riskScore: 2.1 },
  "Member-only-with-claims": { share: 0.62, mlrFactor: 0.95, riskScore: 1.0 },
  "Member-only-without-claims": { share: 0.17, mlrFactor: 0.10, riskScore: 0.1 },
}

// Provider attribution distribution
const attributionDistribution: Record<string, { share: number; mlrFactor: number; riskScore: number }> = {
  "Provider Group 2": { share: 0.15, mlrFactor: 0.92, riskScore: 1.3 },
  "Non-Provider Group 2": { share: 0.425, mlrFactor: 1.05, riskScore: 1.0 },
  "Provider Group 1": { share: 0.045, mlrFactor: 0.88, riskScore: 1.4 },
  "Non-Provider Group 1": { share: 0.38, mlrFactor: 1.05, riskScore: 1.0 },
}

// Chronic condition prevalence by LOB
const chronicConditionPrevalence: Record<string, Record<string, number>> = {
  MEDICARE: {
    anxietyDisorders: 0.14, depression: 0.12, depressiveDisorder: 0.11,
    diabetes: 0.07, hyperTension: 0.15, hyperlipidemia: 0.12, obesity: 0.10, tobaccoUse: 0.08,
  },
  MEDICAID: {
    anxietyDisorders: 0.13, depression: 0.12, depressiveDisorder: 0.10,
    diabetes: 0.07, hyperTension: 0.14, hyperlipidemia: 0.12, obesity: 0.10, tobaccoUse: 0.09,
  },
  COMMERCIAL: {
    anxietyDisorders: 0.14, depression: 0.12, depressiveDisorder: 0.11,
    diabetes: 0.07, hyperTension: 0.15, hyperlipidemia: 0.12, obesity: 0.10, tobaccoUse: 0.08,
  },
}

// Market-level risk adjustment factors (different regions have different risk profiles)
const marketRiskFactors: Record<string, number> = {
  "Abilene": 1.08, "Amarillo": 1.15, "Austin": 0.88, "Beaumont": 1.05,
  "Corpus Christi": 0.95, "Dallas": 0.92, "El Paso": 1.10, "Houston": 0.97,
  "Lubbock": 1.12, "McAllen": 1.18, "Midland": 1.03, "San Antonio": 0.90, "Waco": 1.00,
}

// Seeded random for consistent variations across runs
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Expand base data by distributing each row across all dimensions:
// market (13) x cohort (3) x attribution (4) = 156 rows per base row
function expandDataWithAllDimensions(baseData: Array<{
  year: number; month: number; lob: string; sublob: string;
  memberMonths: number; revenue: number; cost: number;
  pmpmRevenue?: number; pmpmCost?: number;
}>): MLRMonthlyDataRow[] {
  const expanded: MLRMonthlyDataRow[] = []
  
  for (const row of baseData) {
    const baseSeed = `${row.year}-${row.month}-${row.lob}-${row.sublob}`
      .split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    
    for (let m = 0; m < marketRegionServiceAreaOntology.length; m++) {
      const entry = marketRegionServiceAreaOntology[m]
      const marketWeight = marketShareWeights[entry.market] || (1 / 13)
      
      for (let c = 0; c < consumerCohortValues.length; c++) {
        const cohort = consumerCohortValues[c]
        const cohortFactor = cohortDistribution[cohort]
        
        for (let a = 0; a < providerAttributionValues.length; a++) {
          const attribution = providerAttributionValues[a]
          const attrFactor = attributionDistribution[attribution]
          
          const totalWeight = marketWeight * cohortFactor.share * attrFactor.share
          const rowSeed = baseSeed + m * 1000 + c * 100 + a * 10
          
          // Apply cohort and attribution MLR factors with small variance
          const variance = (seededRandom(rowSeed) - 0.5) * 0.08
          const costFactor = cohortFactor.mlrFactor * attrFactor.mlrFactor + variance
          
          const memberMonths = Math.round(row.memberMonths * totalWeight)
          const revenue = Math.round(row.revenue * totalWeight)
          const cost = Math.round(row.cost * totalWeight * costFactor)
          const marketRisk = marketRiskFactors[entry.market] || 1.0
          const riskScore = Math.round(
            (cohortFactor.riskScore * 0.5 + attrFactor.riskScore * 0.3 + marketRisk * 0.2) *
            marketRisk *
            (1 + (seededRandom(rowSeed + 1) - 0.5) * 0.15) * 10
          ) / 10
          
          // Generate chronic condition flags based on LOB prevalence
          const lobPrev = chronicConditionPrevalence[row.lob] || chronicConditionPrevalence.COMMERCIAL
          
          expanded.push({
            year: row.year,
            month: row.month,
            lob: row.lob,
            sublob: row.sublob,
            memberMonths,
            revenue,
            cost,
            consumerMarket: entry.market,
            consumerRegion: entry.region,
            serviceArea: entry.serviceArea,
            consumerCohort: cohort,
            providerAttribution: attribution,
            riskScore: Math.max(0.1, riskScore),
            hyperTension: seededRandom(rowSeed + 10) < (lobPrev.hyperTension || 0.15),
            depression: seededRandom(rowSeed + 11) < (lobPrev.depression || 0.12),
            hyperlipidemia: seededRandom(rowSeed + 12) < (lobPrev.hyperlipidemia || 0.12),
            diabetes: seededRandom(rowSeed + 13) < (lobPrev.diabetes || 0.07),
            tobaccoUse: seededRandom(rowSeed + 14) < (lobPrev.tobaccoUse || 0.08),
            obesity: seededRandom(rowSeed + 15) < (lobPrev.obesity || 0.10),
            anxietyDisorders: seededRandom(rowSeed + 16) < (lobPrev.anxietyDisorders || 0.14),
            depressiveDisorder: seededRandom(rowSeed + 17) < (lobPrev.depressiveDisorder || 0.11),
          })
        }
      }
    }
  }
  return expanded
}

// The single central expanded dataset with ALL dimensions
const mlrExpandedData: MLRMonthlyDataRow[] = expandDataWithAllDimensions(mlrMonthlyData as any)

// Apply all filters to the central data
export function applyCentralFilters(data: MLRMonthlyDataRow[], filters?: CentralDataFilters): MLRMonthlyDataRow[] {
  if (!filters) return data
  let filtered = data
  if (filters.years?.length) {
    filtered = filtered.filter((d) => filters.years!.includes(d.year))
  }
  if (filters.lobs?.length) {
    filtered = filtered.filter((d) => filters.lobs!.includes(d.lob))
  }
  if (filters.sublobs?.length) {
    filtered = filtered.filter((d) => filters.sublobs!.includes(d.sublob))
  }
  if (filters.geo?.consumerMarkets?.length) {
    filtered = filtered.filter((d) => filters.geo!.consumerMarkets!.includes(d.consumerMarket))
  }
  if (filters.geo?.consumerRegions?.length) {
    filtered = filtered.filter((d) => filters.geo!.consumerRegions!.includes(d.consumerRegion))
  }
  if (filters.geo?.serviceAreas?.length) {
    filtered = filtered.filter((d) => filters.geo!.serviceAreas!.includes(d.serviceArea))
  }
  if (filters.consumerCohorts?.length) {
    filtered = filtered.filter((d) => filters.consumerCohorts!.includes(d.consumerCohort))
  }
  if (filters.providerAttributions?.length) {
    filtered = filtered.filter((d) => filters.providerAttributions!.includes(d.providerAttribution))
  }
  if (filters.chronicConditions) {
    for (const [condition, value] of Object.entries(filters.chronicConditions)) {
      if (value !== undefined) {
        filtered = filtered.filter((d) => (d as any)[condition] === value)
      }
    }
  }
  return filtered
}

// Convenience: get the full central data with optional filters
export function getCentralData(filters?: CentralDataFilters): MLRMonthlyDataRow[] {
  return applyCentralFilters(mlrExpandedData, filters)
}

// Helper: get valid regions for a given market
export function getRegionsForMarket(market: string): string[] {
  const regions = marketRegionServiceAreaOntology
    .filter((o) => o.market === market)
    .map((o) => o.region)
  return [...new Set(regions)]
}

// Helper: get valid markets for a given region
export function getMarketsForRegion(region: string): string[] {
  return marketRegionServiceAreaOntology
    .filter((o) => o.region === region)
    .map((o) => o.market)
}

// Helper: get valid service areas for a given region
export function getServiceAreasForRegion(region: string): string[] {
  const areas = marketRegionServiceAreaOntology
    .filter((o) => o.region === region)
    .map((o) => o.serviceArea)
  return [...new Set(areas)]
}

// Helper: get valid regions for a given service area
export function getRegionsForServiceArea(serviceArea: string): string[] {
  const regions = marketRegionServiceAreaOntology
    .filter((o) => o.serviceArea === serviceArea)
    .map((o) => o.region)
  return [...new Set(regions)]
}

// Helper: get valid markets for a given service area
export function getMarketsForServiceArea(serviceArea: string): string[] {
  return marketRegionServiceAreaOntology
    .filter((o) => o.serviceArea === serviceArea)
    .map((o) => o.market)
}

// Get unique values for filters
export function getFilterOptions() {
  return {
    years: [...new Set(mlrExpandedData.map((d) => d.year))].sort((a, b) => b - a),
    lobs: [...new Set(mlrExpandedData.map((d) => d.lob))].sort(),
    sublobs: [...new Set(mlrExpandedData.map((d) => d.sublob))].sort(),
    consumerMarkets: [...consumerMarkets],
    consumerRegions: [...consumerRegions],
    serviceAreas: [...serviceAreas] as unknown as string[],
  }
}

// Get sublob breakdown for a specific period (for tooltip display)
export function getSublobBreakdown(
  level: AggregationLevel,
  year: number,
  period?: number, // month (1-12) or quarter (1-4) depending on level
  filters?: CentralDataFilters
) {
  // Build central filters
  const centralFilters: CentralDataFilters = { ...filters, years: [year] }
  let data = applyCentralFilters(mlrExpandedData, centralFilters)

  // Filter by period based on level
  if (level === "month" && period) {
    data = data.filter((d) => d.month === period)
  } else if (level === "quarter" && period) {
    data = data.filter((d) => getQuarter(d.month) === period)
  }

  // Aggregate by sublob
  const sublobMap = new Map<string, {
    sublob: string
    memberMonths: number
    revenue: number
    cost: number
  }>()

  for (const row of data) {
    const existing = sublobMap.get(row.sublob)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
    } else {
      sublobMap.set(row.sublob, {
        sublob: row.sublob,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
      })
    }
  }

  return Array.from(sublobMap.values())
    .map((row) => ({
      ...row,
      pmpmRevenue: row.revenue / row.memberMonths,
      pmpmCost: row.cost / row.memberMonths,
      mlr: (row.cost / row.revenue) * 100,
    }))
    .sort((a, b) => a.sublob.localeCompare(b.sublob))
}

// Service Area values
export const serviceAreas = [
  "Central Region",
  "Eastern Region",
  "Northern Region",
  "Southwest Region",
  "Western Region",
] as const

export type ServiceArea = typeof serviceAreas[number]

// Consumer Cohort types (re-export from early definition)
export const consumerCohorts = consumerCohortValues
export type ConsumerCohort = typeof consumerCohortValues[number]

// Provider Attribution types (re-export from early definition)
export const providerAttributions = providerAttributionValues
export type ProviderAttribution = typeof providerAttributionValues[number]

export interface MLRByRegionRow {
  year: number
  lob: string
  sublob: string
  serviceArea: ServiceArea
  mlr: number
  memberCount: number
  // Chronic condition flags
  anxietyDisorders: boolean
  depression: boolean
  depressiveDisorder: boolean
  diabetes: boolean
  hyperTension: boolean
  hyperlipidemia: boolean
  obesity: boolean
  tobaccoUse: boolean
}

// Get MLR by regions data derived from central expanded data
export function getMLRByRegionsData(filters?: CentralDataFilters): MLRByRegionRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)
  
  // Aggregate by year/lob/sublob/serviceArea
  const aggregated = new Map<string, {
    year: number
    lob: string
    sublob: string
    serviceArea: ServiceArea
    memberMonths: number
    cost: number
    revenue: number
    // Track chronic condition counts
    hyperTensionCount: number
    depressionCount: number
    hyperlipidemiaCount: number
    diabetesCount: number
    tobaccoUseCount: number
    obesityCount: number
    anxietyDisordersCount: number
    depressiveDisorderCount: number
    rowCount: number
  }>()

  for (const row of data) {
    const key = `${row.year}-${row.lob}-${row.sublob}-${row.serviceArea}`
    const existing = aggregated.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.cost += row.cost
      existing.revenue += row.revenue
      if (row.hyperTension) existing.hyperTensionCount++
      if (row.depression) existing.depressionCount++
      if (row.hyperlipidemia) existing.hyperlipidemiaCount++
      if (row.diabetes) existing.diabetesCount++
      if (row.tobaccoUse) existing.tobaccoUseCount++
      if (row.obesity) existing.obesityCount++
      if (row.anxietyDisorders) existing.anxietyDisordersCount++
      if (row.depressiveDisorder) existing.depressiveDisorderCount++
      existing.rowCount++
    } else {
      aggregated.set(key, {
        year: row.year,
        lob: row.lob,
        sublob: row.sublob,
        serviceArea: row.serviceArea as ServiceArea,
        memberMonths: row.memberMonths,
        cost: row.cost,
        revenue: row.revenue,
        hyperTensionCount: row.hyperTension ? 1 : 0,
        depressionCount: row.depression ? 1 : 0,
        hyperlipidemiaCount: row.hyperlipidemia ? 1 : 0,
        diabetesCount: row.diabetes ? 1 : 0,
        tobaccoUseCount: row.tobaccoUse ? 1 : 0,
        obesityCount: row.obesity ? 1 : 0,
        anxietyDisordersCount: row.anxietyDisorders ? 1 : 0,
        depressiveDisorderCount: row.depressiveDisorder ? 1 : 0,
        rowCount: 1,
      })
    }
  }

  const result: MLRByRegionRow[] = []
  for (const [, agg] of aggregated) {
    const mlr = agg.revenue > 0 ? Math.round((agg.cost / agg.revenue) * 100) : 0
    const half = agg.rowCount / 2
    result.push({
      year: agg.year,
      lob: agg.lob,
      sublob: agg.sublob,
      serviceArea: agg.serviceArea,
      mlr,
      memberCount: agg.memberMonths,
      hyperTension: agg.hyperTensionCount > half,
      depression: agg.depressionCount > half,
      hyperlipidemia: agg.hyperlipidemiaCount > half,
      diabetes: agg.diabetesCount > half,
      tobaccoUse: agg.tobaccoUseCount > half,
      obesity: agg.obesityCount > half,
      anxietyDisorders: agg.anxietyDisordersCount > half,
      depressiveDisorder: agg.depressiveDisorderCount > half,
    })
  }

  return result.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.lob !== b.lob) return a.lob.localeCompare(b.lob)
    if (a.sublob !== b.sublob) return a.sublob.localeCompare(b.sublob)
    return serviceAreas.indexOf(a.serviceArea) - serviceAreas.indexOf(b.serviceArea)
  })
}

// Get MLR data aggregated by year/lob/sublob with regional columns for the table display
export interface MLRTableRow {
  year: number
  lob: string
  sublob: string
  centralVirginia: number
  greaterHamptonRoads: number
  northernVirginia: number
  southwestVirginia: number
  westernVirginia: number
  total: number
}

export function getMLRTableData(filteredData: MLRByRegionRow[]): MLRTableRow[] {
  // Aggregate the row-level data back into table format with regional columns
  const aggregated = new Map<string, MLRTableRow>()
  
  for (const row of filteredData) {
    const key = `${row.year}-${row.lob}-${row.sublob}`
    let existing = aggregated.get(key)
    
    if (!existing) {
      existing = {
        year: row.year,
        lob: row.lob,
        sublob: row.sublob,
        centralVirginia: 0,
        greaterHamptonRoads: 0,
        northernVirginia: 0,
        southwestVirginia: 0,
        westernVirginia: 0,
        total: 0,
      }
      aggregated.set(key, existing)
    }
    
    // Map service area to column
    switch (row.serviceArea) {
      case "Central Region":
        existing.centralVirginia = row.mlr
        break
      case "Eastern Region":
        existing.greaterHamptonRoads = row.mlr
        break
      case "Northern Region":
        existing.northernVirginia = row.mlr
        break
      case "Southwest Region":
        existing.southwestVirginia = row.mlr
        break
      case "Western Region":
        existing.westernVirginia = row.mlr
        break
    }
  }
  
  // Calculate totals (weighted average based on the filtered regions)
  for (const [, row] of aggregated) {
    const regions = [row.centralVirginia, row.greaterHamptonRoads, row.northernVirginia, row.southwestVirginia, row.westernVirginia].filter(v => v > 0)
    row.total = regions.length > 0 ? Math.round(regions.reduce((a, b) => a + b, 0) / regions.length) : 0
  }
  
  return Array.from(aggregated.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.lob !== b.lob) return a.lob.localeCompare(b.lob)
    return a.sublob.localeCompare(b.sublob)
  })
}

// Get chronic condition member counts from the central data
export function getChronicConditionCounts(filters?: CentralDataFilters) {
  const data = applyCentralFilters(mlrExpandedData, filters)
  const totalMembers = data.reduce((sum, row) => sum + row.memberMonths, 0)
  
  // Derive condition counts from actual flags on the central data
  const counts = {
    anxietyDisorders: 0,
    depression: 0,
    depressiveDisorder: 0,
    diabetes: 0,
    hyperTension: 0,
    hyperlipidemia: 0,
    obesity: 0,
    tobaccoUse: 0,
  }
  
  for (const row of data) {
    if (row.anxietyDisorders) counts.anxietyDisorders += row.memberMonths
    if (row.depression) counts.depression += row.memberMonths
    if (row.depressiveDisorder) counts.depressiveDisorder += row.memberMonths
    if (row.diabetes) counts.diabetes += row.memberMonths
    if (row.hyperTension) counts.hyperTension += row.memberMonths
    if (row.hyperlipidemia) counts.hyperlipidemia += row.memberMonths
    if (row.obesity) counts.obesity += row.memberMonths
    if (row.tobaccoUse) counts.tobaccoUse += row.memberMonths
  }
  
  return {
    anxietyDisorders: Math.round(counts.anxietyDisorders / 12),
    depression: Math.round(counts.depression / 12),
    depressiveDisorder: Math.round(counts.depressiveDisorder / 12),
    diabetes: Math.round(counts.diabetes / 12),
    hyperTension: Math.round(counts.hyperTension / 12),
    hyperlipidemia: Math.round(counts.hyperlipidemia / 12),
    obesity: Math.round(counts.obesity / 12),
    tobaccoUse: Math.round(counts.tobaccoUse / 12),
    totalUniqueMembers: Math.round(totalMembers / 12),
  }
}

// Consumer cohort data row interface
export interface ConsumerCohortDataRow {
  year: number
  lob: string
  sublob: string
  serviceArea: ServiceArea
  cohort: ConsumerCohort
  memberMonths: number
  cost: number
  revenue: number
  mlr: number
  riskScore: number
}

// Get consumer cohort data derived from the central expanded data
export function getConsumerCohortData(filters?: CentralDataFilters): ConsumerCohortDataRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)
  
  // Aggregate by year/lob/sublob/serviceArea/cohort
  const aggregated = new Map<string, {
    year: number; lob: string; sublob: string; serviceArea: ServiceArea
    cohort: ConsumerCohort; memberMonths: number; cost: number; revenue: number
    weightedRisk: number
  }>()

  for (const row of data) {
    const key = `${row.year}-${row.lob}-${row.sublob}-${row.serviceArea}-${row.consumerCohort}`
    const existing = aggregated.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.cost += row.cost
      existing.revenue += row.revenue
      existing.weightedRisk += row.riskScore * row.memberMonths
    } else {
      aggregated.set(key, {
        year: row.year, lob: row.lob, sublob: row.sublob,
        serviceArea: row.serviceArea as ServiceArea,
        cohort: row.consumerCohort as ConsumerCohort,
        memberMonths: row.memberMonths, cost: row.cost, revenue: row.revenue,
        weightedRisk: row.riskScore * row.memberMonths,
      })
    }
  }

  const result: ConsumerCohortDataRow[] = []
  for (const [, agg] of aggregated) {
    const mlr = agg.revenue > 0 ? Math.round((agg.cost / agg.revenue) * 100) : 0
    result.push({
      year: agg.year, lob: agg.lob, sublob: agg.sublob,
      serviceArea: agg.serviceArea, cohort: agg.cohort,
      memberMonths: agg.memberMonths, cost: agg.cost, revenue: agg.revenue,
      mlr, riskScore: agg.memberMonths > 0 ? Math.round((agg.weightedRisk / agg.memberMonths) * 10) / 10 : 0,
    })
  }

  return result.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.lob !== b.lob) return a.lob.localeCompare(b.lob)
    if (a.sublob !== b.sublob) return a.sublob.localeCompare(b.sublob)
    return serviceAreas.indexOf(a.serviceArea) - serviceAreas.indexOf(b.serviceArea)
  })
}

// Provider attribution data row interface
export interface ProviderAttributionDataRow {
  year: number
  lob: string
  sublob: string
  serviceArea: ServiceArea
  attribution: ProviderAttribution
  memberMonths: number
  cost: number
  revenue: number
  mlr: number
  riskScore: number
}

// Grouped provider attribution data (for component compatibility)
export interface GroupedProviderAttributionRow {
  year: number
  lob: string
  sublob: string
  serviceArea: ServiceArea
  providerGroup2Attributed: { mlr: number; memberMonths: number; cost: number; revenue: number; riskScore: number }
  nonProviderGroup2: { mlr: number; memberMonths: number; cost: number; revenue: number; riskScore: number }
  providerGroup1Attributed: { mlr: number; memberMonths: number; cost: number; revenue: number; riskScore: number }
  nonProviderGroup1: { mlr: number; memberMonths: number; cost: number; revenue: number; riskScore: number }
  hyperTension: boolean
  depression: boolean
  hyperlipidemia: boolean
  diabetes: boolean
  tobaccoUse: boolean
  obesity: boolean
  anxietyDisorders: boolean
  depressiveDisorder: boolean
}

// Get provider attribution data derived from the central expanded data
export function getProviderAttributionData(filters?: CentralDataFilters): ProviderAttributionDataRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)
  
  // Aggregate by year/lob/sublob/serviceArea/attribution
  const aggregated = new Map<string, {
    year: number; lob: string; sublob: string; serviceArea: ServiceArea
    attribution: ProviderAttribution; memberMonths: number; cost: number; revenue: number
    weightedRisk: number
  }>()

  for (const row of data) {
    const key = `${row.year}-${row.lob}-${row.sublob}-${row.serviceArea}-${row.providerAttribution}`
    const existing = aggregated.get(key)
    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.cost += row.cost
      existing.revenue += row.revenue
      existing.weightedRisk += row.riskScore * row.memberMonths
    } else {
      aggregated.set(key, {
        year: row.year, lob: row.lob, sublob: row.sublob,
        serviceArea: row.serviceArea as ServiceArea,
        attribution: row.providerAttribution as ProviderAttribution,
        memberMonths: row.memberMonths, cost: row.cost, revenue: row.revenue,
        weightedRisk: row.riskScore * row.memberMonths,
      })
    }
  }

  const result: ProviderAttributionDataRow[] = []
  for (const [, agg] of aggregated) {
    const mlr = agg.revenue > 0 ? Math.round((agg.cost / agg.revenue) * 100) : 0
    result.push({
      year: agg.year, lob: agg.lob, sublob: agg.sublob,
      serviceArea: agg.serviceArea, attribution: agg.attribution,
      memberMonths: agg.memberMonths, cost: agg.cost, revenue: agg.revenue,
      mlr, riskScore: agg.memberMonths > 0 ? Math.round((agg.weightedRisk / agg.memberMonths) * 10) / 10 : 0,
    })
  }

  return result.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.lob !== b.lob) return a.lob.localeCompare(b.lob)
    if (a.sublob !== b.sublob) return a.sublob.localeCompare(b.sublob)
    return serviceAreas.indexOf(a.serviceArea) - serviceAreas.indexOf(b.serviceArea)
  })
}

// Get grouped provider attribution data (for component compatibility)
export function getGroupedProviderAttributionData(filters?: CentralDataFilters): GroupedProviderAttributionRow[] {
  const flatData = getProviderAttributionData(filters)
  
  // Group by year/lob/sublob/serviceArea
  const grouped = new Map<string, GroupedProviderAttributionRow>()
  
  for (const row of flatData) {
    const key = `${row.year}-${row.lob}-${row.sublob}-${row.serviceArea}`
    
    if (!grouped.has(key)) {
      grouped.set(key, {
        year: row.year, lob: row.lob, sublob: row.sublob, serviceArea: row.serviceArea,
        providerGroup2Attributed: { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, riskScore: 0 },
        nonProviderGroup2: { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, riskScore: 0 },
        providerGroup1Attributed: { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, riskScore: 0 },
        nonProviderGroup1: { mlr: 0, memberMonths: 0, cost: 0, revenue: 0, riskScore: 0 },
        hyperTension: false, depression: false, hyperlipidemia: false,
        diabetes: false, tobaccoUse: false, obesity: false,
        anxietyDisorders: false, depressiveDisorder: false,
      })
    }
    
    const group = grouped.get(key)!
    const attrData = { mlr: row.mlr, memberMonths: row.memberMonths, cost: row.cost, revenue: row.revenue, riskScore: row.riskScore }
    
    switch (row.attribution) {
      case "Provider Group 2": group.providerGroup2Attributed = attrData; break
      case "Non-Provider Group 2": group.nonProviderGroup2 = attrData; break
      case "Provider Group 1": group.providerGroup1Attributed = attrData; break
      case "Non-Provider Group 1": group.nonProviderGroup1 = attrData; break
    }
  }
  
  // Set chronic condition flags from the central data for this group
  const centralData = applyCentralFilters(mlrExpandedData, filters)
  for (const row of centralData) {
    const key = `${row.year}-${row.lob}-${row.sublob}-${row.serviceArea}`
    const group = grouped.get(key)
    if (group) {
      if (row.hyperTension) group.hyperTension = true
      if (row.depression) group.depression = true
      if (row.hyperlipidemia) group.hyperlipidemia = true
      if (row.diabetes) group.diabetes = true
      if (row.tobaccoUse) group.tobaccoUse = true
      if (row.obesity) group.obesity = true
      if (row.anxietyDisorders) group.anxietyDisorders = true
      if (row.depressiveDisorder) group.depressiveDisorder = true
    }
  }
  
  return Array.from(grouped.values())
}

// Cost component data interface
export interface CostComponentDataRow {
  year: number
  quarter?: number
  month?: number
  label: string
  memberMonths: number
  totalCost: number
  medicalCost: number
  ibnr: number
  rxCost: number
  reinsurance: number
  supplementalBenefits: number
  rxRebates: number
  transplantReimbursement: number
  waiverCost: number
  medicalCostPct: number
  ibnrPct: number
  rxCostPct: number
  reinsurancePct: number
  supplementalBenefitsPct: number
  rxRebatesPct: number
  transplantReimbursementPct: number
  waiverCostPct: number
  medicalCostPmpm: number
  ibnrPmpm: number
  rxCostPmpm: number
  reinsurancePmpm: number
  supplementalBenefitsPmpm: number
  rxRebatesPmpm: number
  transplantReimbursementPmpm: number
  waiverCostPmpm: number
  facilityInpatient: number
  facilityOutpatient: number
  professional: number
  others: number
  facilityInpatientPct: number
  facilityOutpatientPct: number
  professionalPct: number
  othersPct: number
  facilityInpatientPmpm: number
  facilityOutpatientPmpm: number
  professionalPmpm: number
  othersPmpm: number
}

// Get cost component data derived from the central monthly data
export function getCostComponentData(level: AggregationLevel, filters?: CentralDataFilters): CostComponentDataRow[] {
  const aggregated = aggregateByTimePeriod(level, filters)
  
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  return aggregated.map((row, index) => {
    const seed = index + row.year * 100
    const totalCost = row.cost
    const memberMonths = row.memberMonths
    
    const medicalPct = 65 + seededRandom(seed + 1) * 8
    const ibnrPct = 19 + seededRandom(seed + 2) * 5
    const rxCostPct = 6 + seededRandom(seed + 3) * 3
    const reinsurancePct = 3 + seededRandom(seed + 4) * 2
    const supplementalPct = 2 + seededRandom(seed + 5) * 1
    const rxRebatesPct = 1 + seededRandom(seed + 6) * 1
    const transplantPct = 0.5 + seededRandom(seed + 7) * 0.5
    const waiverPct = Math.max(0, 100 - medicalPct - ibnrPct - rxCostPct - reinsurancePct - supplementalPct - rxRebatesPct - transplantPct)

    const facilityInpatientPct = 32 + seededRandom(seed + 8) * 4
    const facilityOutpatientPct = 22 + seededRandom(seed + 9) * 4
    const professionalPct = 32 + seededRandom(seed + 10) * 4
    const othersPct = Math.max(0, 100 - facilityInpatientPct - facilityOutpatientPct - professionalPct)

    const label = level === "year" 
      ? `${row.year}`
      : level === "quarter"
      ? `Q${row.quarter} '${String(row.year).slice(-2)}`
      : `M${row.month} '${String(row.year).slice(-2)}`

    return {
      year: row.year,
      quarter: row.quarter,
      month: row.month,
      label,
      memberMonths,
      totalCost,
      medicalCost: totalCost * (medicalPct / 100),
      ibnr: totalCost * (ibnrPct / 100),
      rxCost: totalCost * (rxCostPct / 100),
      reinsurance: totalCost * (reinsurancePct / 100),
      supplementalBenefits: totalCost * (supplementalPct / 100),
      rxRebates: totalCost * (rxRebatesPct / 100),
      transplantReimbursement: totalCost * (transplantPct / 100),
      waiverCost: totalCost * (waiverPct / 100),
      medicalCostPct: medicalPct,
      ibnrPct,
      rxCostPct,
      reinsurancePct,
      supplementalBenefitsPct: supplementalPct,
      rxRebatesPct,
      transplantReimbursementPct: transplantPct,
      waiverCostPct: waiverPct,
      medicalCostPmpm: memberMonths > 0 ? (totalCost * (medicalPct / 100)) / memberMonths : 0,
      ibnrPmpm: memberMonths > 0 ? (totalCost * (ibnrPct / 100)) / memberMonths : 0,
      rxCostPmpm: memberMonths > 0 ? (totalCost * (rxCostPct / 100)) / memberMonths : 0,
      reinsurancePmpm: memberMonths > 0 ? (totalCost * (reinsurancePct / 100)) / memberMonths : 0,
      supplementalBenefitsPmpm: memberMonths > 0 ? (totalCost * (supplementalPct / 100)) / memberMonths : 0,
      rxRebatesPmpm: memberMonths > 0 ? (totalCost * (rxRebatesPct / 100)) / memberMonths : 0,
      transplantReimbursementPmpm: memberMonths > 0 ? (totalCost * (transplantPct / 100)) / memberMonths : 0,
      waiverCostPmpm: memberMonths > 0 ? (totalCost * (waiverPct / 100)) / memberMonths : 0,
      facilityInpatient: totalCost * (medicalPct / 100) * (facilityInpatientPct / 100),
      facilityOutpatient: totalCost * (medicalPct / 100) * (facilityOutpatientPct / 100),
      professional: totalCost * (medicalPct / 100) * (professionalPct / 100),
      others: totalCost * (medicalPct / 100) * (othersPct / 100),
      facilityInpatientPct,
      facilityOutpatientPct,
      professionalPct,
      othersPct,
      facilityInpatientPmpm: memberMonths > 0 ? (totalCost * (medicalPct / 100) * (facilityInpatientPct / 100)) / memberMonths : 0,
      facilityOutpatientPmpm: memberMonths > 0 ? (totalCost * (medicalPct / 100) * (facilityOutpatientPct / 100)) / memberMonths : 0,
      professionalPmpm: memberMonths > 0 ? (totalCost * (medicalPct / 100) * (professionalPct / 100)) / memberMonths : 0,
      othersPmpm: memberMonths > 0 ? (totalCost * (medicalPct / 100) * (othersPct / 100)) / memberMonths : 0,
    }
  })
}

// Revenue component data interface
export interface RevenueComponentDataRow {
  year: number
  quarter?: number
  month?: number
  label: string
  memberMonths: number
  totalRevenue: number
  commercialRevenue: number
  medicaidKickRevenue: number
  medicaidPremiumRevenue: number
  memberPremiums: number
  revenuePartC: number
  revenuePartD: number
  riskAccrual: number
  sequestration: number
  commercialRevenuePct: number
  medicaidKickRevenuePct: number
  medicaidPremiumRevenuePct: number
  memberPremiumsPct: number
  revenuePartCPct: number
  revenuePartDPct: number
  riskAccrualPct: number
  sequestrationPct: number
  commercialRevenuePmpm: number
  medicaidKickRevenuePmpm: number
  medicaidPremiumRevenuePmpm: number
  memberPremiumsPmpm: number
  revenuePartCPmpm: number
  revenuePartDPmpm: number
  riskAccrualPmpm: number
  sequestrationPmpm: number
}

// Get revenue component data derived from the central monthly data
export function getRevenueComponentData(level: AggregationLevel, filters?: CentralDataFilters): RevenueComponentDataRow[] {
  const aggregated = aggregateByTimePeriod(level, filters)
  
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  return aggregated.map((row, index) => {
    const seed = index + row.year * 200
    const totalRevenue = row.revenue
    const memberMonths = row.memberMonths
    
    const yearIndex = row.year - 2022
    const periodIndex = level === "quarter" ? (row.quarter || 1) - 1 : level === "month" ? (row.month || 1) - 1 : 0
    const timeProgress = (yearIndex * 4 + periodIndex) / 14

    const commercialPct = 9 + timeProgress * 10 + seededRandom(seed + 1) * 2
    const medicaidKickPct = 4 + timeProgress * 2 + seededRandom(seed + 2) * 1
    const medicaidPremiumPct = 82 - timeProgress * 12 + seededRandom(seed + 3) * 2
    const memberPremiumsPct = 1 + timeProgress * 1 + seededRandom(seed + 4) * 0.5
    const revenuePartCPct = 2 + timeProgress * 2 + seededRandom(seed + 5) * 0.5
    const revenuePartDPct = 1 + timeProgress * 1 + seededRandom(seed + 6) * 0.5
    const riskAccrualPct = timeProgress > 0.6 ? 1 + seededRandom(seed + 7) * 0.5 : 0
    // Sequestration is always 2% of (Revenue Part C + Revenue Part D)
    const revenuePartC = totalRevenue * (revenuePartCPct / 100)
    const revenuePartD = totalRevenue * (revenuePartDPct / 100)
    const sequestration = 0.02 * (revenuePartD + revenuePartC)
    const sequestrationPct = totalRevenue > 0 ? (sequestration / totalRevenue) * 100 : 0

    const label = level === "year" 
      ? `${row.year}`
      : level === "quarter"
      ? `Q${row.quarter} '${String(row.year).slice(-2)}`
      : `M${row.month} '${String(row.year).slice(-2)}`

    const commercialRevenue = totalRevenue * (commercialPct / 100)
    const medicaidKickRevenue = totalRevenue * (medicaidKickPct / 100)
    const medicaidPremiumRevenue = totalRevenue * (medicaidPremiumPct / 100)
    const memberPremiums = totalRevenue * (memberPremiumsPct / 100)
    const riskAccrual = totalRevenue * (riskAccrualPct / 100)

    return {
      year: row.year,
      quarter: row.quarter,
      month: row.month,
      label,
      memberMonths,
      totalRevenue,
      commercialRevenue,
      medicaidKickRevenue,
      medicaidPremiumRevenue,
      memberPremiums,
      revenuePartC,
      revenuePartD,
      riskAccrual,
      sequestration,
      commercialRevenuePct: commercialPct,
      medicaidKickRevenuePct: medicaidKickPct,
      medicaidPremiumRevenuePct: medicaidPremiumPct,
      memberPremiumsPct,
      revenuePartCPct,
      revenuePartDPct,
      riskAccrualPct,
      sequestrationPct,
      commercialRevenuePmpm: memberMonths > 0 ? commercialRevenue / memberMonths : 0,
      medicaidKickRevenuePmpm: memberMonths > 0 ? medicaidKickRevenue / memberMonths : 0,
      medicaidPremiumRevenuePmpm: memberMonths > 0 ? medicaidPremiumRevenue / memberMonths : 0,
      memberPremiumsPmpm: memberMonths > 0 ? memberPremiums / memberMonths : 0,
      revenuePartCPmpm: memberMonths > 0 ? revenuePartC / memberMonths : 0,
      revenuePartDPmpm: memberMonths > 0 ? revenuePartD / memberMonths : 0,
      riskAccrualPmpm: memberMonths > 0 ? riskAccrual / memberMonths : 0,
      sequestrationPmpm: memberMonths > 0 ? sequestration / memberMonths : 0,
    }
  })
}

// ── Integrated Summary (Summary Revenue, Costs, and Margin) ──────────────────
// Maps internal cohort names to the display categories used in the summary table
const integratedCohortMap: Record<string, string> = {
  "Patient-Member": "Patient members",
  "Member-only-with-claims": "Members only with claims",
  "Member-only-without-claims": "Members only without claims",
}

export interface IntegratedSummaryRow {
  lob: string
  sublob: string
  category: string // e.g. "Patient members", "Members only with claims", etc.
  memberMonths: number
  revenue: number
  cost: number
  distinctPatients: number
  careRevenue: number
  careCost: number
}

/**
 * Return rows aggregated by lob / sublob / consumer-category from the
 * fully-expanded dataset. Each row carries raw totals so the component
 * can compute PMPY, margin %, per-patient metrics, etc.
 */
export function getIntegratedSummaryData(filters?: CentralDataFilters): IntegratedSummaryRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)

  const map = new Map<string, IntegratedSummaryRow>()

  for (const row of data) {
    const category = integratedCohortMap[row.consumerCohort]
    if (!category) continue
    const key = `${row.lob}|${row.sublob}|${category}`
    const existing = map.get(key)

    // Simulate a "distinct patients" count from memberMonths using category-specific ratios
    const patientRatio =
      category === "Patient members" ? 0.038
        : category === "Members only with claims" ? 0.001
          : 0.0001

    // Simulate care delivery revenue and cost only for "Patient members"
    const careRevRatio = category === "Patient members" ? 0.42 : 0
    const careCostRatio = category === "Patient members" ? 0.38 : 0

    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
      existing.distinctPatients += Math.round(row.memberMonths * patientRatio)
      existing.careRevenue += Math.round(row.revenue * careRevRatio)
      existing.careCost += Math.round(row.cost * careCostRatio)
    } else {
      map.set(key, {
        lob: row.lob,
        sublob: row.sublob,
        category,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
        distinctPatients: Math.round(row.memberMonths * patientRatio),
        careRevenue: Math.round(row.revenue * careRevRatio),
        careCost: Math.round(row.cost * careCostRatio),
      })
    }
  }

  // Generate "Patients only" rows – people seen by care delivery but not enrolled
  // These are derived from the "Patient members" aggregates per LOB/sublob
  const patientMemberRows = [...map.values()].filter(r => r.category === "Patient members")
  for (const pm of patientMemberRows) {
    const key = `${pm.lob}|${pm.sublob}|Patients only`
    const memberYears = pm.memberMonths / 12
    const patientsOnly = Math.round(memberYears * 3.2) // ~3.2 patients-only per member-year
    map.set(key, {
      lob: pm.lob,
      sublob: pm.sublob,
      category: "Patients only",
      memberMonths: Math.round(pm.memberMonths * 0.003), // very small health-plan footprint
      revenue: 0,
      cost: 0,
      distinctPatients: patientsOnly,
      careRevenue: patientsOnly > 0 ? patientsOnly * 3315 : 0, // ~$3,315 net revenue per patient
      careCost: patientsOnly > 0 ? patientsOnly * 1782 : 0,   // ~$1,782 cost per patient
    })
  }

  return [...map.values()].sort((a, b) => {
    const lobOrder = a.lob.localeCompare(b.lob)
    if (lobOrder !== 0) return lobOrder
    const sublobOrder = a.sublob.localeCompare(b.sublob)
    if (sublobOrder !== 0) return sublobOrder
    const catOrder = ["Members only with claims", "Members only without claims", "Patient members", "Patients only"]
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category)
  })
}


// ── Patient-Members by Attribution ──────────────────────────────────────────
// Groups: "Provider Group 2 attributed", "Non-Provider Group 2 attributed", "Unattributed"
const attributionGroupMap: Record<string, string> = {
  "Provider Group 2": "Provider Group 2 attributed",
  "Provider Group 1": "Other network attributed",
  "Non-Provider Group 2": "Other network attributed",
  "Non-Provider Group 1": "Unattributed",
}

export interface PatientMembersByAttributionRow {
  attributionGroup: string
  lob: string
  sublob: string
  memberMonths: number
  revenue: number
  cost: number
  planProviderCost: number      // cost paid to the attributed provider group
  otherPlanCost: number         // other plan costs
  distinctPatients: number
  careRevenue: number
  careCost: number
}

/**
 * Return Patient-member rows aggregated by attribution group / lob / sublob
 * Only includes "Patient-Member" cohort data to match the screenshot.
 */
export function getPatientMembersByAttribution(filters?: CentralDataFilters): PatientMembersByAttributionRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)
    .filter(r => r.consumerCohort === "Patient-Member")

  const map = new Map<string, PatientMembersByAttributionRow>()

  for (const row of data) {
    const attrGroup = attributionGroupMap[row.providerAttribution] || "Unattributed"
    const key = `${attrGroup}|${row.lob}|${row.sublob}`
    const existing = map.get(key)

    // Simulate provider-specific cost split
    const isProviderGroup = row.providerAttribution.startsWith("Provider Group")
    const providerCostShare = isProviderGroup ? 0.65 : 0.35  // attributed providers get larger share
    const planProviderCost = Math.round(row.cost * providerCostShare)
    const otherPlanCost = row.cost - planProviderCost

    const careRevRatio = 0.42
    const careCostRatio = 0.38
    const patientRatio = 0.038

    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
      existing.planProviderCost += planProviderCost
      existing.otherPlanCost += otherPlanCost
      existing.distinctPatients += Math.round(row.memberMonths * patientRatio)
      existing.careRevenue += Math.round(row.revenue * careRevRatio)
      existing.careCost += Math.round(row.cost * careCostRatio)
    } else {
      map.set(key, {
        attributionGroup: attrGroup,
        lob: row.lob,
        sublob: row.sublob,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
        planProviderCost,
        otherPlanCost,
        distinctPatients: Math.round(row.memberMonths * patientRatio),
        careRevenue: Math.round(row.revenue * careRevRatio),
        careCost: Math.round(row.cost * careCostRatio),
      })
    }
  }

  const groupOrder = ["Provider Group 2 attributed", "Other network attributed", "Unattributed"]
  return [...map.values()].sort((a, b) => {
    const gA = groupOrder.indexOf(a.attributionGroup)
    const gB = groupOrder.indexOf(b.attributionGroup)
    if (gA !== gB) return gA - gB
    return a.lob.localeCompare(b.lob) || a.sublob.localeCompare(b.sublob)
  })
}


// ── Patient-Members by LOB ──────────────────────────────────────────────────
export interface PatientMembersByLobRow {
  lob: string
  sublob: string
  memberMonths: number
  revenue: number
  cost: number
  planProviderCost: number
  otherPlanCost: number
  distinctPatients: number
  careRevenue: number
  careCost: number
}

/**
 * Return Patient-member rows aggregated by LOB / sublob.
 * Uses the same logic as the attribution version but keyed on LOB.
 */
export function getPatientMembersByLob(filters?: CentralDataFilters): PatientMembersByLobRow[] {
  const data = applyCentralFilters(mlrExpandedData, filters)
    .filter(r => r.consumerCohort === "Patient-Member")

  const map = new Map<string, PatientMembersByLobRow>()

  for (const row of data) {
    const key = `${row.lob}|${row.sublob}`
    const existing = map.get(key)

    const isProviderGroup = row.providerAttribution.startsWith("Provider Group")
    const providerCostShare = isProviderGroup ? 0.65 : 0.35
    const planProviderCost = Math.round(row.cost * providerCostShare)
    const otherPlanCost = row.cost - planProviderCost

    if (existing) {
      existing.memberMonths += row.memberMonths
      existing.revenue += row.revenue
      existing.cost += row.cost
      existing.planProviderCost += planProviderCost
      existing.otherPlanCost += otherPlanCost
      existing.distinctPatients += Math.round(row.memberMonths * 0.038)
      existing.careRevenue += Math.round(row.revenue * 0.42)
      existing.careCost += Math.round(row.cost * 0.38)
    } else {
      map.set(key, {
        lob: row.lob,
        sublob: row.sublob,
        memberMonths: row.memberMonths,
        revenue: row.revenue,
        cost: row.cost,
        planProviderCost,
        otherPlanCost,
        distinctPatients: Math.round(row.memberMonths * 0.038),
        careRevenue: Math.round(row.revenue * 0.42),
        careCost: Math.round(row.cost * 0.38),
      })
    }
  }

  const lobOrder = ["COMMERCIAL", "MEDICAID", "MEDICARE"]
  return [...map.values()].sort((a, b) => {
    const lA = lobOrder.indexOf(a.lob) === -1 ? 99 : lobOrder.indexOf(a.lob)
    const lB = lobOrder.indexOf(b.lob) === -1 ? 99 : lobOrder.indexOf(b.lob)
    if (lA !== lB) return lA - lB
    return a.sublob.localeCompare(b.sublob)
  })
}
