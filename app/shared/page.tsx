"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building2, Download, Eye, EyeOff, AlertTriangle, Home } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface BreakEntry {
  id: string
  employeeName: string
  department: string
  date: string
  startTime: string
  endTime: string
  duration: number
  breakType: string
  status: "completed" | "in-progress" | "missed"
}

export default function SharedBreakData() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const employeeFilter = searchParams.get("employee")
  const dateFilter = searchParams.get("date")

  const [breakData, setBreakData] = useState<BreakEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        if (!token) {
          setError("No sharing token provided. Please use a valid sharing link.")
          setLoading(false)
          return
        }

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in production, this would fetch from your backend/localStorage
        let mockData: BreakEntry[] = [
          {
            id: "1",
            employeeName: "John Smith",
            department: "Engineering",
            date: "2024-01-15",
            startTime: "10:00",
            endTime: "10:15",
            duration: 15,
            breakType: "Short Break",
            status: "completed",
          },
          {
            id: "2",
            employeeName: "Sarah Johnson",
            department: "Marketing",
            date: "2024-01-15",
            startTime: "12:00",
            endTime: "13:00",
            duration: 60,
            breakType: "Lunch Break",
            status: "completed",
          },
          {
            id: "3",
            employeeName: "Mike Davis",
            department: "Sales",
            date: "2024-01-15",
            startTime: "15:00",
            endTime: "15:15",
            duration: 15,
            breakType: "Short Break",
            status: "in-progress",
          },
          {
            id: "4",
            employeeName: "Emily Brown",
            department: "Engineering",
            date: "2024-01-16",
            startTime: "11:00",
            endTime: "11:15",
            duration: 15,
            breakType: "Short Break",
            status: "completed",
          },
        ]

        // Apply filters if provided
        if (employeeFilter) {
          mockData = mockData.filter((entry) => entry.employeeName.toLowerCase().includes(employeeFilter.toLowerCase()))
        }

        if (dateFilter) {
          mockData = mockData.filter((entry) => entry.date === dateFilter)
        }

        // Anonymize if not showing sensitive data
        if (!showSensitiveData) {
          mockData = mockData.map((entry, index) => ({
            ...entry,
            employeeName: `Employee #${String(index + 1).padStart(3, "0")}`,
          }))
        }

        setBreakData(mockData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load shared break data")
        setLoading(false)
      }
    }

    loadSharedData()
  }, [token, employeeFilter, dateFilter, showSensitiveData])

  const exportData = () => {
    const csvContent = [
      ["Employee", "Department", "Date", "Start Time", "End Time", "Duration (min)", "Break Type", "Status"],
      ...breakData.map((entry) => [
        entry.employeeName,
        entry.department,
        entry.date,
        entry.startTime,
        entry.endTime,
        entry.duration.toString(),
        entry.breakType,
        entry.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `break-data-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "missed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading shared break data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Unable to Load Data</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Shared Break Schedule</h1>
              <div className="flex flex-col gap-1 text-sm text-blue-600">
                <p>
                  Share Token:{" "}
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded">{token?.substring(0, 16)}...</span>
                </p>
                {employeeFilter && (
                  <p>
                    Filtered by Employee: <span className="font-semibold">{employeeFilter}</span>
                  </p>
                )}
                {dateFilter && (
                  <p>
                    Filtered by Date: <span className="font-semibold">{format(new Date(dateFilter), "PPP")}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {showSensitiveData ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Names
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Names
                  </>
                )}
              </Button>
              <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{breakData.length}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </CardContent>
            </Card>
            <Card className="border-green-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {breakData.filter((e) => e.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {breakData.filter((e) => e.status === "in-progress").length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card className="border-red-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {breakData.filter((e) => e.status === "missed").length}
                </div>
                <div className="text-sm text-gray-600">Missed</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Break Entries */}
        <div className="grid gap-4">
          {breakData.map((entry) => (
            <Card key={entry.id} className="border-blue-100 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{entry.employeeName}</h3>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Building2 className="h-4 w-4" />
                        {entry.department}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(entry.status)}>{entry.status.replace("-", " ").toUpperCase()}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700">{format(new Date(entry.date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700">
                      {entry.startTime} - {entry.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-medium">
                      {entry.breakType} ({entry.duration} min)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Data State */}
        {breakData.length === 0 && (
          <Card className="border-blue-100">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-blue-700 font-medium mb-2">No break data available</p>
              <p className="text-blue-600 text-sm">
                {employeeFilter || dateFilter
                  ? "Try adjusting your filters or use a different sharing link."
                  : "This sharing link doesn't contain any break schedule data."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a read-only view of shared break schedule data.</p>
          <p>For full access and editing capabilities, please use the main dashboard.</p>
        </div>
      </div>
    </div>
  )
}
