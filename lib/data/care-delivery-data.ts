// Care Delivery (Provider-only) data layer
// Encounter-level data for care delivery views

export interface CareDeliveryEncounter {
  id: string
  year: number
  month: number
  billingType: "HB" | "PB" // Hospital-Based / Professional-Based
  gender: "Male" | "Female"
  facilityName: string
  admitDate: string
  dischargeDate: string
  patientType: "Inpatient" | "Outpatient" | "Emergency" | "Observation"
  serviceLine: string
  diagnosisCode: string
  diagnosisDescription: string
  lob: string
  payments: number
  charges: number
  revenue: number
  cost: number
}

// Facilities with cost profiles: multiplier > 1.0 = higher costs (negative margin likely)
const FACILITIES: { name: string; costMultiplier: number }[] = [
  { name: "Regional Medical Center", costMultiplier: 0.80 },      // profitable
  { name: "Community Hospital East", costMultiplier: 1.15 },       // loss-making
  { name: "University Health System", costMultiplier: 0.75 },      // profitable
  { name: "Riverside General Hospital", costMultiplier: 1.10 },    // loss-making
  { name: "Metro Surgical Center", costMultiplier: 0.70 },         // highly profitable
  { name: "Coastal Medical Center", costMultiplier: 1.05 },        // break-even / slight loss
  { name: "Valley Health Partners", costMultiplier: 0.85 },        // profitable
  { name: "Northside Community Hospital", costMultiplier: 1.20 },  // loss-making
  { name: "Lakewood Medical Pavilion", costMultiplier: 1.12 },     // loss-making
]

// Service Lines
const SERVICE_LINES = [
  "Cardiology",
  "Orthopedics",
  "Oncology",
  "Neurology",
  "General Surgery",
  "Pulmonology",
  "Gastroenterology",
  "Obstetrics & Gynecology",
  "Urology",
  "Endocrinology",
  "Nephrology",
  "Primary Care",
]

// Diagnosis codes with descriptions
const DIAGNOSES = [
  { code: "I10", desc: "Essential hypertension" },
  { code: "E11.9", desc: "Type 2 diabetes without complications" },
  { code: "J44.1", desc: "COPD with acute exacerbation" },
  { code: "I25.10", desc: "Atherosclerotic heart disease" },
  { code: "M17.11", desc: "Primary osteoarthritis, right knee" },
  { code: "C34.90", desc: "Malignant neoplasm of lung" },
  { code: "N18.3", desc: "Chronic kidney disease, stage 3" },
  { code: "I48.91", desc: "Atrial fibrillation" },
  { code: "K21.0", desc: "GERD with esophagitis" },
  { code: "G20", desc: "Parkinson disease" },
  { code: "E78.5", desc: "Hyperlipidemia" },
  { code: "J18.9", desc: "Pneumonia, unspecified" },
  { code: "I50.9", desc: "Heart failure, unspecified" },
  { code: "M54.5", desc: "Low back pain" },
  { code: "F32.9", desc: "Major depressive disorder" },
]

const LOBS = ["COMMERCIAL", "MEDICAID", "MEDICARE"]
const BILLING_TYPES: ("HB" | "PB")[] = ["HB", "PB"]
const GENDERS: ("Male" | "Female")[] = ["Male", "Female"]
const PATIENT_TYPES: CareDeliveryEncounter["patientType"][] = ["Inpatient", "Outpatient", "Emergency", "Observation"]

