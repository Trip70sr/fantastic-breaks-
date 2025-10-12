"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building2, Download, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"

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
  const params = useParams()
  const token = params.token as string
  const [breakData, setBreakData] = useState<BreakEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: BreakEntry[] = [
          {
            id: "1",
            employeeName: showSensitiveData ? "John Smith" : "Employee #001",
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
            employeeName: showSensitiveData ? "Sarah Johnson" : "Employee #002",
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
            employeeName: showSensitiveData ? "Mike Davis" : "Employee #003",
            department: "Sales",
            date: "2024-01-15",
            startTime: "15:00",
            endTime: "15:15",
            duration: 15,
            breakType: "Short Break",
            status: "in-progress",
          },
        ]

        setBreakData(mockData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load shared break data")
        setLoading(false)
      }
    }

    loadSharedData()
  }, [showSensitiveData])

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
        return "bg-aquamarine-100 text-aquamarine-800 border-aquamarine-200"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-aquamarine-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading shared break data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-aquamarine-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-aquamarine-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Shared Break Data</h1>
              <p className="text-blue-700">Viewing shared break schedule data (Token: {token.substring(0, 8)}...)</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {showSensitiveData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSensitiveData ? "Hide Names" : "Show Names"}
              </Button>
              <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {breakData.map((entry) => (
            <Card key={entry.id} className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
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
                  <Badge className={getStatusColor(entry.status)}>{entry.status.replace("-", " ")}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700">{format(new Date(entry.date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700">
                      {entry.startTime} - {entry.endTime}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-700">
                      {entry.breakType} ({entry.duration} min)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {breakData.length === 0 && (
          <Card className="border-blue-100">
            <CardContent className="p-8 text-center">
              <p className="text-blue-600">No break data available for this shared link.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
