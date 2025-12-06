"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Users, AlertCircle, Download } from "lucide-react"
import type { BreakViolation, Employee } from "@/lib/types"
import {
  calculateRevenueImpacts,
  aggregateRevenueAnalytics,
  getTopViolators,
  exportRevenueReport,
} from "@/lib/revenue-analytics"
import { loadComplianceSettings } from "@/lib/compliance-storage"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/dynamic-chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"

interface RevenueDashboardProps {
  violations: BreakViolation[]
  employees: Employee[]
}

export default function RevenueDashboard({ violations, employees }: RevenueDashboardProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
  const settings = loadComplianceSettings()

  const impacts = useMemo(() => {
    return calculateRevenueImpacts(violations, employees, settings.hourlyRate)
  }, [violations, employees, settings.hourlyRate])

  const analytics = useMemo(() => {
    return aggregateRevenueAnalytics(impacts)
  }, [impacts])

  const topViolators = useMemo(() => {
    return getTopViolators(impacts, 5)
  }, [impacts])

  const getLossDisplay = () => {
    switch (timeframe) {
      case "daily":
        return analytics.dailyLoss
      case "weekly":
        return analytics.weeklyLoss
      case "monthly":
        return analytics.monthlyLoss
      case "yearly":
        return analytics.yearlyLoss
    }
  }

  const handleExport = () => {
    const report = exportRevenueReport(impacts, analytics)
    const blob = new Blob([report], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `revenue-impact-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Prepare chart data
  const impactByEmployeeData = Array.from(analytics.impactByEmployee.entries())
    .map(([name, loss]) => ({
      employee: name,
      loss: Number(loss.toFixed(2)),
    }))
    .sort((a, b) => b.loss - a.loss)
    .slice(0, 10)

  const impactByTypeData = Array.from(analytics.impactByType.entries()).map(([type, loss]) => ({
    type: type.replace("_", " "),
    loss: Number(loss.toFixed(2)),
    color: type === "excessive_duration" ? "#f59e0b" : type === "unauthorized_break" ? "#ef4444" : "#3b82f6",
  }))

  const chartConfig = {
    loss: {
      label: "Revenue Loss ($)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-blue-900">Revenue Loss Analytics</h3>
          <p className="text-sm text-blue-600">Track financial impact from break compliance violations</p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Projected Loss</CardTitle>
              <Select value={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">${getLossDisplay().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on ${settings.hourlyRate}/hr rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="text-3xl font-bold text-orange-900">{analytics.totalViolations}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all tracked periods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Affected Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-3xl font-bold text-blue-900">{analytics.affectedEmployees}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">With compliance violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Loss/Violation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div className="text-3xl font-bold text-red-900">${analytics.averageLossPerViolation}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per violation incident</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Loss by Employee */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Loss by Employee</CardTitle>
            <CardDescription>Top 10 employees by total revenue impact</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactByEmployeeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="employee" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="loss" fill="var(--color-loss)" name="Loss ($)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Loss by Violation Type */}
        <Card>
          <CardHeader>
            <CardTitle>Loss by Violation Type</CardTitle>
            <CardDescription>Revenue impact breakdown by violation category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, loss, percent }) => `${type}: $${loss} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="loss"
                  >
                    {impactByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Violators List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Violators by Revenue Impact</CardTitle>
          <CardDescription>Employees with highest total revenue loss from violations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {topViolators.map((violator, index) => (
                <div key={violator.employee}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold">{violator.employee}</div>
                        <div className="text-xs text-muted-foreground">{violator.count} violations</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">${violator.loss.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        ${(violator.loss / violator.count).toFixed(2)}/violation
                      </div>
                    </div>
                  </div>
                  {index < topViolators.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