// Seeded RNG for reproducibility
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateEncounters(): CareDeliveryEncounter[] {
  const rng = seededRng(20260227)
  const encounters: CareDeliveryEncounter[] = []
  let id = 1

  // Generate encounters across 2023, 2024, 2025
  for (const year of [2023, 2024, 2025]) {
    const maxMonth = year === 2025 ? 6 : 12
    for (let month = 1; month <= maxMonth; month++) {
      // ~70 encounters per month
      const count = 60 + Math.floor(rng() * 20)
      for (let i = 0; i < count; i++) {
        const billingType = BILLING_TYPES[Math.floor(rng() * BILLING_TYPES.length)]
        const gender = GENDERS[Math.floor(rng() * GENDERS.length)]
        const facilityObj = FACILITIES[Math.floor(rng() * FACILITIES.length)]
        const facility = facilityObj.name
        const patientType = PATIENT_TYPES[weightedPick(rng(), [0.25, 0.45, 0.18, 0.12])]
        const serviceLine = SERVICE_LINES[Math.floor(rng() * SERVICE_LINES.length)]
        const diag = DIAGNOSES[Math.floor(rng() * DIAGNOSES.length)]
        const lob = LOBS[weightedPick(rng(), [0.35, 0.30, 0.35])]

        // Admit/discharge dates
        const day = 1 + Math.floor(rng() * 28)
        const los = patientType === "Inpatient" ? 2 + Math.floor(rng() * 8) :
          patientType === "Observation" ? 1 + Math.floor(rng() * 2) : 0
        const admitDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const disDay = Math.min(day + los, 28)
        const dischargeDate = `${year}-${String(month).padStart(2, "0")}-${String(disDay).padStart(2, "0")}`

        // Financial data varies by patient type, LOB, billing type
        const baseCharge = patientType === "Inpatient" ? 25000 + rng() * 75000 :
          patientType === "Emergency" ? 8000 + rng() * 20000 :
          patientType === "Observation" ? 6000 + rng() * 15000 :
          2000 + rng() * 12000

        const lobMultiplier = lob === "MEDICARE" ? 1.2 : lob === "MEDICAID" ? 0.75 : 1.0
        const billingMultiplier = billingType === "HB" ? 1.15 : 0.85

        const charges = Math.round(baseCharge * lobMultiplier * billingMultiplier)
        const paymentRate = 0.30 + rng() * 0.25 // 30-55% of charges
        const payments = Math.round(charges * paymentRate)
        const revenue = Math.round(payments * (0.92 + rng() * 0.12)) // 92-104% of payments
        const baseCostRate = 0.75 + rng() * 0.20 // 75-95% base rate
        const cost = Math.round(revenue * baseCostRate * facilityObj.costMultiplier)

        encounters.push({
          id: `ENC-${String(id++).padStart(5, "0")}`,
          year,
          month,
          billingType,
          gender,
          facilityName: facility,
          admitDate,
          dischargeDate,
          patientType,
          serviceLine,
          diagnosisCode: diag.code,
          diagnosisDescription: diag.desc,
          lob,
          payments,
          charges,
          revenue,
          cost,
        })
      }
    }
  }
  return encounters
}

function weightedPick(r: number, weights: number[]): number {
  let cum = 0
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i]
    if (r < cum) return i
  }
  return weights.length - 1
}

// Master encounter data
export const careDeliveryEncounters: CareDeliveryEncounter[] = generateEncounters()

// ── Filter options ──────────────────────────────────────────────────────────
export function getCareDeliveryFilterOptions() {
  return {
    years: [...new Set(careDeliveryEncounters.map(e => e.year))].sort(),
    facilities: [...new Set(careDeliveryEncounters.map(e => e.facilityName))].sort(),
    billingTypes: [...new Set(careDeliveryEncounters.map(e => e.billingType))].sort() as ("HB" | "PB")[],
    lobs: [...new Set(careDeliveryEncounters.map(e => e.lob))].sort(),
    serviceLines: [...new Set(careDeliveryEncounters.map(e => e.serviceLine))].sort(),
    genders: [...new Set(careDeliveryEncounters.map(e => e.gender))].sort() as ("Male" | "Female")[],
    patientTypes: [...new Set(careDeliveryEncounters.map(e => e.patientType))].sort(),
  }
}

// ── Filter interface ────────────────────────────────────────────────────────
export interface CareDeliveryFilters {
  years?: number[]
  facilities?: string[]
  billingTypes?: string[]
  lobs?: string[]
  serviceLines?: string[]
  genders?: string[]
  patientTypes?: string[]
}

function applyFilters(data: CareDeliveryEncounter[], filters?: CareDeliveryFilters): CareDeliveryEncounter[] {
  if (!filters) return data
  let result = data
  if (filters.years?.length) result = result.filter(e => filters.years!.includes(e.year))
  if (filters.facilities?.length) result = result.filter(e => filters.facilities!.includes(e.facilityName))
  if (filters.billingTypes?.length) result = result.filter(e => filters.billingTypes!.includes(e.billingType))
  if (filters.lobs?.length) result = result.filter(e => filters.lobs!.includes(e.lob))
  if (filters.serviceLines?.length) result = result.filter(e => filters.serviceLines!.includes(e.serviceLine))
  if (filters.genders?.length) result = result.filter(e => filters.genders!.includes(e.gender))
  if (filters.patientTypes?.length) result = result.filter(e => filters.patientTypes!.includes(e.patientType))
  return result
}

