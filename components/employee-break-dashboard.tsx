"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Users, Calendar, AlertTriangle, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { BreakTimesheetTable } from "./break-timesheet-table"
import { EmployeeManagement } from "./employee-management"
import { DataBackupRestore } from "./data-backup-restore"
import { EmailSharing } from "./email-sharing"
import type { Employee, BreakEntry } from "@/lib/types"
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const todayBreakEntries = breakEntries.filter((entry) => entry.date === selectedDate)
  const coveragePercentage = calculateBreakCoverage(todayBreakEntries, activeEmployees)

  const getCoverageStatus = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent", color: "bg-green-500" }
    if (percentage >= 75) return { label: "Good", color: "bg-blue-500" }
    if (percentage >= 50) return { label: "Fair", color: "bg-yellow-500" }
    return { label: "Poor", color: "bg-red-500" }
  }

  const coverageStatus = getCoverageStatus(coveragePercentage)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
            <p className="text-muted-foreground">Manage break schedules and coverage efficiently</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
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
              <div className="text-2xl font-bold">{todayBreakEntries.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for {new Date(selectedDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Status</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{coveragePercentage}%</div>
                <Badge variant="secondary" className={`${coverageStatus.color} text-white`}>
                  {coverageStatus.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Break coverage today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Break Schedule</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="sharing">Email Sharing</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Break Schedule Management</CardTitle>
                <CardDescription>View and manage employee break schedules with coverage tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <BreakTimesheetTable
                  employees={employees}
                  breakEntries={breakEntries}
                  onBreakEntriesChange={onBreakEntriesChange}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Add, edit, and manage employee information</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeManagement employees={employees} onEmployeesChange={onEmployeesChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-4">
            <EmailSharing employees={employees} breakEntries={breakEntries} />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Backup, restore, and manage your data</CardDescription>
              </CardHeader>
              <CardContent>
                <DataBackupRestore
                  employees={employees}
                  breakEntries={breakEntries}
                  onEmployeesChange={onEmployeesChange}
                  onBreakEntriesChange={onBreakEntriesChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
