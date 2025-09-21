"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, AlertTriangle, Settings, FileText } from "lucide-react"
import BreakTimesheetTable from "@/components/break-timesheet-table"
import EmployeeManagement from "@/components/employee-management"
import { employees, breakEntries as initialBreakEntries, hasMissingCoverage } from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

export default function EmployeeBreakDashboard() {
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>(initialBreakEntries)
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees)
  const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState(false)

  const workingEmployees = employeeList.filter((emp) => emp.workingToday)
  const totalBreaks = breakEntries.length
  const missedCoverageCount = breakEntries.filter(hasMissingCoverage).length
  const complianceRate = totalBreaks > 0 ? Math.round(((totalBreaks - missedCoverageCount) / totalBreaks) * 100) : 100

  const handleAddEmployee = (employee: Employee) => {
    setEmployeeList((prev) => [...prev, employee])
  }

  const handleUpdateEmployee = (employee: Employee) => {
    setEmployeeList((prev) => prev.map((emp) => (emp.id === employee.id ? employee : emp)))
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployeeList((prev) => prev.filter((emp) => emp.id !== id))
    setBreakEntries((prev) => prev.filter((entry) => entry.employeeId !== id))
  }

  const handleAddBreakEntry = (entry: BreakEntry) => {
    setBreakEntries((prev) => [...prev, entry])
  }

  const handleUpdateBreakEntry = (entry: BreakEntry) => {
    setBreakEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
          <p className="text-muted-foreground">Track employee breaks and manage coverage assignments</p>
        </div>
        <Button onClick={() => setIsEmployeeManagementOpen(true)} className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Employees
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workingEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              out of {employeeList.filter((emp) => emp.isActive).length} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Breaks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBreaks}</div>
            <p className="text-xs text-muted-foreground">scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Coverage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{missedCoverageCount}</div>
            <p className="text-xs text-muted-foreground">breaks need coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">coverage compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Alerts */}
      {missedCoverageCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Coverage Alerts
            </CardTitle>
            <CardDescription className="text-red-700">
              The following breaks are missing coverage assignments:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {breakEntries.filter(hasMissingCoverage).map((entry) => {
                const employee = employeeList.find((emp) => emp.id === entry.employeeId)
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                  >
                    <div>
                      <span className="font-medium">{employee?.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{entry.date}</span>
                    </div>
                    <div className="flex gap-2">
                      {entry.break1Start && entry.break1End && !entry.break1Coverage && (
                        <Badge variant="destructive">
                          Break 1: {entry.break1Start}-{entry.break1End}
                        </Badge>
                      )}
                      {entry.break2Start && entry.break2End && !entry.break2Coverage && (
                        <Badge variant="destructive">
                          Break 2: {entry.break2Start}-{entry.break2End}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="timesheet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timesheet">Break Timesheet</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="timesheet">
          <BreakTimesheetTable />
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Overview</CardTitle>
              <CardDescription>Monitor break coverage across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Coverage overview coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Management Dialog */}
      <EmployeeManagement
        isOpen={isEmployeeManagementOpen}
        onClose={() => setIsEmployeeManagementOpen(false)}
        employees={employeeList}
        breakEntries={breakEntries}
        onAddEmployee={handleAddEmployee}
        onUpdateEmployee={handleUpdateEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onAddBreakEntry={handleAddBreakEntry}
        onUpdateBreakEntry={handleUpdateBreakEntry}
      />
    </div>
  )
}