// ── Overview KPIs ───────────────────────────────────────────────────────────
export interface CareDeliveryKPIs {
  totalEncounters: number
  totalRevenue: number
  totalCost: number
  totalCharges: number
  totalPayments: number
  margin: number
  marginPct: number
  avgRevenuePerEncounter: number
  avgCostPerEncounter: number
}

export function getCareDeliveryKPIs(filters?: CareDeliveryFilters): CareDeliveryKPIs {
  const data = applyFilters(careDeliveryEncounters, filters)
  const totalRevenue = data.reduce((s, e) => s + e.revenue, 0)
  const totalCost = data.reduce((s, e) => s + e.cost, 0)
  const totalCharges = data.reduce((s, e) => s + e.charges, 0)
  const totalPayments = data.reduce((s, e) => s + e.payments, 0)
  const margin = totalRevenue - totalCost
  return {
    totalEncounters: data.length,
    totalRevenue,
    totalCost,
    totalCharges,
    totalPayments,
    margin,
    marginPct: totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0,
    avgRevenuePerEncounter: data.length > 0 ? Math.round(totalRevenue / data.length) : 0,
    avgCostPerEncounter: data.length > 0 ? Math.round(totalCost / data.length) : 0,
  }
}

// ── Monthly trend ───────────────────────────────────────────────────────────
export interface CareDeliveryMonthlyTrend {
  year: number
  month: number
  label: string
  encounters: number
  revenue: number
  cost: number
  margin: number
}

export function getCareDeliveryMonthlyTrend(filters?: CareDeliveryFilters): CareDeliveryMonthlyTrend[] {
  const data = applyFilters(careDeliveryEncounters, filters)
  const map = new Map<string, CareDeliveryMonthlyTrend>()

  for (const e of data) {
    const key = `${e.year}-${e.month}`
    const existing = map.get(key)
    if (existing) {
      existing.encounters += 1
      existing.revenue += e.revenue
      existing.cost += e.cost
      existing.margin += e.revenue - e.cost
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      map.set(key, {
        year: e.year,
        month: e.month,
        label: `${monthNames[e.month - 1]} ${e.year}`,
        encounters: 1,
        revenue: e.revenue,
        cost: e.cost,
        margin: e.revenue - e.cost,
      })
    }
  }
  return [...map.values()].sort((a, b) => a.year - b.year || a.month - b.month)
}

// ── By LOB ──────────────────────────────────────────────────────────────────
export interface CareDeliveryByLob {
  lob: string
  encounters: number
  revenue: number
  cost: number
  margin: number
  charges: number
  payments: number
}

export function getCareDeliveryByLob(filters?: CareDeliveryFilters): CareDeliveryByLob[] {
  const data = applyFilters(careDeliveryEncounters, filters)
  const map = new Map<string, CareDeliveryByLob>()
  for (const e of data) {
    const existing = map.get(e.lob)
    if (existing) {
      existing.encounters += 1
      existing.revenue += e.revenue
      existing.cost += e.cost
      existing.margin += e.revenue - e.cost
      existing.charges += e.charges
      existing.payments += e.payments
    } else {
      map.set(e.lob, { lob: e.lob, encounters: 1, revenue: e.revenue, cost: e.cost, margin: e.revenue - e.cost, charges: e.charges, payments: e.payments })
    }
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue)
}

// ── By Service Line ─────────────────────────────────────────────────────────
export interface CareDeliveryByServiceLine {
  serviceLine: string
  encounters: number
  revenue: number
  cost: number
  margin: number
  marginPct: number
  charges: number
  payments: number
  avgRevenuePerEncounter: number
  avgCostPerEncounter: number
  byLob: { lob: string; encounters: number; revenue: number; cost: number }[]
}

