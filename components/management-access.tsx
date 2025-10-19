"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import type { Employee, BreakEntry } from "@/lib/types"
import { calculateShiftHours } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import Recharts components to avoid SSR issues
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })

interface ManagementAccessProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  selectedDate: Date
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

  // Update parent component when filters change
  const handleFilterChange = (
    field: "showAllDepartments" | "showMissingBreaks" | "showCoverageIssues" | "showOvertimeAlerts",
    value: boolean,
  ) => {
    const newFilters = {
      showAllDepartments,
      showMissingBreaks,
      showCoverageIssues,
      showOvertimeAlerts,
      [field]: value,
    }

    if (field === "showAllDepartments") setShowAllDepartments(value)
    if (field === "showMissingBreaks") setShowMissingBreaks(value)
    if (field === "showCoverageIssues") setShowCoverageIssues(value)
    if (field === "showOvertimeAlerts") setShowOvertimeAlerts(value)

    onFilterChange(newFilters)
  }

  const analytics = useMemo(() => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const todayEntries = breakEntries.filter((entry) => new Date(entry.date).toISOString().split("T")[0] === dateString)

    const totalEmployees = todayEntries.length
    const employeesWithBreaks = todayEntries.filter((entry) => entry.break1Start && entry.break1End).length
    const employeesWithoutBreaks = totalEmployees - employeesWithBreaks
    const coverageIssues = todayEntries.filter(
      (entry) =>
        (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
        (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId),
    ).length

    const overtimeAlerts = todayEntries.filter((entry) => {
      const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)
      return shiftHours > 8
    }).length

    const departmentBreakdown = employees.reduce(
      (acc, emp) => {
        const hasEntry = todayEntries.some((entry) => entry.employeeId === emp.id)
        if (hasEntry) {
          acc[emp.department] = (acc[emp.department] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalEmployees,
      employeesWithBreaks,
      employeesWithoutBreaks,
      coverageIssues,
      overtimeAlerts,
      departmentBreakdown,
      complianceRate: totalEmployees > 0 ? Math.round((employeesWithBreaks / totalEmployees) * 100) : 0,
    }
  }, [employees, breakEntries, selectedDate])

  const chartData = Object.entries(analytics.departmentBreakdown).map(([department, count]) => ({
    department,
    employees: count,
  }))

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Management View
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Total Working</p>
            <p className="text-2xl font-bold">{analytics.totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Compliance Rate</p>
            <p className="text-2xl font-bold text-green-600">{analytics.complianceRate}%</p>
          </div>
        </div>

        {/* Alert Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Missing Breaks</span>
            <Badge variant={analytics.employeesWithoutBreaks > 0 ? "destructive" : "outline"}>
              {analytics.employeesWithoutBreaks}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Coverage Issues</span>
            <Badge variant={analytics.coverageIssues > 0 ? "destructive" : "outline"}>{analytics.coverageIssues}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overtime Alerts</span>
            <Badge variant={analytics.overtimeAlerts > 0 ? "secondary" : "outline"}>{analytics.overtimeAlerts}</Badge>
          </div>
        </div>

        {/* Department Breakdown Chart */}
        {chartData.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Department Breakdown</Label>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-sm font-medium">Quick Filters</Label>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Label htmlFor="all-depts" className="text-sm font-normal cursor-pointer">
                All Departments
              </Label>
            </div>
            <Switch
              id="all-depts"
              checked={showAllDepartments}
              onCheckedChange={(checked) => handleFilterChange("showAllDepartments", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <Label htmlFor="missing-breaks" className="text-sm font-normal cursor-pointer">
                Missing Breaks Only
              </Label>
            </div>
            <Switch
              id="missing-breaks"
              checked={showMissingBreaks}
              onCheckedChange={(checked) => handleFilterChange("showMissingBreaks", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Label htmlFor="coverage-issues" className="text-sm font-normal cursor-pointer">
                Coverage Issues
              </Label>
            </div>
            <Switch
              id="coverage-issues"
              checked={showCoverageIssues}
              onCheckedChange={(checked) => handleFilterChange("showCoverageIssues", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <Label htmlFor="overtime" className="text-sm font-normal cursor-pointer">
                Overtime Alerts
              </Label>
            </div>
            <Switch
              id="overtime"
              checked={showOvertimeAlerts}
              onCheckedChange={(checked) => handleFilterChange("showOvertimeAlerts", checked)}
            />
          </div>
        </div>

        {/* Status Summary */}
        <div className="space-y-2 pt-4 border-t">
          <Label className="text-sm font-medium">Status Summary</Label>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">{analytics.employeesWithBreaks} employees with breaks</span>
          </div>
          {analytics.employeesWithoutBreaks > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm">{analytics.employeesWithoutBreaks} employees need breaks</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
