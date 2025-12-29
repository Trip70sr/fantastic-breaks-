"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, Mail, AlertTriangle } from "lucide-react"
import { getWaiversForDate, approveWaiver, denyWaiver } from "@/lib/break-waiver-storage"
import { getAdminSession, isDirector } from "@/lib/admin-auth"
import type { BreakWaiver } from "@/lib/types"
import { toast } from "sonner"

interface DirectorWaiverApprovalProps {
  date: string
  onWaiverStatusChange?: () => void
}

export default function DirectorWaiverApproval({ date, onWaiverStatusChange }: DirectorWaiverApprovalProps) {
  const [waivers, setWaivers] = useState<BreakWaiver[]>([])
  const [hasDirectorAccess, setHasDirectorAccess] = useState(false)

  useEffect(() => {
    setHasDirectorAccess(isDirector())
    loadWaivers()
  }, [date])

  const loadWaivers = () => {
    const dateWaivers = getWaiversForDate(date)
    setWaivers(dateWaivers)
  }

  const handleApprove = (waiverId: string) => {
    const session = getAdminSession()
    if (!session) {
      toast.error("You must be logged in to approve waivers")
      return
    }

    if (approveWaiver(waiverId, session.username)) {
      toast.success("Break waiver approved")
      loadWaivers()
      onWaiverStatusChange?.()
    } else {
      toast.error("Failed to approve waiver")
    }
  }

  const handleDeny = (waiverId: string) => {
    const session = getAdminSession()
    if (!session) {
      toast.error("You must be logged in to deny waivers")
      return
    }

    if (denyWaiver(waiverId, session.username)) {
      toast.success("Break waiver denied")
      loadWaivers()
      onWaiverStatusChange?.()
    } else {
      toast.error("Failed to deny waiver")
    }
  }

  if (!hasDirectorAccess) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Only directors can approve or deny break waivers.</AlertDescription>
      </Alert>
    )
  }

  const pendingWaivers = waivers.filter((w) => w.status === "pending")
  const processedWaivers = waivers.filter((w) => w.status !== "pending")

  return (
    <div className="space-y-4">
      {pendingWaivers.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Clock className="h-5 w-5" />
              Pending Break Waiver Requests
              <Badge variant="secondary" className="ml-auto">
                {pendingWaivers.length}
              </Badge>
            </CardTitle>
            <CardDescription>These requests require director approval before the shift starts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingWaivers.map((waiver) => (
              <div key={waiver.id} className="bg-white border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">{waiver.employeeName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {waiver.employeeEmail}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Requested: {new Date(waiver.requestedAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300">
                    Pending
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded p-3">
                  <div className="text-sm font-medium mb-1">Reason:</div>
                  <div className="text-sm text-muted-foreground">{waiver.reason}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(waiver.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Waiver
                  </Button>
                  <Button size="sm" onClick={() => handleDeny(waiver.id)} variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-1" />
                    Deny Waiver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {processedWaivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Waivers</CardTitle>
            <CardDescription>
              Previously approved or denied waiver requests for {new Date(date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {processedWaivers.map((waiver) => (
              <div
                key={waiver.id}
                className={`border rounded-lg p-3 ${
                  waiver.status === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{waiver.employeeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {waiver.status === "approved" ? "Approved" : "Denied"} by {waiver.approvedBy} at{" "}
                      {waiver.approvedAt && new Date(waiver.approvedAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge
                    variant={waiver.status === "approved" ? "default" : "destructive"}
                    className={waiver.status === "approved" ? "bg-green-600" : ""}
                  >
                    {waiver.status === "approved" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Denied
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {waivers.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No break waiver requests for this date</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
