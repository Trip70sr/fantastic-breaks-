"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Download, AlertCircle, Calendar, Users, Clock, Shield } from "lucide-react"
import { formatTime, calculateTotalHours, exportToCSV } from "@/lib/utils"
import { loadEmployees, loadBreakEntries } from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

function SharedPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const employeeFilter = searchParams.get("employee")
  const dateFilter = searchParams.get("date")

  const [employees, setEmployees] = useState<Employee[]>([])
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([])
  const [showEmployeeNames, setShowEmployeeNames] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const loadedEmployees = loadEmployees()
      const loadedEntries = loadBreakEntries()

      setEmployees(loadedEmployees)

      let filteredEntries = loadedEntries

      if (employeeFilter) {
        const employee = loadedEmployees.find((e) => e.name === employeeFilter)
        if (employee) {
          filteredEntries = filteredEntries.filter((e) => e.employeeId === employee.id)
        }
      }

      if (dateFilter) {
        const targetDate = new Date(dateFilter).toISOString().split("T")[0]
        filteredEntries = filteredEntries.filter((entry) => {
          const entryDate = new Date(entry.date).toISOString().split("T")[0]
          return entryDate === targetDate
        })
      }

      setBreakEntries(filteredEntries)
      setLoading(false)
    } catch (err) {
      setError("Failed to load break data. Please try again.")
      setLoading(false)
    }
  }, [employeeFilter, dateFilter])

  const handleExport = () => {
    const filename = `break-report-${token || "shared"}-${new Date().toISOString().split("T")[0]}`
    exportToCSV(breakEntries, employees, filename)
  }

  const getEmployeeName = (employeeId: string) => {
    if (!showEmployeeNames) return "Employee"
    const employee = employees.find((e) => e.id === employeeId)
    return employee ? employee.name : "Unknown"
  }

  const totalBreaks = breakEntries.length
  const totalCovered = breakEntries.filter((e) => e.coverageEmployeeId).length
  const coverageRate = totalBreaks > 0 ? ((totalCovered / totalBreaks) * 100).toFixed(1) : "0"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-muted-foreground">Loading break report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Link</AlertTitle>
          <AlertDescription>This share link is missing a valid token.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Employee Break Report</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Shared report view
                {employeeFilter && ` • Employee: ${employeeFilter}`}
                {dateFilter && ` • Date: ${new Date(dateFilter).toLocaleDateString()}`}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Token: {token.substring(0, 8)}...
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total Break Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBreaks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Coverage Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coverageRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-names" className="text-base">
                    Show Employee Names
                  </Label>
                  <p className="text-sm text-muted-foreground">Toggle to anonymize employee information</p>
                </div>
                <Switch id="show-names" checked={showEmployeeNames} onCheckedChange={setShowEmployeeNames} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Break Schedule</CardTitle>
                <CardDescription>
                  {breakEntries.length} break {breakEntries.length === 1 ? "entry" : "entries"} found
                </CardDescription>
              </div>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Break 1</TableHead>
                    <TableHead>Coverage 1</TableHead>
                    <TableHead>Break 2</TableHead>
                    <TableHead>Coverage 2</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No break entries found for the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    breakEntries.map((entry) => {
                      const employee = employees.find((e) => e.id === entry.employeeId)
                      const coverage1 = employees.find((e) => e.id === entry.coverageEmployeeId)
                      const coverage2 = employees.find((e) => e.id === entry.coverage2EmployeeId)

                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {getEmployeeName(entry.employeeId)}
                            {employee && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {employee.department}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatTime(entry.shiftStart)} - {formatTime(entry.shiftEnd)}
                          </TableCell>
                          <TableCell>
                            {entry.break1Start && entry.break1End ? (
                              <span className="text-sm">
                                {formatTime(entry.break1Start)} - {formatTime(entry.break1End)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {coverage1 ? (
                              <span className="text-sm">{showEmployeeNames ? coverage1.name : "Employee"}</span>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                None
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.break2Start && entry.break2End ? (
                              <span className="text-sm">
                                {formatTime(entry.break2Start)} - {formatTime(entry.break2End)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {coverage2 ? (
                              <span className="text-sm">{showEmployeeNames ? coverage2.name : "Employee"}</span>
                            ) : entry.break2Start ? (
                              <Badge variant="destructive" className="text-xs">
                                None
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">{calculateTotalHours(entry)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This is a shared view of employee break data.</p>
          <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default function SharedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground">Loading break report...</p>
          </div>
        </div>
      }
    >
      <SharedPageContent />
    </Suspense>
  )
}
