"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, EyeOff, Calendar, User, Clock, AlertCircle } from "lucide-react"
import type { BreakRecord } from "@/lib/types"
import { formatTime, calculateShiftHours, formatShiftHours } from "@/lib/utils"

export default function SharedBreakReport() {
  const searchParams = useSearchParams()
  const [breaks, setBreaks] = useState<BreakRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNames, setShowNames] = useState(true)

  const token = searchParams.get("token")
  const employeeFilter = searchParams.get("employee")
  const dateFilter = searchParams.get("date")

  useEffect(() => {
    // Simulate fetching data based on token
    // In a real app, this would validate the token and fetch from API
    try {
      const storedBreaks = localStorage.getItem("breakRecords")
      if (storedBreaks) {
        let parsedBreaks: BreakRecord[] = JSON.parse(storedBreaks)

        // Apply filters
        if (employeeFilter) {
          parsedBreaks = parsedBreaks.filter((b) => b.employeeName === employeeFilter)
        }
        if (dateFilter) {
          parsedBreaks = parsedBreaks.filter((b) => b.date === dateFilter)
        }

        setBreaks(parsedBreaks)
      }
      setLoading(false)
    } catch (err) {
      setError("Failed to load break records")
      setLoading(false)
    }
  }, [token, employeeFilter, dateFilter])

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Employee",
      "Clock In",
      "Clock Out",
      "Break Start",
      "Break End",
      "Break Duration",
      "Shift Hours",
    ]
    const rows = breaks.map((record) => [
      record.date,
      showNames ? record.employeeName : "Employee",
      formatTime(record.clockIn),
      formatTime(record.clockOut),
      formatTime(record.breakStart),
      formatTime(record.breakEnd),
      `${record.breakDuration} min`,
      formatShiftHours(calculateShiftHours(record.clockIn, record.clockOut, record.breakDuration)),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `break-report-${dateFilter || "all"}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-muted-foreground">Loading break records...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Invalid or missing share token. Please check the URL and try again."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBreakTime = breaks.reduce((sum, record) => sum + record.breakDuration, 0)
  const avgBreakTime = breaks.length > 0 ? Math.round(totalBreakTime / breaks.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Break Report</CardTitle>
                <CardDescription>
                  {employeeFilter && `Employee: ${employeeFilter}`}
                  {employeeFilter && dateFilter && " • "}
                  {dateFilter && `Date: ${dateFilter}`}
                  {!employeeFilter && !dateFilter && "All Records"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowNames(!showNames)}>
                  {showNames ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showNames ? "Hide" : "Show"} Names
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV} disabled={breaks.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breaks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Break Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBreakTime} min</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Break</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgBreakTime} min</div>
            </CardContent>
          </Card>
        </div>

        {/* Break Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Break Records</CardTitle>
            <CardDescription>Detailed breakdown of all break periods</CardDescription>
          </CardHeader>
          <CardContent>
            {breaks.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No break records found</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Break Start</TableHead>
                      <TableHead>Break End</TableHead>
                      <TableHead>Break Duration</TableHead>
                      <TableHead>Shift Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breaks.map((record) => {
                      const shiftHours = calculateShiftHours(record.clockIn, record.clockOut, record.breakDuration)
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>{showNames ? record.employeeName : "Employee"}</TableCell>
                          <TableCell>{formatTime(record.clockIn)}</TableCell>
                          <TableCell>{formatTime(record.clockOut)}</TableCell>
                          <TableCell>{formatTime(record.breakStart)}</TableCell>
                          <TableCell>{formatTime(record.breakEnd)}</TableCell>
                          <TableCell>
                            <Badge variant={record.breakDuration > 30 ? "default" : "secondary"}>
                              {record.breakDuration} min
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{formatShiftHours(shiftHours)}</TableCell>
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
              This is a shared break report. Data is read-only.
              {token && ` Share Token: ${token.substring(0, 8)}...`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
