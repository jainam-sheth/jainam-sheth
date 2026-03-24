// McKinsey official color palette for data visualization
// Extracted from McKinsey Tableau .tps color palette file

// McKinsey Core Colors
export const mckinseyCore = {
  navy: "#051C2C",
  white: "#FFFFFF",
  blue: "#1F40E6",
  lightBlue: "#00A9F4",
  black: "#000000",
}

// McKinsey Data Visualization Colors (11 colors for charts)
export const mckinseyDataViz = {
  darkTeal: "#034B6F",
  teal: "#027AB1",
  brightBlue: "#39BDF3",
  lightBlue: "#71D2F1",
  lavender: "#AFC3FF",
  midTeal: "#3C96B4",
  paleBlue: "#AAE6F0",
  purple: "#8C5AC8",
  pink: "#E6A0C8",
  coral: "#E5546C",
  peach: "#FAA082",
}

// McKinsey Grays
export const mckinseyGrays = {
  gray1: "#4D4D4D",
  gray2: "#7F7F7F",
  gray3: "#B3B3B3",
  gray4: "#D0D0D0",
  gray5: "#E6E6E6",
  gray6: "#F0F0F0",
}

// McKinsey Blue Gradient (for sequential/diverging)
export const mckinseyBlueGradient = {
  start: "#051C2C",
  end: "#1F40E6",
}

// Legacy palette export for backward compatibility
export const mckinseyPalette = {
  // Primary brand colors (from Core)
  deepBlue: mckinseyCore.blue,
  darkGray: mckinseyGrays.gray1,
  lightGray: mckinseyGrays.gray3,
  gold: mckinseyDataViz.peach,
  white: mckinseyCore.white,

  // Extended chart colors - from Data Viz palette
  navy: mckinseyCore.navy,
  teal: mckinseyDataViz.teal,
  cyan: mckinseyDataViz.brightBlue,
  green: mckinseyDataViz.midTeal,
  lightGreen: mckinseyDataViz.paleBlue,
  orange: mckinseyDataViz.peach,
  amber: mckinseyDataViz.coral,
  purple: mckinseyDataViz.purple,
  magenta: mckinseyDataViz.pink,
  red: mckinseyDataViz.coral,
  slate: mckinseyGrays.gray1,
  steel: mckinseyGrays.gray2,
}

// Cost component colors - using McKinsey Data Viz palette
export const costComponentColors = {
  medicalCost: mckinseyDataViz.darkTeal,      // #034B6F - Dark teal
  ibnr: mckinseyDataViz.teal,                 // #027AB1 - Teal
  rxCost: mckinseyDataViz.purple,             // #8C5AC8 - Purple
  reinsurance: mckinseyDataViz.peach,         // #FAA082 - Peach
  supplementalBenefits: mckinseyCore.navy,    // #051C2C - Navy
  rxRebates: mckinseyDataViz.pink,            // #E6A0C8 - Pink
  transplantReimbursement: mckinseyDataViz.lavender, // #AFC3FF - Lavender
  waiverCost: mckinseyDataViz.coral,          // #E5546C - Coral
}

// Medical cost breakdown colors
export const medicalCostColors = {
  facilityInpatient: mckinseyDataViz.brightBlue,  // #39BDF3 - Bright blue
  facilityOutpatient: mckinseyDataViz.darkTeal,   // #034B6F - Dark teal
  others: mckinseyDataViz.peach,                  // #FAA082 - Peach
  professional: mckinseyDataViz.purple,           // #8C5AC8 - Purple
}

// Revenue component colors - using McKinsey Data Viz palette
export const revenueComponentColors = {
  commercialRevenue: mckinseyCore.navy,           // #051C2C - Navy (darkest)
  medicaidKickRevenue: mckinseyDataViz.midTeal,   // #3C96B4 - Mid teal
  medicaidPremiumRevenue: mckinseyDataViz.teal,   // #027AB1 - Teal (main)
  memberPremiums: mckinseyDataViz.darkTeal,       // #034B6F - Dark teal
  revenuePartC: mckinseyDataViz.peach,            // #FAA082 - Peach
  revenuePartD: mckinseyDataViz.pink,             // #E6A0C8 - Pink
  riskAccrual: mckinseyDataViz.lavender,          // #AFC3FF - Lavender
  sequestration: mckinseyDataViz.purple,          // #8C5AC8 - Purple
}

// Chart colors for general use
export const chartColors = {
  primary: mckinseyCore.blue,              // #1F40E6 - McKinsey Blue
  secondary: mckinseyDataViz.teal,         // #027AB1 - Teal
  tertiary: mckinseyCore.navy,             // #051C2C - Navy
  accent: mckinseyDataViz.coral,           // #E5546C - Coral
  highlight: mckinseyDataViz.peach,        // #FAA082 - Peach
  positive: mckinseyDataViz.midTeal,       // #3C96B4 - Mid teal
  negative: mckinseyDataViz.coral,         // #E5546C - Coral
  neutral: mckinseyGrays.gray2,            // #7F7F7F - Gray
}

// Sequential colors for trends
export const sequentialColors = {
  revenue: mckinseyDataViz.midTeal,        // #3C96B4 - Mid teal (green-ish)
  cost: mckinseyDataViz.coral,             // #E5546C - Coral (red-ish)
  mlr: mckinseyDataViz.purple,             // #8C5AC8 - Purple
  memberMonths: mckinseyGrays.gray2,       // #7F7F7F - Gray
}

// MLR trend chart colors - using McKinsey Data Viz palette
export const mlrChartColors = {
  memberMonthsBar: mckinseyGrays.gray2,    // #7F7F7F - Gray
  mlrLine: mckinseyDataViz.purple,         // #8C5AC8 - Purple
  mlrActual: mckinseyDataViz.purple,       // #8C5AC8 - Purple (alias)
  revenueBar: mckinseyDataViz.teal,        // #027AB1 - Teal
  costBar: mckinseyDataViz.darkTeal,       // #034B6F - Dark teal
  pmpmRevenue: mckinseyDataViz.brightBlue, // #39BDF3 - Bright blue
  pmpmCost: mckinseyCore.navy,             // #051C2C - Navy
  revenue: mckinseyDataViz.midTeal,        // #3C96B4 - Mid teal (distinct green-blue)
  cost: mckinseyDataViz.coral,             // #E5546C - Coral (distinct red)
  memberMonths: mckinseyDataViz.lavender,  // #AFC3FF - Lavender (distinct)
}
