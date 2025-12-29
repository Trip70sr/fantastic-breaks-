"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Employee, BreakEntry, Department } from "@/lib/types"
import { calculateShiftHours } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/dynamic-chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ManagementAccessProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  selectedDate: string
  onFilterChange: (filters: {
    showAllDepartments: boolean
    showMissingBreaks: boolean
    showCoverageIssues: boolean
    showOvertimeAlerts: boolean
  }) => void
}

export default function ManagementAccess({
  employees,
  breakEntries,
  selectedDate,
  onFilterChange,
}: ManagementAccessProps) {
  const [showAllDepartments, setShowAllDepartments] = useState(false)
  const [showMissingBreaks, setShowMissingBreaks] = useState(false)
  const [showCoverageIssues, setShowCoverageIssues] = useState(false)
  const [showOvertimeAlerts, setShowOvertimeAlerts] = useState(false)

  const handleFilterChange = (key: string, value: boolean) => {
    const newFilters = {
      showAllDepartments,
      showMissingBreaks,
      showCoverageIssues,
      showOvertimeAlerts,
      [key]: value,
    }

    setShowAllDepartments(newFilters.showAllDepartments)
    setShowMissingBreaks(newFilters.showMissingBreaks)
    setShowCoverageIssues(newFilters.showCoverageIssues)
    setShowOvertimeAlerts(newFilters.showOvertimeAlerts)

    onFilterChange(newFilters)
  }

  const dateString = selectedDate
  const todayEntries = breakEntries.filter((entry) => new Date(entry.date).toISOString().split("T")[0] === dateString)

  // Calculate statistics
  const totalWorking = todayEntries.length
  const missingBreaks = todayEntries.filter((entry) => !entry.break1Start || !entry.break1End).length
  const coverageIssues = todayEntries.filter(
    (entry) =>
      (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
      (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId),
  ).length

  const overtimeAlerts = todayEntries.filter((entry) => {
    const hours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)
    return hours > 8
  }).length

  // Department breakdown
  const departmentStats = todayEntries.reduce(
    (acc, entry) => {
      const employee = employees.find((e) => e.id === entry.employeeId)
      if (employee) {
        const dept = employee.department
        if (!acc[dept]) {
          acc[dept] = { total: 0, withBreaks: 0, missingBreaks: 0, coverageIssues: 0 }
        }
        acc[dept].total++
        if (entry.break1Start && entry.break1End) {
          acc[dept].withBreaks++
        } else {
          acc[dept].missingBreaks++
        }
        if (
          (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
          (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId)
        ) {
          acc[dept].coverageIssues++
        }
      }
      return acc
    },
    {} as Record<Department, { total: number; withBreaks: number; missingBreaks: number; coverageIssues: number }>,
  )

  // Prepare chart data
  const chartData = Object.entries(departmentStats).map(([dept, stats]) => ({
    department: dept,
    total: stats.total,
    withBreaks: stats.withBreaks,
    missingBreaks: stats.missingBreaks,
    coverageIssues: stats.coverageIssues,
  }))

  const chartConfig = {
    total: {
      label: "Total Employees",
      color: "hsl(var(--chart-1))",
    },
    withBreaks: {
      label: "With Breaks",
      color: "hsl(var(--chart-2))",
    },
    missingBreaks: {
      label: "Missing Breaks",
      color: "hsl(var(--chart-3))",
    },
    coverageIssues: {
      label: "Coverage Issues",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  // Pie chart data for break status
  const breakStatusData = [
    { name: "With Breaks", value: totalWorking - missingBreaks, color: "#22c55e" },
    { name: "Missing Breaks", value: missingBreaks, color: "#ef4444" },
  ]

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Management View</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-blue-50 rounded-md">
            <div className="text-xs text-blue-600 font-medium">Working Today</div>
            <div className="text-2xl font-bold text-blue-900">{totalWorking}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-md">
            <div className="text-xs text-red-600 font-medium">Missing Breaks</div>
            <div className="text-2xl font-bold text-red-900">{missingBreaks}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-md">
            <div className="text-xs text-yellow-600 font-medium">Coverage Issues</div>
            <div className="text-2xl font-bold text-yellow-900">{coverageIssues}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-md">
            <div className="text-xs text-purple-600 font-medium">Overtime Alerts</div>
            <div className="text-2xl font-bold text-purple-900">{overtimeAlerts}</div>
          </div>
        </div>

        {/* Alerts */}
        {missingBreaks > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Break Compliance Issue</AlertTitle>
            <AlertDescription>{missingBreaks} employee(s) are missing scheduled breaks today.</AlertDescription>
          </Alert>
        )}

        {coverageIssues > 0 && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertTitle>Coverage Alert</AlertTitle>
            <AlertDescription>{coverageIssues} break period(s) are missing coverage assignments.</AlertDescription>
          </Alert>
        )}

        {overtimeAlerts > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Overtime Alert</AlertTitle>
            <AlertDescription>{overtimeAlerts} employee(s) are scheduled for over 8 hours today.</AlertDescription>
          </Alert>
        )}

        {totalWorking > 0 && missingBreaks === 0 && coverageIssues === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Clear</AlertTitle>
            <AlertDescription>All breaks are scheduled and covered for today.</AlertDescription>
          </Alert>
        )}

        {/* Department Breakdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Department Breakdown</Label>
          <div className="space-y-2">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dept}</Badge>
                  <span className="text-sm text-gray-600">{stats.total} working</span>
                </div>
                <div className="flex gap-2">
                  {stats.missingBreaks > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.missingBreaks} missing
                    </Badge>
                  )}
                  {stats.coverageIssues > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {stats.coverageIssues} coverage
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Department Overview</Label>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="withBreaks" fill="var(--color-withBreaks)" name="With Breaks" />
                    <Bar dataKey="missingBreaks" fill="var(--color-missingBreaks)" name="Missing Breaks" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Break Status Distribution</Label>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {breakStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-sm font-medium">Quick Filters</Label>

          <div className="flex items-center justify-between">
            <Label htmlFor="all-departments" className="text-sm">
              Show All Departments
            </Label>
            <Switch
              id="all-departments"
              checked={showAllDepartments}
              onCheckedChange={(checked) => handleFilterChange("showAllDepartments", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="missing-breaks" className="text-sm">
              Missing Breaks Only
            </Label>
            <Switch
              id="missing-breaks"
              checked={showMissingBreaks}
              onCheckedChange={(checked) => handleFilterChange("showMissingBreaks", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="coverage-issues" className="text-sm">
              Coverage Issues Only
            </Label>
            <Switch
              id="coverage-issues"
              checked={showCoverageIssues}
              onCheckedChange={(checked) => handleFilterChange("showCoverageIssues", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="overtime-alerts" className="text-sm">
              Overtime Alerts
            </Label>
            <Switch
              id="overtime-alerts"
              checked={showOvertimeAlerts}
              onCheckedChange={(checked) => handleFilterChange("showOvertimeAlerts", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