export function getCareDeliveryByServiceLine(filters?: CareDeliveryFilters): CareDeliveryByServiceLine[] {
  const data = applyFilters(careDeliveryEncounters, filters)
  const map = new Map<string, { total: Omit<CareDeliveryByServiceLine, "byLob" | "marginPct" | "avgRevenuePerEncounter" | "avgCostPerEncounter">; lobMap: Map<string, { lob: string; encounters: number; revenue: number; cost: number }> }>()

  for (const e of data) {
    if (!map.has(e.serviceLine)) {
      map.set(e.serviceLine, {
        total: { serviceLine: e.serviceLine, encounters: 0, revenue: 0, cost: 0, margin: 0, charges: 0, payments: 0 },
        lobMap: new Map(),
      })
    }
    const entry = map.get(e.serviceLine)!
    entry.total.encounters += 1
    entry.total.revenue += e.revenue
    entry.total.cost += e.cost
    entry.total.margin += e.revenue - e.cost
    entry.total.charges += e.charges
    entry.total.payments += e.payments

    if (!entry.lobMap.has(e.lob)) {
      entry.lobMap.set(e.lob, { lob: e.lob, encounters: 0, revenue: 0, cost: 0 })
    }
    const lob = entry.lobMap.get(e.lob)!
    lob.encounters += 1
    lob.revenue += e.revenue
    lob.cost += e.cost
  }

  return [...map.values()]
    .map(({ total, lobMap }) => ({
      ...total,
      marginPct: total.revenue > 0 ? ((total.revenue - total.cost) / total.revenue) * 100 : 0,
      avgRevenuePerEncounter: total.encounters > 0 ? Math.round(total.revenue / total.encounters) : 0,
      avgCostPerEncounter: total.encounters > 0 ? Math.round(total.cost / total.encounters) : 0,
      byLob: [...lobMap.values()].sort((a, b) => b.revenue - a.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

// ── By Facility ─────────────────────────────────────────────────────────────
export interface CareDeliveryByFacility {
  facilityName: string
  encounters: number
  revenue: number
  cost: number
  margin: number
  marginPct: number
  charges: number
  payments: number
  avgRevenuePerEncounter: number
  hbPct: number // % hospital-based billing
  pbPct: number // % professional billing
}

export function getCareDeliveryByFacility(filters?: CareDeliveryFilters): CareDeliveryByFacility[] {
  const data = applyFilters(careDeliveryEncounters, filters)
  const map = new Map<string, { encounters: number; revenue: number; cost: number; charges: number; payments: number; hbCount: number }>()

  for (const e of data) {
    if (!map.has(e.facilityName)) {
      map.set(e.facilityName, { encounters: 0, revenue: 0, cost: 0, charges: 0, payments: 0, hbCount: 0 })
    }
    const f = map.get(e.facilityName)!
    f.encounters += 1
    f.revenue += e.revenue
    f.cost += e.cost
    f.charges += e.charges
    f.payments += e.payments
    if (e.billingType === "HB") f.hbCount += 1
  }

  return [...map.entries()]
    .map(([name, f]) => ({
      facilityName: name,
      encounters: f.encounters,
      revenue: f.revenue,
      cost: f.cost,
      margin: f.revenue - f.cost,
      marginPct: f.revenue > 0 ? ((f.revenue - f.cost) / f.revenue) * 100 : 0,
      charges: f.charges,
      payments: f.payments,
      avgRevenuePerEncounter: f.encounters > 0 ? Math.round(f.revenue / f.encounters) : 0,
      hbPct: f.encounters > 0 ? (f.hbCount / f.encounters) * 100 : 0,
      pbPct: f.encounters > 0 ? ((f.encounters - f.hbCount) / f.encounters) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

// ── Patient Mix ─────────────────────────────────────────────────────────────
export interface PatientMixBreakdown {
  category: string
  value: string
  encounters: number
  revenue: number
  cost: number
  margin: number
  pctOfTotal: number
}

export function getPatientMixByDimension(
  dimension: "billingType" | "gender" | "patientType",
  filters?: CareDeliveryFilters,
): PatientMixBreakdown[] {
  const data = applyFilters(careDeliveryEncounters, filters)
  const total = data.length
  const map = new Map<string, { encounters: number; revenue: number; cost: number }>()

  for (const e of data) {
    const key = e[dimension]
    if (!map.has(key)) map.set(key, { encounters: 0, revenue: 0, cost: 0 })
    const m = map.get(key)!
    m.encounters += 1
    m.revenue += e.revenue
    m.cost += e.cost
  }

  const labels: Record<string, string> = {
    billingType: "Billing Type",
    gender: "Gender",
    patientType: "Patient Type",
  }

  return [...map.entries()]
    .map(([value, m]) => ({
      category: labels[dimension],
      value,
      encounters: m.encounters,
      revenue: m.revenue,
      cost: m.cost,
      margin: m.revenue - m.cost,
      pctOfTotal: total > 0 ? (m.encounters / total) * 100 : 0,
    }))
    .sort((a, b) => b.encounters - a.encounters)
}
