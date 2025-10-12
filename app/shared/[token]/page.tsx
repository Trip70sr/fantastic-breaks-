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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading shared break data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Break Data</h1>
              <p className="text-gray-600">Viewing shared break schedule data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSensitiveData(!showSensitiveData)}>
                {showSensitiveData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSensitiveData ? "Hide Names" : "Show Names"}
              </Button>
              <Button onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {breakData.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{entry.employeeName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        {entry.department}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(entry.status)}>{entry.status.replace("-", " ")}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(entry.date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {entry.startTime} - {entry.endTime}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span>
                      {entry.breakType} ({entry.duration} min)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
