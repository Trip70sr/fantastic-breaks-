"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import chart components with SSR disabled
export const DynamicChartContainer = dynamic(
  () => import("@/components/ui/chart").then((mod) => ({ default: mod.ChartContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full flex items-center justify-center">
        <Skeleton className="h-full w-full" />
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
