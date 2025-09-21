"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, AlertTriangle, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { BreakTimesheetTable } from "./break-timesheet-table"
import { EmployeeManagement } from "./employee-management"
import { DataBackupRestore } from "./data-backup-restore"
import { EmailSharing } from "./email-sharing"
import type { Employee, BreakEntry, CoverageAlert } from "@/lib/types"
import { calculateBreakCoverage } from "@/lib/utils"

interface EmployeeBreakDashboardProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onEmployeesChange: (employees: Employee[]) => void
  onBreakEntriesChange: (breakEntries: BreakEntry[]) => void
}

export function EmployeeBreakDashboard({
  employees,
  breakEntries,
  onEmployeesChange,
  onBreakEntriesChange,
}: EmployeeBreakDashboardProps) {
  const { theme, setTheme } = useTheme()
  const [coverageAlerts, setCoverageAlerts] = useState<CoverageAlert[]>([])
  const [activeTab, setActiveTab] = useState("schedule")

  // Generate coverage alerts
  useEffect(() => {
    const alerts: CoverageAlert[] = []
    const today = new Date().toISOString().split("T")[0]

    breakEntries.forEach((entry) => {
      const employee = employees.find((emp) => emp.id === entry.employeeId)
      if (!employee || !employee.isActive) return

      // Check break 1 coverage
      if (entry.break1Start && entry.break1End && !entry.break1Coverage) {
        alerts.push({
          id: `${entry.id}-break1`,
          employeeId: entry.employeeId,
          employeeName: employee.name,
          date: entry.date,
          breakNumber: 1,
          breakTime: `${entry.break1Start} - ${entry.break1End}`,
          severity: entry.date === today ? "high" : "medium",
          message: `Break 1 (${entry.break1Start} - ${entry.break1End}) has no coverage assigned`,
        })
      }

      // Check break 2 coverage
      if (entry.break2Start && entry.break2End && !entry.break2Coverage) {
        alerts.push({
          id: `${entry.id}-break2`,
          employeeId: entry.employeeId,
          employeeName: employee.name,
          date: entry.date,
          breakNumber: 2,
          breakTime: `${entry.break2Start} - ${entry.break2End}`,
          severity: entry.date === today ? "high" : "medium",
          message: `Break 2 (${entry.break2Start} - ${entry.break2End}) has no coverage assigned`,
        })
      }
    })

    setCoverageAlerts(alerts)
  }, [breakEntries, employees])

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const todayEntries = breakEntries.filter((entry) => entry.date === new Date().toISOString().split("T")[0])
  const coveragePercentage = calculateBreakCoverage(breakEntries, employees)
  const highPriorityAlerts = coverageAlerts.filter((alert) => alert.severity === "high")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coveragePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {coveragePercentage >= 80 ? "Good coverage" : "Needs attention"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highPriorityAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {coverageAlerts.length - highPriorityAlerts.length} low priority
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Alerts */}
        {coverageAlerts.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Coverage Alerts
              </CardTitle>
              <CardDescription>The following breaks need coverage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coverageAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{alert.employeeName}</span>
                        <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.date}</div>
                  </div>
                ))}
                {coverageAlerts.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    And {coverageAlerts.length - 5} more alerts...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="schedule">Break Schedule</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="sharing">Email Sharing</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <BreakTimesheetTable
              employees={employees}
              breakEntries={breakEntries}
              onBreakEntriesUpdate={onBreakEntriesChange}
              coverageAlerts={coverageAlerts}
            />
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <EmployeeManagement employees={employees} onEmployeesUpdate={onEmployeesChange} />
          </TabsContent>

          <TabsContent value="sharing" className="space-y-4">
            <EmailSharing employees={employees} breakEntries={breakEntries} />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DataBackupRestore
              employees={employees}
              breakEntries={breakEntries}
              onDataImport={(data) => {
                onEmployeesChange(data.employees)
                onBreakEntriesChange(data.breakEntries)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
