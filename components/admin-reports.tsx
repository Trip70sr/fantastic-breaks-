"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Download, FileText, TrendingDown, Users, AlertCircle } from "lucide-react"
import type { BreakViolation, Employee, BreakEntry } from "@/lib/types"
import {
  generateDailyReport,
  generateMonthlyReport,
  exportDailyReportCSV,
  exportMonthlyReportCSV,
} from "@/lib/report-generator"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/dynamic-chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts"

interface AdminReportsProps {
  violations: BreakViolation[]
  employees: Employee[]
  breakEntries: BreakEntry[]
  isLoading?: boolean
}

export default function AdminReports({ violations, employees, breakEntries, isLoading = false }: AdminReportsProps) {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0])
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())

  // Generate reports
  const dailyReport = useMemo(() => {
    return generateDailyReport(selectedDate, violations, employees, breakEntries)
  }, [selectedDate, violations, employees, breakEntries])

  const monthlyReport = useMemo(() => {
    return generateMonthlyReport(selectedMonth, selectedYear, violations, employees, breakEntries)
  }, [selectedMonth, selectedYear, violations, employees, breakEntries])

  const handleExportDaily = () => {
    const csv = exportDailyReportCSV(dailyReport)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `daily-report-${selectedDate}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportMonthly = () => {
    const csv = exportMonthlyReportCSV(monthlyReport)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = `monthly-report-${monthlyReport.month}-${monthlyReport.year}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const chartConfig = {
    violations: {
      label: "Violations",
      color: "hsl(var(--chart-1))",
    },
    loss: {
      label: "Revenue Loss ($)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  // Generate violation type data for daily report
  const dailyViolationTypeData = [
    { type: "Excessive", count: dailyReport.violationsByType.excessive },
    { type: "Unauthorized", count: dailyReport.violationsByType.unauthorized },
    { type: "Insufficient Rest", count: dailyReport.violationsByType.insufficientRest },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-[200px] w-full" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-blue-900">Compliance Reports</h3>
        <p className="text-sm text-blue-600">Generate and export daily and monthly compliance reports</p>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Report</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
        </TabsList>

        {/* Daily Report */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Compliance Report
                  </CardTitle>
                  <CardDescription>Detailed breakdown of compliance violations for a specific date</CardDescription>
                </div>
                <Button onClick={handleExportDaily} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selector */}
              <div className="space-y-2">
                <Label>Select Date</Label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-slate-600" />
                    <div className="text-xs text-slate-600 font-medium">Violations</div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{dailyReport.totalViolations}</div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div className="text-xs text-red-600 font-medium">Revenue Loss</div>
                  </div>
                  <div className="text-2xl font-bold text-red-900">${dailyReport.totalRevenueLoss}</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div className="text-xs text-blue-600 font-medium">Affected</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{dailyReport.affectedEmployees.length}</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div className="text-xs text-green-600 font-medium">Compliance</div>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{dailyReport.complianceRate}%</div>
                </div>
              </div>

              {/* Violations by Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Violations by Type</Label>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyViolationTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-violations)" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Top Violator */}
              {dailyReport.topViolator && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Top Violator</Label>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-orange-900">{dailyReport.topViolator.name}</div>
                        <div className="text-sm text-orange-700">{dailyReport.topViolator.violations} violations</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-900">
                          ${dailyReport.topViolator.loss.toFixed(2)}
                        </div>
                        <div className="text-xs text-orange-700">revenue loss</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Affected Employees */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Affected Employees ({dailyReport.affectedEmployees.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {dailyReport.affectedEmployees.map((name) => (
                    <Badge key={name} variant="secondary">
                      {name}
                    </Badge>
                  ))}
                  {dailyReport.affectedEmployees.length === 0 && (
                    <p className="text-sm text-muted-foreground">No employees with violations</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Report */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Monthly Compliance Report
                  </CardTitle>
                  <CardDescription>Comprehensive monthly analysis with trends and statistics</CardDescription>
                </div>
                <Button onClick={handleExportMonthly} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Month/Year Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-600 font-medium mb-1">Total Violations</div>
                  <div className="text-2xl font-bold text-slate-900">{monthlyReport.totalViolations}</div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-xs text-red-600 font-medium mb-1">Total Loss</div>
                  <div className="text-2xl font-bold text-red-900">${monthlyReport.totalRevenueLoss}</div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-xs text-orange-600 font-medium mb-1">Avg Daily Loss</div>
                  <div className="text-2xl font-bold text-orange-900">${monthlyReport.averageDailyLoss}</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">Working Days</div>
                  <div className="text-2xl font-bold text-blue-900">{monthlyReport.workingDays}</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-600 font-medium mb-1">Compliance</div>
                  <div className="text-2xl font-bold text-green-900">{monthlyReport.complianceRate}%</div>
                </div>
              </div>

              {/* Weekly Trend */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Weekly Trend</Label>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyReport.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" tickFormatter={(v) => `Week ${v}`} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="violations"
                        stroke="var(--color-violations)"
                        name="Violations"
                      />
                      <Line yAxisId="right" type="monotone" dataKey="loss" stroke="var(--color-loss)" name="Loss ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Top Violators */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Top 5 Violators</Label>
                <div className="space-y-2">
                  {monthlyReport.topViolators.map((violator, index) => (
                    <div key={violator.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-semibold">{violator.name}</div>
                          <div className="text-xs text-muted-foreground">{violator.violations} violations</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">${violator.loss.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {monthlyReport.topViolators.length === 0 && (
                    <p className="text-sm text-muted-foreground">No violations recorded this month</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
