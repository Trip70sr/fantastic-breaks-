"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building2, Download, Share2 } from "lucide-react"
import { format } from "date-fns"

interface SharedData {
  employeeName: string
  department: string
  date: string
  breaks: Array<{
    id: string
    startTime: string
    endTime: string
    duration: number
    type: string
  }>
  totalBreakTime: number
  complianceStatus: "compliant" | "non-compliant" | "warning"
}

export default function SharedBreakData() {
  const params = useParams()
  const token = params.token as string
  const [data, setData] = useState<SharedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching shared data based on token
    const fetchSharedData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on token
        const mockData: SharedData = {
          employeeName: "John Doe",
          department: "Customer Service",
          date: "2024-01-15",
          breaks: [
            {
              id: "1",
              startTime: "10:15",
              endTime: "10:30",
              duration: 15,
              type: "Short Break",
            },
            {
              id: "2",
              startTime: "12:00",
              endTime: "13:00",
              duration: 60,
              type: "Lunch Break",
            },
            {
              id: "3",
              startTime: "15:15",
              endTime: "15:30",
              duration: 15,
              type: "Short Break",
            },
          ],
          totalBreakTime: 90,
          complianceStatus: "compliant",
        }

        setData(mockData)
      } catch (err) {
        setError("Failed to load shared break data")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchSharedData()
    }
  }, [token])

  const handleDownloadPDF = () => {
    // Simulate PDF download
    console.log("Downloading PDF for token:", token)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Break Report - ${data?.employeeName}`,
          text: `Break compliance report for ${data?.employeeName}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading break data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error || "Invalid or expired share link"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "non-compliant":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Break Report</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {data.employeeName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {data.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(data.date), "MMMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getComplianceColor(data.complianceStatus)}>
                  {data.complianceStatus.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Break Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Break Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{data.breaks.length}</div>
                  <div className="text-sm text-blue-600">Total Breaks</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{data.totalBreakTime}m</div>
                  <div className="text-sm text-green-600">Total Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(data.totalBreakTime / data.breaks.length)}m
                  </div>
                  <div className="text-sm text-purple-600">Average Break</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Break Details */}
          <Card>
            <CardHeader>
              <CardTitle>Break Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.breaks.map((breakItem, index) => (
                  <div key={breakItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{breakItem.type}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {breakItem.startTime} - {breakItem.endTime}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{breakItem.duration} minutes</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.complianceStatus === "compliant" && (
                  <p className="text-green-600">✓ All break requirements have been met for this date.</p>
                )}
                {data.complianceStatus === "warning" && (
                  <p className="text-yellow-600">⚠ Break schedule is close to compliance limits.</p>
                )}
                {data.complianceStatus === "non-compliant" && (
                  <p className="text-red-600">✗ Break requirements have not been met for this date.</p>
                )}
                <p className="text-sm text-gray-600 mt-4">
                  This report was generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")} and reflects the break
                  schedule as recorded in the Employee Break Protocol system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Generated by Employee Break Protocol System</p>
          <p className="mt-1">© {new Date().getFullYear()} Trip-tech.art</p>
        </div>
      </footer>
    </div>
  )
}
