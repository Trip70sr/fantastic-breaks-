"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BreakTimesheetTable } from "./break-timesheet-table"
import { EmployeeManagement } from "./employee-management"
import { DataBackupRestore } from "./data-backup-restore"
import { EmailSharing } from "./email-sharing"
import { Users, Calendar, AlertCircle, Moon, Sun, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import type { Employee, BreakEntry, CoverageAlert } from "@/lib/types"
import { mockEmployees, mockBreakEntries } from "@/lib/data"
import { toast } from "sonner"

export function EmployeeBreakDashboard() {
  const { theme, setTheme } = useTheme()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([])
  const [coverageAlerts, setCoverageAlerts] = useState<CoverageAlert[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  useEffect(() => {
    if (mounted) {
      generateCoverageAlerts()
    }
  }, [breakEntries, mounted])

  const loadData = () => {
    try {
      const savedEmployees = localStorage.getItem("employees")
      const savedBreakEntries = localStorage.getItem("breakEntries")

      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees))
      } else {
        setEmployees(mockEmployees)
        localStorage.setItem("employees", JSON.stringify(mockEmployees))
      }

      if (savedBreakEntries) {
        setBreakEntries(JSON.parse(savedBreakEntries))
      } else {
        setBreakEntries(mockBreakEntries)
        localStorage.setItem("breakEntries", JSON.stringify(mockBreakEntries))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setEmployees(mockEmployees)
      setBreakEntries(mockBreakEntries)
      toast.error("Error loading data, using defaults")
    }
  }

  const generateCoverageAlerts = () => {
    const alerts: CoverageAlert[] = []

    breakEntries.forEach((entry) => {
      // Check break 1 coverage
      if (entry.break1Start && entry.break1End && !entry.break1Coverage.trim()) {
        alerts.push({
          id: `${entry.id}-break1`,
          employeeId: entry.employeeId,
          employeeName: entry.employeeName,
          date: entry.date,
          breakNumber: 1,
          startTime: entry.break1Start,
          endTime: entry.break1End,
          message: `Break 1 (${entry.break1Start} - ${entry.break1End}) has no coverage assigned`,
          severity: "error",
        })
      }

      // Check break 2 coverage
      if (entry.break2Start && entry.break2End && !entry.break2Coverage.trim()) {
        alerts.push({
          id: `${entry.id}-break2`,
          employeeId: entry.employeeId,
          employeeName: entry.employeeName,
          date: entry.date,
          breakNumber: 2,
          startTime: entry.break2Start,
          endTime: entry.break2End,
          message: `Break 2 (${entry.break2Start} - ${entry.break2End}) has no coverage assigned`,
          severity: "error",
        })
      }
    })

    setCoverageAlerts(alerts)
  }

  const handleEmployeeUpdate = (updatedEmployees: Employee[]) => {
    setEmployees(updatedEmployees)
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))
  }

  const handleBreakEntryUpdate = (updatedEntries: BreakEntry[]) => {
    setBreakEntries(updatedEntries)
    localStorage.setItem("breakEntries", JSON.stringify(updatedEntries))
  }

  const handleDataRestore = (data: { employees: Employee[]; breakEntries: BreakEntry[] }) => {
    setEmployees(data.employees)
    setBreakEntries(data.breakEntries)
    localStorage.setItem("employees", JSON.stringify(data.employees))
    localStorage.setItem("breakEntries", JSON.stringify(data.breakEntries))
    toast.success("Data restored successfully")
  }

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const todayEntries = breakEntries.filter((entry) => entry.date === new Date().toISOString().split("T")[0])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
            <p className="text-muted-foreground">Manage employee break schedules and coverage</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees.length}</div>
              <p className="text-xs text-muted-foreground">{employees.length - activeEmployees.length} inactive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Breaks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEntries.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{coverageAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakEntries.length}</div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Alerts */}
        {coverageAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-5 w-5" />
                Coverage Alerts ({coverageAlerts.length})
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                The following breaks need coverage assignments:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coverageAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-2 bg-white dark:bg-red-900/20 rounded border"
                  >
                    <div>
                      <span className="font-medium">{alert.employeeName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Break {alert.breakNumber} on {new Date(alert.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="destructive">No Coverage</Badge>
                  </div>
                ))}
                {coverageAlerts.length > 5 && (
                  <p className="text-sm text-muted-foreground">And {coverageAlerts.length - 5} more alerts...</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Break Schedule</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="sharing">Email Sharing</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <BreakTimesheetTable
              employees={employees}
              breakEntries={breakEntries}
              onBreakEntryUpdate={handleBreakEntryUpdate}
              coverageAlerts={coverageAlerts}
            />
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <EmployeeManagement employees={employees} onEmployeeUpdate={handleEmployeeUpdate} />
          </TabsContent>

          <TabsContent value="sharing" className="space-y-4">
            <EmailSharing employees={employees} breakEntries={breakEntries} />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DataBackupRestore employees={employees} breakEntries={breakEntries} onDataRestore={handleDataRestore} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
