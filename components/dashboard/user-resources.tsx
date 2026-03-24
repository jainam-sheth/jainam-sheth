"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mckinseyDataViz } from "@/lib/colors/mckinsey-palette"



const metricDefinitions = [
  {
    metric: "Average monthly members",
    definition: "Count of Plan members. Calculated as member months / 12 to smooth out variations in member counts throughout a calendar year.",
    notes: "",
  },
  {
    metric: "Chronic condition selector",
    definition: "Binary flags that identify Plan members with eight common chronic conditions: anxiety disorders, depression, depressive disorders, diabetes, hyperlipidemia, hypertension, obesity, and tobacco use. Conditions are identified using definitions from CMS's Chronic Condition Warehouse (CCW). Note that these flags apply to members only, so blanks will appear for consumers who are patients only (i.e., not Plan members).",
    notes: "",
  },
  {
    metric: "Consumer-driven market",
    definition: 'A geography dimension used by Care Delivery. Based on ZIP code of member residence (for patient-members, members only with claims, and members only without claims) and ZIP code of patient residence (for patients only). Allowed values are "Charlottesville", "Eastern Shore", "Gainesville", "Jacksonville", "Northern Virginia", "Orlando", "Peninsula", "Richmond", "Rockingham", "South Central", "South Florida", "Southeast", "Southeast NENC", "Southwest", "Tampa", "Valley", "West Central".',
    notes: "",
  },
  {
    metric: "Consumer-driven region",
    definition: 'Aggregation of consumer-driven markets into regions. Allowed values are "Central Virginia", "Eastern", "Florida", "Northern", "Western".',
    notes: "",
  },
  {
    metric: "Cost PMPY",
    definition: "Total plan cost per member per year. Includes medical costs, Rx costs, reinsurance, supplemental benefits, IBNR adjustments, and other cost components. Calculated as total cost divided by member-years.",
    notes: "",
  },
  {
    metric: "Distinct patients per year",
    definition: "Count of unique patients seen by Care Delivery within a calendar year. Derived from encounter/claims data in Care Delivery systems.",
    notes: "Care Delivery metric",
  },
  {
    metric: "Integrated total margin per consumer",
    definition: "Combined margin from both Health Plan and Care Delivery. Calculated as Health Plan margin PMPY plus Care Delivery margin contribution per member-year. Represents the full economic value of the consumer relationship.",
    notes: "Key integrated metric",
  },
  {
    metric: "Line of business (LOB)",
    definition: 'Top-level business segment. Allowed values are "Commercial", "Medicaid", and "Medicare". For patient-only consumers, LOB is derived from Care Delivery data.',
    notes: "",
  },
  {
    metric: "Net revenue per patient",
    definition: "Care Delivery net revenue divided by distinct patients. Represents the average revenue generated per patient encounter in the Care Delivery system.",
    notes: "Care Delivery metric",
  },
  {
    metric: "Provider attribution",
    definition: 'Identifies whether a patient-member is attributed to a specific provider group. Values include "Provider Group 2 attributed", "Other network attributed", and "Unattributed".',
    notes: "",
  },
  {
    metric: "Revenue PMPY",
    definition: "Total plan revenue per member per year. Includes premium revenue, risk adjustments, Part C/D revenue (Medicare), Medicaid premium and kick payments, and sequestration. Calculated as total revenue divided by member-years.",
    notes: "",
  },
  {
    metric: "Service area",
    definition: 'A geography dimension used by the Health Plan. Based on the rated area for the member. Allowed values include "Central Virginia", "Eastern", "Northern", "Western", "Florida", and others.',
    notes: "",
  },
  {
    metric: "Sub LOB",
    definition: 'Subdivision within a LOB. Commercial includes "FI" (fully-insured individual), "LG" (large group), "SG" (small group). Medicaid includes "CCC+" and "Medallion 4". Medicare includes sub-plans specific to geographic regions.',
    notes: "",
  },
  {
    metric: "Total cost per patient",
    definition: "Care Delivery total cost divided by distinct patients. Represents the average cost incurred per patient in the Care Delivery system.",
    notes: "Care Delivery metric",
  },
  {
    metric: "Total margin PMPY ($)",
    definition: "Revenue PMPY minus Cost PMPY. Positive values indicate profit per member per year; negative values indicate loss.",
    notes: "",
  },
  {
    metric: "Total margin PMPY (%)",
    definition: "Total margin PMPY divided by Revenue PMPY, expressed as a percentage. Indicates the profit margin rate for the health plan business.",
    notes: "",
  },
  {
    metric: "Total margin per patient ($)",
    definition: "Net revenue per patient minus total cost per patient. Represents the Care Delivery profit or loss per patient.",
    notes: "Care Delivery metric",
  },
]

