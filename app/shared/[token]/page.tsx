"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Download, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"

interface SharedBreakData {
  id: string
  employeeName: string
  department: string
  date: string
  breaks: {
    id: string
    startTime: string
    endTime: string
    duration: number
    type: string
  }[]
  totalBreakTime: number
  complianceStatus: "compliant" | "non-compliant" | "warning"
}

export default function SharedBreakPage() {
  const params = useParams()
  const token = params.token as string
  const [breakData, setBreakData] = useState<SharedBreakData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    // Simulate fetching shared break data
    const fetchSharedData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on token
      const mockData: SharedBreakData = {
        id: token,
        employeeName: showSensitiveData ? "John Smith" : "Employee #" + token.slice(-4),
        department: "Production",
        date: "2024-01-15",
        breaks: [
          {
            id: "1",
            startTime: "10:00",
            endTime: "10:15",
            duration: 15,
            type: "Short Break",
          },
          {
            id: "2",
            startTime: "12:00",
            endTime: "12:30",
            duration: 30,
            type: "Lunch Break",
          },
          {
            id: "3",
            startTime: "15:00",
            endTime: "15:15",
            duration: 15,
            type: "Short Break",
          },
        ],
        totalBreakTime: 60,
        complianceStatus: "compliant",
      }

      setBreakData(mockData)
      setIsLoading(false)
    }

    if (token) {
      fetchSharedData()
    }
  }, [token, showSensitiveData])

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "non-compliant":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportToPDF = () => {
    // Simulate PDF export
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(
          `Break Report\n\nEmployee: ${breakData?.employeeName}\nDepartment: ${breakData?.department}\nDate: ${breakData?.date}\n\nBreaks:\n${breakData?.breaks.map((b) => `${b.startTime} - ${b.endTime} (${b.duration}min) - ${b.type}`).join("\n")}\n\nTotal Break Time: ${breakData?.totalBreakTime} minutes`,
        ),
    )
    element.setAttribute("download", `break-report-${breakData?.date}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared break data...</p>
        </div>
      </div>
    )
  }

  if (!breakData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>The shared break data could not be found or the link has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please check the link or contact your administrator for a new sharing link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Shared Break Report</h1>
          <p className="text-muted-foreground">This is a shared view of employee break data</p>
        </div>

        {/* Privacy Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Sensitive Information</p>
                <p className="text-sm text-muted-foreground">
                  Toggle to show/hide employee names and other sensitive data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="flex items-center gap-2"
              >
                {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSensitiveData ? "Hide" : "Show"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee</p>
                <p className="text-lg font-semibold">{breakData.employeeName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-lg font-semibold">{breakData.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{format(new Date(breakData.date), "PPP")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getComplianceColor(breakData.complianceStatus)}>
                {breakData.complianceStatus.charAt(0).toUpperCase() + breakData.complianceStatus.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Break Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Break Details
            </CardTitle>
            <CardDescription>Total break time: {breakData.totalBreakTime} minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakData.breaks.map((breakItem) => (
                <div key={breakItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{breakItem.type}</p>
                      <p className="text-muted-foreground">
                        {breakItem.startTime} - {breakItem.endTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{breakItem.duration} min</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportToPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export as PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>This shared link was generated on {format(new Date(), "PPP")} and may expire after 30 days.</p>
          <p className="mt-1">Employee Break Protocol System © 2024</p>
        </div>
      </div>
    </div>
  )
}
