"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, AlertCircle, Clock, Users, Calendar } from "lucide-react"
import type { BreakRecord } from "@/lib/types"
import { getAllBreakRecords } from "@/lib/data"
import { formatShiftHours } from "@/lib/utils"

export default function SharedBreakReportPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const employeeFilter = searchParams.get("employee")
  const dateFilter = searchParams.get("date")

  const [breakRecords, setBreakRecords] = useState<BreakRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEmployeeNames, setShowEmployeeNames] = useState(true)

  useEffect(() => {
    // Simulate token validation and data loading
    const loadData = () => {
      try {
        if (!token) {
          setError("Invalid share link: No token provided")
          setLoading(false)
          return
        }

        // In a real app, validate the token with a backend
        // For now, just load the data from localStorage
        let records = getAllBreakRecords()

        // Apply filters if provided
        if (employeeFilter) {
          records = records.filter((r) => r.employeeName === employeeFilter)
        }

        if (dateFilter) {
          records = records.filter((r) => r.date === dateFilter)
        }

        setBreakRecords(records)
        setLoading(false)
      } catch (err) {
        setError("Failed to load break records")
        setLoading(false)
      }
    }

    loadData()
  }, [token, employeeFilter, dateFilter])

  const exportToCSV = () => {
    const headers = ["Date", "Employee", "Shift Start", "Shift End", "Break Start", "Break End", "Duration"]
    const rows = breakRecords.map((record) => [
      record.date,
      showEmployeeNames ? record.employeeName : "***",
      record.shiftStart,
      record.shiftEnd,
      record.breakStart || "N/A",
      record.breakEnd || "N/A",
      record.breakDuration || "0",
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `break-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 animate-spin text-blue-600" />
              <p className="text-lg">Loading break report...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error
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

  const totalBreaks = breakRecords.length
  const totalMinutes = breakRecords.reduce((sum, record) => sum + (record.breakDuration || 0), 0)
  const uniqueEmployees = new Set(breakRecords.map((r) => r.employeeName)).size

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Shared Break Report</CardTitle>
            <CardDescription>
              {employeeFilter && `Employee: ${employeeFilter} • `}
              {dateFilter && `Date: ${dateFilter} • `}
              Token: {token?.substring(0, 8)}...
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Breaks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBreaks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatShiftHours(totalMinutes)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueEmployees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="show-names" checked={showEmployeeNames} onCheckedChange={setShowEmployeeNames} />
                <Label htmlFor="show-names">Show employee names</Label>
              </div>

              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Break Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Break Records</CardTitle>
            <CardDescription>
              {breakRecords.length === 0
                ? "No break records found"
                : `Showing ${breakRecords.length} break record${breakRecords.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {breakRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No break records to display</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{showEmployeeNames ? record.employeeName : "***"}</TableCell>
                        <TableCell className="text-sm">
                          {record.shiftStart} - {record.shiftEnd}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.breakStart && record.breakEnd
                            ? `${record.breakStart} - ${record.breakEnd}`
                            : "Not recorded"}
                        </TableCell>
                        <TableCell>{record.breakDuration ? `${record.breakDuration} min` : "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={record.breakDuration && record.breakDuration >= 30 ? "default" : "destructive"}
                          >
                            {record.breakDuration && record.breakDuration >= 30 ? "Compliant" : "Non-compliant"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
