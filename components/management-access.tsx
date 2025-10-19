"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, TrendingUp, Users, AlertCircle, Bell, Settings, Shield } from "lucide-react"
import type { BreakRecord, Employee } from "@/lib/types"
import { DynamicChartContainer, DynamicChartTooltip, DynamicChartTooltipContent } from "@/components/dynamic-chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { calculateShiftHours } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ManagementAccessProps {
  breaks: BreakRecord[]
  employees: Employee[]
}

export default function ManagementAccess({ breaks, employees }: ManagementAccessProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [managementFilters, setManagementFilters] = useState({
    showAllDepartments: false,
    showMissingBreaks: false,
    showCoverageIssues: false,
    showOvertimeAlerts: false,
  })

  const [notifications, setNotifications] = useState([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showThresholdDialog, setShowThresholdDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)

  const [thresholds, setThresholds] = useState({
    breakCompliance: 85,
    coverageCompliance: 90,
    overtimeLimit: 3,
    missingBreaksLimit: 2,
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedThresholds = localStorage.getItem("notificationThresholds")
    const savedNotificationsEnabled = localStorage.getItem("notificationsEnabled")

    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds))
    }

    if (savedNotificationsEnabled !== null) {
      setNotificationsEnabled(JSON.parse(savedNotificationsEnabled))
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("notificationThresholds", JSON.stringify(thresholds))
  }, [thresholds])

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled))
  }, [notificationsEnabled])

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...managementFilters, [filterKey]: value }
    setManagementFilters(newFilters)
  }

  // Calculate statistics
  const totalBreaks = breaks.length
  const activeEmployees = employees.filter((emp) => emp.status === "active").length
  const todayBreaks = breaks.filter((b) => {
    const today = new Date().toDateString()
    return new Date(b.date).toDateString() === today
  }).length

  // Calculate compliance rate
  const scheduledBreaks = breaks.filter((b) => b.status === "scheduled" || b.status === "completed").length
  const complianceRate = totalBreaks > 0 ? Math.round((scheduledBreaks / totalBreaks) * 100) : 0

  // Prepare chart data - breaks by day of week
  const breaksByDay = breaks.reduce(
    (acc, b) => {
      const day = new Date(b.date).toLocaleDateString("en-US", { weekday: "short" })
      acc[day] = (acc[day] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    breaks: breaksByDay[day] || 0,
  }))

  const chartConfig = {
    breaks: {
      label: "Breaks",
      color: "hsl(var(--chart-1))",
    },
  }

  // Find employees with coverage issues
  const coverageIssues = breaks.filter((b) => !b.coverage && b.status === "scheduled").length

  // Calculate detailed management statistics
  const getDetailedStats = () => {
    const todayEntries = breaks.filter((entry) => new Date(entry.date).toDateString() === new Date().toDateString())

    // Basic counts
    const totalEmployees = todayEntries.length
    const missingBreaks = todayEntries.filter((entry) => !entry.startTime || !entry.endTime).length
    const coverageIssues = todayEntries.filter((entry) => !entry.coverage && entry.status === "scheduled").length

    // Department breakdown
    const departmentBreakdown = {
      RBT: 0,
      Operations: 0,
      BCBA: 0,
      Floater: 0,
    }

    todayEntries.forEach((entry) => {
      const employee = employees.find((emp) => emp.id === entry.employeeId)
      if (employee) {
        departmentBreakdown[employee.department]++
      }
    })

    // Shift analysis
    const shiftHours = todayEntries.map((entry) => calculateShiftHours(entry.startTime, entry.endTime))
    const totalShiftHours = shiftHours.reduce((sum, hours) => sum + hours, 0)
    const averageShiftLength = totalEmployees > 0 ? totalShiftHours / totalEmployees : 0
    const longestShift = shiftHours.length > 0 ? Math.max(...shiftHours) : 0
    const shortestShift = shiftHours.length > 0 ? Math.min(...shiftHours) : 0
    const overtimeAlerts = shiftHours.filter((hours) => hours > 8).length

    // Break analysis
    let employeesWithFullBreaks = 0
    const employeesWithPartialBreaks = 0
    let employeesWithNoBreaks = 0
    let totalBreaksScheduled = 0
    let totalCoverageAssigned = 0

    todayEntries.forEach((entry) => {
      const shiftLength = calculateShiftHours(entry.startTime, entry.endTime)
      const hasBreak = entry.startTime && entry.endTime

      if (hasBreak) totalBreaksScheduled++

      if (entry.coverage) totalCoverageAssigned++

      if (!hasBreak) {
        employeesWithNoBreaks++
      } else {
        employeesWithFullBreaks++
      }
    })

    const breakComplianceRate = totalEmployees > 0 ? (employeesWithFullBreaks / totalEmployees) * 100 : 0
    const coverageComplianceRate = totalBreaksScheduled > 0 ? (totalCoverageAssigned / totalBreaksScheduled) * 100 : 0

    return {
      totalEmployees,
      missingBreaks,
      coverageIssues,
      overtimeAlerts,
      departmentBreakdown,
      totalShiftHours,
      averageShiftLength,
      breakComplianceRate,
      coverageComplianceRate,
      longestShift,
      shortestShift,
      employeesWithFullBreaks,
      employeesWithPartialBreaks,
      employeesWithNoBreaks,
      totalBreaksScheduled,
      totalCoverageAssigned,
    }
  }

  const stats = getDetailedStats()

  // Check thresholds and generate notifications
  useEffect(() => {
    if (!notificationsEnabled) return

    const newNotifications = []
    const now = new Date()

    // Break compliance threshold
    if (stats.breakComplianceRate < thresholds.breakCompliance && stats.totalEmployees > 0) {
      newNotifications.push({
        id: `break-compliance-${now.getTime()}`,
        type: "warning",
        title: "Break Compliance Below Threshold",
        message: `Break compliance rate is ${stats.breakComplianceRate.toFixed(1)}%, below the ${thresholds.breakCompliance}% threshold.`,
        timestamp: now,
        acknowledged: false,
      })
    }

    // Coverage compliance threshold
    if (stats.coverageComplianceRate < thresholds.coverageCompliance && stats.totalBreaksScheduled > 0) {
      newNotifications.push({
        id: `coverage-compliance-${now.getTime()}`,
        type: "warning",
        title: "Coverage Compliance Below Threshold",
        message: `Coverage compliance rate is ${stats.coverageComplianceRate.toFixed(1)}%, below the ${thresholds.coverageCompliance}% threshold.`,
        timestamp: now,
        acknowledged: false,
      })
    }

    // Overtime limit threshold
    if (stats.overtimeAlerts > thresholds.overtimeLimit) {
      newNotifications.push({
        id: `overtime-limit-${now.getTime()}`,
        type: "error",
        title: "Overtime Limit Exceeded",
        message: `${stats.overtimeAlerts} employees are working overtime, exceeding the limit of ${thresholds.overtimeLimit}.`,
        timestamp: now,
        acknowledged: false,
      })
    }

    // Missing breaks limit threshold
    if (stats.missingBreaks > thresholds.missingBreaksLimit) {
      newNotifications.push({
        id: `missing-breaks-limit-${now.getTime()}`,
        type: "error",
        title: "Too Many Missing Breaks",
        message: `${stats.missingBreaks} employees are missing breaks, exceeding the limit of ${thresholds.missingBreaksLimit}.`,
        timestamp: now,
        acknowledged: false,
      })
    }

    // Only add notifications that don't already exist (to prevent duplicates)
    const existingNotificationTypes = notifications.map((n) => n.title)
    const uniqueNewNotifications = newNotifications.filter((n) => !existingNotificationTypes.includes(n.title))

    if (uniqueNewNotifications.length > 0) {
      setNotifications((prev) => [...uniqueNewNotifications, ...prev].slice(0, 10)) // Keep only last 10 notifications
    }
  }, [stats, thresholds, notificationsEnabled])

  const acknowledgeNotification = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, acknowledged: true } : n)))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getComplianceColor = (rate) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getComplianceBadge = (rate) => {
    if (rate >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
  }

  const unacknowledgedNotifications = notifications.filter((n) => !n.acknowledged)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Breaks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBreaks}</div>
            <p className="text-xs text-muted-foreground">{todayBreaks} scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">out of {employees.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {scheduledBreaks} of {totalBreaks} breaks scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coverageIssues}</div>
            <p className="text-xs text-muted-foreground">breaks need coverage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Break Distribution</CardTitle>
              <CardDescription>Breaks scheduled by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <DynamicChartTooltip content={<DynamicChartTooltipContent />} />
                    <Bar dataKey="breaks" fill="var(--color-breaks)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </DynamicChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Break Patterns</CardTitle>
              <CardDescription>Analysis of break scheduling trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {employees.slice(0, 10).map((employee) => {
                    const empBreaks = breaks.filter((b) => b.employeeId === employee.id)
                    return (
                      <div key={employee.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                        <Badge variant={empBreaks.length > 0 ? "default" : "secondary"}>
                          {empBreaks.length} breaks
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Alerts</CardTitle>
              <CardDescription>Breaks that need coverage assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {breaks
                    .filter((b) => !b.coverage && b.status === "scheduled")
                    .slice(0, 10)
                    .map((breakRecord) => {
                      const employee = employees.find((e) => e.id === breakRecord.employeeId)
                      return (
                        <div key={breakRecord.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">{employee?.name || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(breakRecord.date).toLocaleDateString()} at {breakRecord.startTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">No Coverage</Badge>
                        </div>
                      )
                    })}
                  {breaks.filter((b) => !b.coverage && b.status === "scheduled").length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">All breaks have coverage assigned</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Settings Dialog */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Management Controls
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowNotificationsDialog(true)} className="relative">
                <Bell className="h-4 w-4" />
                {unacknowledgedNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unacknowledgedNotifications.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowThresholdDialog(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Notifications */}
          {unacknowledgedNotifications.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Active Alerts ({unacknowledgedNotifications.length})
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNotificationsDialog(true)}>
                  View
                </Button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {unacknowledgedNotifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      notification.type === "error" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => acknowledgeNotification(notification.id)}>
                      ×
                    </Button>
                  </div>
                ))}
                {unacknowledgedNotifications.length > 3 && (
                  <div className="text-center py-8 text-gray-500">
                    +{unacknowledgedNotifications.length - 3} more alerts
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Advanced Filters</div>
              <Button variant="ghost" size="sm" onClick={() => setShowThresholdDialog(true)}>
                Settings
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Show All Departments</div>
                <input
                  type="checkbox"
                  checked={managementFilters.showAllDepartments}
                  onChange={(e) => handleFilterChange("showAllDepartments", e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Highlight Missing Breaks</div>
                <input
                  type="checkbox"
                  checked={managementFilters.showMissingBreaks}
                  onChange={(e) => handleFilterChange("showMissingBreaks", e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Show Coverage Issues</div>
                <input
                  type="checkbox"
                  checked={managementFilters.showCoverageIssues}
                  onChange={(e) => handleFilterChange("showCoverageIssues", e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Overtime Alerts</div>
                <input
                  type="checkbox"
                  checked={managementFilters.showOvertimeAlerts}
                  onChange={(e) => handleFilterChange("showOvertimeAlerts", e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications History Dialog */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications ({notifications.length})
            </div>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    notification.type === "error" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  {!notification.acknowledged && (
                    <Button variant="ghost" size="sm" onClick={() => acknowledgeNotification(notification.id)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
