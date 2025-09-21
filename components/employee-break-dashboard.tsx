"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Clock, AlertCircle, Calendar, Moon, Sun, BarChart3, UserPlus, Download, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import BreakTimesheetTable from "./break-timesheet-table"
import EmployeeManagement from "./employee-management"
import DataBackupRestore from "./data-backup-restore"
import EmailSharing from "./email-sharing"
import { employees, breakEntries, getEmployeeName, hasMissingCoverage } from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

export default function EmployeeBreakDashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees)
  const [breakList, setBreakList] = useState<BreakEntry[]>(breakEntries)
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false)
  const [showDataBackup, setShowDataBackup] = useState(false)
  const [showEmailSharing, setShowEmailSharing] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load data from localStorage if available
    const savedEmployees = localStorage.getItem("employees")
    const savedBreakEntries = localStorage.getItem("breakEntries")

    if (savedEmployees) {
      setEmployeeList(JSON.parse(savedEmployees))
    }
    if (savedBreakEntries) {
      setBreakList(JSON.parse(savedBreakEntries))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem("employees", JSON.stringify(employeeList))
    localStorage.setItem("breakEntries", JSON.stringify(breakList))
  }, [employeeList, breakList])

  if (!mounted) {
    return null
  }

  const today = new Date().toISOString().split("T")[0]
  const todayEntries = breakList.filter((entry) => entry.date === today)
  const workingToday = employeeList.filter((emp) => emp.workingToday).length
  const entriesWithMissingCoverage = todayEntries.filter(hasMissingCoverage)
  const totalBreaksToday = todayEntries.reduce((acc, entry) => {
    let count = 0
    if (entry.break1Start && entry.break1End) count++
    if (entry.break2Start && entry.break2End) count++
    return acc + count
  }, 0)

  const stats = [
    {
      title: "Total Employees",
      value: employeeList.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Working Today",
      value: workingToday,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Breaks Today",
      value: totalBreaksToday,
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Missing Coverage",
      value: entriesWithMissingCoverage.length,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
            <p className="text-muted-foreground">Manage employee breaks and coverage assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Coverage Alerts */}
        {entriesWithMissingCoverage.length > 0 && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>Coverage Alert:</strong> {entriesWithMissingCoverage.length} break(s) are missing coverage
              assignments.
              {entriesWithMissingCoverage.map((entry, index) => (
                <span key={entry.id}>
                  {index > 0 && ", "}
                  {getEmployeeName(entry.employeeId)}
                </span>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.title === "Missing Coverage" && stat.value > 0 && (
                  <Badge variant="destructive" className="mt-1">
                    Needs Attention
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="timesheet" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timesheet">Break Timesheet</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="timesheet" className="space-y-4">
            <BreakTimesheetTable
              employees={employeeList}
              breakEntries={breakList}
              onUpdateBreakEntries={setBreakList}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Department Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["RBT", "Operations", "BCBA", "Floater"].map((dept) => {
                      const deptEmployees = employeeList.filter((emp) => emp.department === dept)
                      const workingCount = deptEmployees.filter((emp) => emp.workingToday).length
                      return (
                        <div key={dept} className="flex items-center justify-between">
                          <span className="font-medium">{dept}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {workingCount}/{deptEmployees.length}
                            </span>
                            <Badge variant="outline">{deptEmployees.length} total</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Coverage Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Fully Covered</span>
                      <Badge className="bg-green-100 text-green-800">
                        {todayEntries.filter((entry) => !hasMissingCoverage(entry)).length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Missing Coverage</span>
                      <Badge variant="destructive">{entriesWithMissingCoverage.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Breaks</span>
                      <Badge variant="outline">{totalBreaksToday}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Employee Management</h3>
                <p className="text-sm text-muted-foreground">Manage employee information and departments</p>
              </div>
              <Button onClick={() => setShowEmployeeManagement(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Employees
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employeeList.map((employee) => (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{employee.name}</CardTitle>
                    <CardDescription>{employee.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant={employee.isActive ? "default" : "secondary"}>
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={employee.workingToday ? "default" : "outline"}>
                        {employee.workingToday ? "Working Today" : "Off Today"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>Backup and restore your employee and break data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowDataBackup(true)} className="w-full">
                    Open Data Manager
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Sharing
                  </CardTitle>
                  <CardDescription>Share break schedules via email or generate shareable links</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowEmailSharing(true)} className="w-full">
                    Open Email Sharing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showEmployeeManagement && (
          <EmployeeManagement
            isOpen={showEmployeeManagement}
            onClose={() => setShowEmployeeManagement(false)}
            employees={employeeList}
            onUpdateEmployees={setEmployeeList}
          />
        )}

        {showDataBackup && <DataBackupRestore isOpen={showDataBackup} onClose={() => setShowDataBackup(false)} />}

        {showEmailSharing && <EmailSharing isOpen={showEmailSharing} onClose={() => setShowEmailSharing(false)} />}
      </div>
    </div>
  )
}
