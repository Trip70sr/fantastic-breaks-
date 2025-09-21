"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Calendar, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { SharedBreakData } from "@/lib/types"
import { formatTime, formatDate } from "@/lib/utils"

export default function SharedBreakPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const employeeName = searchParams.get("employee")
  const date = searchParams.get("date")

  const [breakData, setBreakData] = useState<SharedBreakData | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    // In a real app, this would fetch from an API
    // For demo purposes, we'll check localStorage
    const loadSharedData = () => {
      try {
        const storedData = localStorage.getItem(`shared_${token}`)
        if (storedData) {
          const data: SharedBreakData = JSON.parse(storedData)
          const expired = new Date(data.expiresAt) < new Date()
          setIsExpired(expired)
          setBreakData(data)
        } else {
          // Fallback to URL parameters for demo
          if (employeeName && date) {
            const mockData: SharedBreakData = {
              employeeName: decodeURIComponent(employeeName),
              date: date,
              break1Start: "10:00",
              break1End: "10:15",
              break1Coverage: "Emily Rodriguez",
              break2Start: "14:00",
              break2End: "14:15",
              break2Coverage: "Michael Chen",
              notes: "Regular break schedule",
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              token: token,
            }
            setBreakData(mockData)
            setIsExpired(false)
          }
        }
      } catch (error) {
        console.error("Error loading shared data:", error)
      }
      setLoading(false)
    }

    loadSharedData()
  }, [token, employeeName, date])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading break schedule...</p>
        </div>
      </div>
    )
  }

  if (isExpired || !breakData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Link Expired</CardTitle>
            <CardDescription>This shared break schedule link has expired or is no longer valid.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please request a new link from your supervisor or HR department.
            </p>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Main App
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <Badge variant="outline">Shared Schedule</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {breakData.employeeName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(breakData.date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Break 1</h3>
                {breakData.break1Start && breakData.break1End ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatTime(breakData.break1Start)} - {formatTime(breakData.break1End)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Coverage: </span>
                      <span className="font-medium">{breakData.break1Coverage || "Not assigned"}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No break scheduled</p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Break 2</h3>
                {breakData.break2Start && breakData.break2End ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatTime(breakData.break2Start)} - {formatTime(breakData.break2End)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Coverage: </span>
                      <span className="font-medium">{breakData.break2Coverage || "Not assigned"}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No break scheduled</p>
                )}
              </div>
            </div>

            {breakData.notes && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-gray-700">{breakData.notes}</p>
              </div>
            )}

            <div className="border-t pt-4 text-center">
              <p className="text-xs text-gray-500">This link expires on {formatDate(breakData.expiresAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
