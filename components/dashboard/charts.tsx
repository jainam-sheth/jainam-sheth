'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

// Sample data for charts
const revenueData = [
  { time: '12h ago', value: 380000, previous: 350000 },
  { time: '10h ago', value: 420000, previous: 380000 },
  { time: '8h ago', value: 390000, previous: 400000 },
  { time: '6h ago', value: 450000, previous: 420000 },
  { time: '4h ago', value: 480000, previous: 430000 },
  { time: '2h ago', value: 520000, previous: 450000 },
  { time: 'Now', value: 540000, previous: 460000 },
]

const admissionsData = [
  { time: '12h ago', value: 1200, target: 1100 },
  { time: '10h ago', value: 1350, target: 1150 },
  { time: '8h ago', value: 1280, target: 1200 },
  { time: '6h ago', value: 1420, target: 1250 },
  { time: '4h ago', value: 1380, target: 1300 },
  { time: '2h ago', value: 1500, target: 1350 },
  { time: 'Now', value: 1580, target: 1400 },
]

const operatingCostData = [
  { time: '12h ago', value: 220000 },
  { time: '10h ago', value: 235000 },
  { time: '8h ago', value: 218000 },
  { time: '6h ago', value: 242000 },
  { time: '4h ago', value: 228000 },
  { time: '2h ago', value: 245000 },
  { time: 'Now', value: 238000 },
]

const utilizationData = [
  { time: '12h ago', rate: 78, capacity: 85 },
  { time: '10h ago', rate: 82, capacity: 85 },
  { time: '8h ago', rate: 76, capacity: 85 },
  { time: '6h ago', rate: 84, capacity: 85 },
  { time: '4h ago', rate: 88, capacity: 85 },
  { time: '2h ago', rate: 86, capacity: 85 },
  { time: 'Now', rate: 83, capacity: 85 },
]

const chartConfig = {
  time: {
    label: 'Time',
  },
  name: {
    label: 'Facility',
  },
  value: {
    label: 'Current',
    color: 'var(--chart-1)',
  },
  previous: {
    label: 'Previous',
    color: 'var(--chart-3)',
  },
  target: {
    label: 'Target',
    color: 'var(--chart-2)',
  },
  rate: {
    label: 'Utilization',
    color: 'var(--chart-1)',
  },
  capacity: {
    label: 'Capacity',
    color: 'var(--chart-5)',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
  cost: {
    label: 'Cost',
    color: 'var(--chart-5)',
  },
}

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <AreaChart data={revenueData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function AdmissionsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <LineChart data={admissionsData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="var(--chart-3)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function OperatingCostChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[140px] w-full">
      <AreaChart data={operatingCostData}>
        <defs>
          <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis hide />
        <Tooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-5)"
          strokeWidth={2}
          fill="url(#costGradient)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function UtilizationChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[140px] w-full">
      <LineChart data={utilizationData}>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis hide domain={[60, 100]} />
        <Tooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="capacity"
          stroke="var(--chart-5)"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

// Facility performance bar chart
const facilityData = [
  { name: 'Main Hospital', revenue: 4200000, cost: 3100000 },
  { name: 'North Clinic', revenue: 1800000, cost: 1200000 },
  { name: 'South Clinic', revenue: 1500000, cost: 980000 },
  { name: 'East Medical', revenue: 2100000, cost: 1600000 },
]

export function FacilityPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={facilityData} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          width={80}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="revenue"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          name="Revenue"
        />
      </BarChart>
    </ChartContainer>
  )
}