const faqs = [
  {
    question: "1. From where is the data sourced?",
    response: "Plan data is sourced from internal gold layer tables. Care Delivery data is sourced from Strata and Epic-equivalent tables.",
  },
  {
    question: "2. How are LOB and sub LOB defined?",
    response: 'LOB and sub LOB are derived from Plan data for all consumer types except patient-only; for patient-only consumers, these fields are derived from Care Delivery data. The Commercial LOB includes the sub LOBs of fully-insured individual, LG (large group), and SG (small group). The Medicaid LOB includes the sub LOBs of CCC+ and Medallion 4. Medicare includes geographic sub-plan variants.',
  },
  {
    question: "3. What time periods are included?",
    response: "The dashboard includes data for CY 2023, CY 2024, and 1H 2025. Data is refreshed quarterly with the most recent complete reporting period.",
  },
  {
    question: "4. What populations are excluded?",
    response: "Plan data excludes AvMed-equivalent, self-funded, and FEHB members. These exclusions ensure consistency with the integrated consumer economics framework.",
  },
  {
    question: "5. How are chronic conditions defined?",
    response: "Chronic conditions are identified using definitions from CMS's Chronic Condition Warehouse (CCW). The eight conditions tracked are: hypertension, depression, depressive disorders, diabetes, hyperlipidemia, obesity, anxiety disorders, and tobacco use.",
  },
  {
    question: "6. Do chronic condition flags apply to all consumers?",
    response: "No. Chronic condition flags apply only to health plan members (patient-members, members only with claims, and members only without claims). Flags will be null for patient-only consumers.",
  },
  {
    question: "7. How is provider attribution determined?",
    response: 'Attribution is based on the primary care provider assignment for each member. "Provider Group 2 attributed" indicates members assigned to the primary provider group. "Other network attributed" captures members assigned to secondary network providers. "Unattributed" includes members without a clear provider assignment.',
  },
  {
    question: "8. What is the difference between Health Plan and Care Delivery metrics?",
    response: "Health Plan metrics (Revenue PMPY, Cost PMPY, Margin PMPY) reflect the insurance business economics. Care Delivery metrics (Net revenue per patient, Total cost per patient, Margin per patient) reflect the provider/care delivery business. The Integrated Total Margin combines both perspectives.",
  },
]

export function UserResourcesDashboard() {
  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto">
{/* Title */}
  <div>
  <p className="text-sm italic text-muted-foreground">Preliminary</p>
  <h2 className="text-lg font-bold text-center text-foreground">Consumer economics summary dashboard</h2>
  <h3 className="text-base font-semibold italic text-foreground mt-1">User Resources</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This page includes information to help users interpret the dashboards.
          </p>
        </div>

        {/* Metric Definitions */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Metric definitions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: mckinseyDataViz.teal }}>
                    <th className="text-left px-4 py-2.5 text-white font-semibold w-[220px]">Metric / dimension</th>
                    <th className="text-left px-4 py-2.5 text-white font-semibold">Definition</th>
                    <th className="text-left px-4 py-2.5 text-white font-semibold w-[180px]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {metricDefinitions.map((row, idx) => (
                    <tr key={row.metric} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="px-4 py-3 text-foreground font-medium align-top">{row.metric}</td>
                      <td className="px-4 py-3 text-foreground leading-relaxed">{row.definition}</td>
                      <td className="px-4 py-3 text-muted-foreground italic align-top">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">Frequently-asked questions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: mckinseyDataViz.teal }}>
                    <th className="text-left px-4 py-2.5 text-white font-semibold w-[300px]">FAQ</th>
                    <th className="text-left px-4 py-2.5 text-white font-semibold">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq, idx) => (
                    <tr key={faq.question} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="px-4 py-3 text-foreground font-medium align-top">{faq.question}</td>
                      <td className="px-4 py-3 text-foreground leading-relaxed">{faq.response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - General User Notes */}
      <div className="w-72 shrink-0">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-foreground">General user notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground leading-relaxed">
            <p>
              {"The dashboard "}
              <strong>includes data for CY 2023, CY 2024, and 1H 2025</strong>.
            </p>
            <p>
              {"Plan data "}
              <strong>excludes AvMed-equivalent, self-funded, and FEHB members</strong>.
            </p>
            <p>
              <strong>Chronic condition flags apply only to health plan members</strong>
              {"; flags will be null for patient-only consumers."}
            </p>
            <p>
              {"Care Delivery metrics are derived from encounter and claims data in provider systems. "}
              <strong>Integrated margins combine both Plan and Care Delivery economics</strong>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
