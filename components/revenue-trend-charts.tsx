"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/dynamic-chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"
import type { RevenueImpact } from "@/lib/revenue-analytics"
import { generateTrends } from "@/lib/revenue-analytics"
import { TrendingUp } from "lucide-react"

interface RevenueTrendChartsProps {
  impacts: RevenueImpact[]
}

export default function RevenueTrendCharts({ impacts }: RevenueTrendChartsProps) {
  const dailyTrends = useMemo(() => generateTrends(impacts, "day"), [impacts])
  const weeklyTrends = useMemo(() => generateTrends(impacts, "week"), [impacts])
  const monthlyTrends = useMemo(() => generateTrends(impacts, "month"), [impacts])
  const yearlyTrends = useMemo(() => generateTrends(impacts, "year"), [impacts])

  const chartConfig = {
    lostRevenue: {
      label: "Revenue Loss ($)",
      color: "hsl(var(--chart-1))",
    },
    lostHours: {
      label: "Lost Hours",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Loss Trends
        </CardTitle>
        <CardDescription>Visual analysis of revenue impact across different time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          {/* Daily Trends */}
          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium mb-1">Data Points</div>
                <div className="text-xl font-bold text-blue-900">{dailyTrends.length}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-red-600 font-medium mb-1">Total Loss</div>
                <div className="text-xl font-bold text-red-900">
                  ${dailyTrends.reduce((sum, t) => sum + t.lostRevenue, 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Total Hours</div>
                <div className="text-xl font-bold text-orange-900">
                  {dailyTrends.reduce((sum, t) => sum + t.lostHours, 0).toFixed(1)}h
                </div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="lostRevenue"
                    stroke="var(--color-lostRevenue)"
                    name="Revenue Loss ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          {/* Weekly Trends */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium mb-1">Weeks Tracked</div>
                <div className="text-xl font-bold text-blue-900">{weeklyTrends.length}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-red-600 font-medium mb-1">Total Loss</div>
                <div className="text-xl font-bold text-red-900">
                  ${weeklyTrends.reduce((sum, t) => sum + t.lostRevenue, 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Avg/Week</div>
                <div className="text-xl font-bold text-orange-900">
                  $
                  {weeklyTrends.length
                    ? (weeklyTrends.reduce((sum, t) => sum + t.lostRevenue, 0) / weeklyTrends.length).toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="lostRevenue" fill="var(--color-lostRevenue)" name="Revenue Loss ($)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          {/* Monthly Trends */}
          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium mb-1">Months Tracked</div>
                <div className="text-xl font-bold text-blue-900">{monthlyTrends.length}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-red-600 font-medium mb-1">Total Loss</div>
                <div className="text-xl font-bold text-red-900">
                  ${monthlyTrends.reduce((sum, t) => sum + t.lostRevenue, 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Avg/Month</div>
                <div className="text-xl font-bold text-orange-900">
                  $
                  {monthlyTrends.length
                    ? (monthlyTrends.reduce((sum, t) => sum + t.lostRevenue, 0) / monthlyTrends.length).toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="lostRevenue"
                    stroke="var(--color-lostRevenue)"
                    name="Revenue Loss ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          {/* Yearly Trends */}
          <TabsContent value="yearly" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium mb-1">Years Tracked</div>
                <div className="text-xl font-bold text-blue-900">{yearlyTrends.length}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-red-600 font-medium mb-1">Total Loss</div>
                <div className="text-xl font-bold text-red-900">
                  ${yearlyTrends.reduce((sum, t) => sum + t.lostRevenue, 0).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Total Hours</div>
                <div className="text-xl font-bold text-orange-900">
                  {yearlyTrends.reduce((sum, t) => sum + t.lostHours, 0).toFixed(1)}h
                </div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="lostRevenue" fill="var(--color-lostRevenue)" name="Revenue Loss ($)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
