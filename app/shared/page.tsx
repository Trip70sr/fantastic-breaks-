"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTime, formatDate } from "@/lib/utils"
import { Clock, User, Calendar, AlertCircle } from "lucide-react"
import { Suspense } from "react"

function SharedBreakContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const employee = searchParams.get("employee")
  const date = searchParams.get("date")
  const shiftStart = searchParams.get("shiftStart")
  const shiftEnd = searchParams.get("shiftEnd")
  const break1Start = searchParams.get("break1Start")
  const break1End = searchParams.get("break1End")
  const break1Coverage = searchParams.get("break1Coverage")
  const break2Start = searchParams.get("break2Start")
  const break2End = searchParams.get("break2End")
  const break2Coverage = searchParams.get("break2Coverage")

  if (!token || !employee || !date) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Invalid or expired share link</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Shared Break Schedule</h1>
          <p className="text-muted-foreground">View-only break information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {employee}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Shift: {formatTime(shiftStart || "")} - {formatTime(shiftEnd || "")}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {break1Start && break1End && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Break 1</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(break1Start)} - {formatTime(break1End)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Coverage: </span>
                      {break1Coverage ? (
                        <Badge variant="secondary">{break1Coverage}</Badge>
                      ) : (
                        <Badge variant="destructive">No Coverage</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {break2Start && break2End && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Break 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(break2Start)} - {formatTime(break2End)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Coverage: </span>
                      {break2Coverage ? (
                        <Badge variant="secondary">{break2Coverage}</Badge>
                      ) : (
                        <Badge variant="destructive">No Coverage</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>This is a read-only view of break information</p>
          <p>Share token: {token}</p>
        </div>
      </div>
    </div>
  )
}

export default function SharedBreakPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SharedBreakContent />
    </Suspense>
  )
}
