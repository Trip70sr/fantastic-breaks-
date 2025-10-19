"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Clock, Calendar, User, AlertCircle } from "lucide-react"
import type { BreakRecord } from "@/lib/types"
import { formatDate, formatTime } from "@/lib/utils"

export default function SharedBreakReport() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const filterEmployee = searchParams.get("employee")
  const filterDate = searchParams.get("date")

  const [breakRecords, setBreakRecords] = useState<BreakRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEmployeeNames, setShowEmployeeNames] = useState(false)

  useEffect(() => {
    const loadSharedData = () => {
      try {
        if (!token) {
          setError("No share token provided")
          setLoading(false)
          return
        }

        // In a real app, this would validate the token and fetch data from an API
        // For now, we'll load from localStorage
        const storedRecords = localStorage.getItem("breakRecords")
        if (!storedRecords) {
          setError("No break records found")
          setLoading(false)
          return
        }

        let records: BreakRecord[] = JSON.parse(storedRecords)

        // Apply filters if provided
        if (filterEmployee) {
          records = records.filter((r) => r.employeeName === filterEmployee)
        }
        if (filterDate) {
          records = records.filter((r) => r.date === filterDate)
        }

        setBreakRecords(records)
        setLoading(false)
      } catch (err) {
        setError("Failed to load break records")
        setLoading(false)
      }
    }

    loadSharedData()
  }, [token, filterEmployee, filterDate])

  const exportToCSV = () => {
    if (breakRecords.length === 0) return

    const headers = ["Date", "Employee", "Start Time", "End Time", "Duration", "Type"]
    const rows = breakRecords.map((record) => [
      record.date,
      showEmployeeNames ? record.employeeName : "Employee",
      record.startTime,
      record.endTime || "In Progress",
      record.endTime
        ? `${Math.round((new Date(`2000-01-01T${record.endTime}`).getTime() - new Date(`2000-01-01T${record.startTime}`).getTime()) / 60000)} min`
        : "Ongoing",
      record.breakType,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `break-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getTotalBreakTime = () => {
    return breakRecords.reduce((total, record) => {
      if (record.endTime) {
        const duration =
          new Date(`2000-01-01T${record.endTime}`).getTime() - new Date(`2000-01-01T${record.startTime}`).getTime()
        return total + duration
      }
      return total
    }, 0)
  }

  const totalMinutes = Math.round(getTotalBreakTime() / 60000)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading break report...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Shared Break Report</CardTitle>
            <CardDescription>
              {filterEmployee && `Employee: ${filterEmployee} • `}
              {filterDate && `Date: ${formatDate(filterDate)} • `}
              {breakRecords.length} {breakRecords.length === 1 ? "record" : "records"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Breaks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakRecords.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMinutes} min</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(breakRecords.map((r) => r.employeeName)).size}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="show-names" checked={showEmployeeNames} onCheckedChange={setShowEmployeeNames} />
                <Label htmlFor="show-names">Show Employee Names</Label>
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Break Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Break Records</CardTitle>
          </CardHeader>
          <CardContent>
            {breakRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No break records found for the selected filters
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakRecords.map((record) => {
                      const duration = record.endTime
                        ? Math.round(
                            (new Date(`2000-01-01T${record.endTime}`).getTime() -
                              new Date(`2000-01-01T${record.startTime}`).getTime()) /
                              60000,
                          )
                        : null

                      return (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>{showEmployeeNames ? record.employeeName : "Employee"}</TableCell>
                          <TableCell>{formatTime(record.startTime)}</TableCell>
                          <TableCell>
                            {record.endTime ? (
                              formatTime(record.endTime)
                            ) : (
                              <Badge variant="secondary">In Progress</Badge>
                            )}
                          </TableCell>
                          <TableCell>{duration ? `${duration} min` : "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.breakType}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              This is a shared view of break records. Data is read-only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
