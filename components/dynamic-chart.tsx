"use client"

import dynamic from "next/dynamic"
import type { ChartConfig } from "@/components/ui/chart"

// Dynamically import chart components with SSR disabled
export const DynamicChartContainer = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    ),
  },
)

export const DynamicChartTooltip = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartTooltip })),
  { ssr: false },
)

export const DynamicChartTooltipContent = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartTooltipContent })),
  { ssr: false },
)

export const DynamicChartLegend = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartLegend })),
  { ssr: false },
)

export const DynamicChartLegendContent = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartLegendContent })),
  { ssr: false },
)

// Re-export types
export type { ChartConfig }
