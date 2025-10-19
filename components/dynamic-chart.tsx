"use client"

import dynamic from "next/dynamic"

// Dynamically import all chart components with SSR disabled
export const ChartContainer = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartContainer), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-100 rounded-md" />,
})

export const ChartTooltip = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartTooltip), {
  ssr: false,
})

export const ChartTooltipContent = dynamic(
  () => import("@/components/ui/chart").then((mod) => mod.ChartTooltipContent),
  {
    ssr: false,
  },
)

export const ChartLegend = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartLegend), {
  ssr: false,
})

export const ChartLegendContent = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartLegendContent), {
  ssr: false,
})

// Re-export the ChartConfig type (types are always available)
export type { ChartConfig } from "@/components/ui/chart"
