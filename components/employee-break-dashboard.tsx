"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Coffee,
  Utensils,
  User,
  Timer,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react"
import { BreakTimesheetTable } from "@/components/break-timesheet-table"
import { EmployeeManagement } from "@/components/employee-management"
import { DataBackupRestore } from "@/components/data-backup-restore"
import { EmailSharing } from "@/components/email-sharing"
import {
  employees,
  breakEntries,
  coverageEntries,
  departmentStats,
  breakStats,
  getEmployeesWithMissingCoverage,
} from "@/lib/data"
import { formatTime, formatDuration, formatDate } from "@/lib/utils"
import type { Employee, BreakEntry, CoverageEntry } from "@/lib/types"

export function EmployeeBreakDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Get employees with missing coverage for alerts
  const employeesWithMissingCoverage = useMemo(() => {
    return getEmployeesWithMissingCoverage(selectedDate)
  }, [selectedDate])

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
  }, [searchTerm, selectedDepartment])

  // Get unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.department)))
  }, [])

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const todayBreaks = breakEntries.filter((entry) => entry.date === selectedDate)
    const todayCoverage = coverageEntries.filter((entry) => entry.date === selectedDate)
    const activeEmployees = employees.filter((emp) => emp.status === "active").length
    const totalBreakTime = todayBreaks.reduce((sum, entry) => sum + entry.duration, 0)
    const avgBreakTime = todayBreaks.length > 0 ? totalBreakTime / todayBreaks.length : 0
    const complianceRate = Math.round((todayBreaks.length / (activeEmployees * 2)) * 100) // Assuming 2 breaks per employee per day

    return {
      totalEmployees: activeEmployees,
      totalBreaks: todayBreaks.length,
      totalCoverage: todayCoverage.length,
      avgBreakTime,
      complianceRate,
      missedCoverage: employeesWithMissingCoverage.length,
    }
  }, [selectedDate, employeesWithMissingCoverage.length])

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    alert = false,
  }: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ElementType
    trend?: "up" | "down" | "neutral"
    alert?: boolean
  }) => (
    <Card className={`${alert ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${alert ? "text-red-700 dark:text-red-300" : ""}`}>{value}</div>
        {subtitle && (
          <p
            className={`text-xs ${alert ? "text-red-600 dark:text-red-400" : "text-muted-foreground"} flex items-center mt-1`}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend === "down" && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )

  const EmployeeCard = ({
    employee,
    breaks,
    coverage,
  }: {
    employee: Employee
    breaks: BreakEntry[]
    coverage: CoverageEntry[]
  }) => {
    const hasMissingCoverage = employeesWithMissingCoverage.some((emp) => emp.id === employee.id)
    const totalBreakTime = breaks.reduce((sum, entry) => sum + entry.duration, 0)
    const breakCompliance = breaks.length >= 2 ? 100 : (breaks.length / 2) * 100

    return (
      <Card className={`${hasMissingCoverage ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
              <AvatarFallback>
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base">{employee.name}</CardTitle>
              <CardDescription className="text-sm">
                {employee.position} • {employee.department}
              </CardDescription>
            </div>
            <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-muted-foreground">Breaks Today</Label>
              <div className="flex items-center space-x-1">
                <Coffee className="h-3 w-3" />
                <span className="font-medium">{breaks.length}</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Time</Label>
              <div className="flex items-center space-x-1">
                <Timer className="h-3 w-3" />
                <span className="font-medium">{formatDuration(totalBreakTime)}</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Coverage</Label>
              <div className="flex items-center space-x-1">
                {hasMissingCoverage ? (
                  <>
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="font-medium text-red-600 dark:text-red-400">Missing</span>
                  </>
                ) : coverage.length > 0 ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="font-medium text-green-600 dark:text-green-400">Complete</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-gray-500" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">None</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Compliance</Label>
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span className="font-medium">{Math.round(breakCompliance)}%</span>
              </div>
            </div>
          </div>

          {breaks.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Recent Breaks</Label>
              {breaks.slice(0, 2).map((breakEntry) => (
                <div key={breakEntry.id} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
                  <div className="flex items-center space-x-2">
                    {breakEntry.breakType === "lunch" && <Utensils className="h-3 w-3" />}
                    {breakEntry.breakType === "break" && <Coffee className="h-3 w-3" />}
                    {breakEntry.breakType === "personal" && <User className="h-3 w-3" />}
                    <span className="capitalize">{breakEntry.breakType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>
                      {formatTime(breakEntry.startTime)} - {formatTime(breakEntry.endTime)}
                    </span>
                    {breakEntry.approved ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
          <p className="text-muted-foreground">
            Track breaks, manage coverage, and ensure compliance across your organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Today
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Coverage Alerts */}
      {employeesWithMissingCoverage.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-300 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Coverage Alerts ({employeesWithMissingCoverage.length})
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              The following employees are missing coverage for {formatDate(selectedDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employeesWithMissingCoverage.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 rounded-lg border"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Employees"
              value={dashboardStats.totalEmployees}
              subtitle="Currently active"
              icon={Users}
              trend="neutral"
            />
            <StatCard
              title="Breaks Today"
              value={dashboardStats.totalBreaks}
              subtitle={`Avg ${formatDuration(dashboardStats.avgBreakTime)}`}
              icon={Coffee}
              trend="up"
            />
            <StatCard
              title="Coverage Status"
              value={`${dashboardStats.totalCoverage}/${dashboardStats.totalEmployees}`}
              subtitle="Positions covered"
              icon={Shield}
              trend="neutral"
            />
            <StatCard
              title="Missing Coverage"
              value={dashboardStats.missedCoverage}
              subtitle="Requires attention"
              icon={AlertCircle}
              trend="down"
              alert={dashboardStats.missedCoverage > 0}
            />
          </div>

          {/* Employee Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Employee Overview</h2>
              <Badge variant="outline">
                {filteredEmployees.length} of {employees.length} employees
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => {
                const employeeBreaks = breakEntries.filter(
                  (entry) => entry.employeeId === employee.id && entry.date === selectedDate,
                )
                const employeeCoverage = coverageEntries.filter(
                  (entry) => entry.employeeId === employee.id && entry.date === selectedDate,
                )
                return (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    breaks={employeeBreaks}
                    coverage={employeeCoverage}
                  />
                )
              })}
            </div>
          </div>

          {/* Department Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
              <CardDescription>Break compliance and coverage by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{dept.department}</h3>
                      <p className="text-sm text-muted-foreground">{dept.activeEmployees} active employees</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{dept.totalBreaks}</p>
                        <p className="text-xs text-muted-foreground">Total Breaks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{formatDuration(dept.averageBreakDuration)}</p>
                        <p className="text-xs text-muted-foreground">Avg Duration</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{dept.complianceRate}%</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timesheet Tab */}
        <TabsContent value="timesheet">
          <BreakTimesheetTable />
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Break Statistics</CardTitle>
                <CardDescription>Overall break patterns and compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{breakStats.totalBreaks}</p>
                    <p className="text-sm text-muted-foreground">Total Breaks</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{formatDuration(breakStats.averageDuration)}</p>
                    <p className="text-sm text-muted-foreground">Average Duration</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{breakStats.complianceRate}%</p>
                    <p className="text-sm text-muted-foreground">Compliance Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{breakStats.missedBreaks}</p>
                    <p className="text-sm text-muted-foreground">Missed Breaks</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Break Types</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2" />
                        Lunch
                      </span>
                      <span>{breakStats.breaksByType.lunch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Coffee className="h-4 w-4 mr-2" />
                        Break
                      </span>
                      <span>{breakStats.breaksByType.break}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Personal
                      </span>
                      <span>{breakStats.breaksByType.personal}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Generate reports and export data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Daily Break Report
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Weekly Summary
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <PieChart className="h-4 w-4 mr-2" />
                    Department Analysis
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Activity className="h-4 w-4 mr-2" />
                    Compliance Report
                  </Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Data Export</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataBackupRestore />
            <EmailSharing />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
