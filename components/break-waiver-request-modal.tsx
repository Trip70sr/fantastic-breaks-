"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertTriangle } from "lucide-react"

interface BreakWaiverRequestModalProps {
  employeeId: string
  employeeName: string
  date: string
  onSubmit: (email: string, reason: string) => void
  onClose: () => void
}

export default function BreakWaiverRequestModal({
  employeeId,
  employeeName,
  date,
  onSubmit,
  onClose,
}: BreakWaiverRequestModalProps) {
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    if (!email || !reason) {
      alert("Please provide your email and reason for waiving breaks")
      return
    }

    onSubmit(email, reason)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Request Break Waiver
          </CardTitle>
          <CardDescription>
            Submit a request to waive all breaks for {new Date(date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Under Colorado law, employees are entitled to rest breaks. Waiving breaks must be voluntary and approved
              by a director before the shift starts.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="employee-name">Employee Name</Label>
            <Input id="employee-name" value={employeeName} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waiver-email">Your Email Address *</Label>
            <Input
              id="waiver-email"
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">A confirmation email will be sent to this address</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waiver-reason">Reason for Waiving Breaks *</Label>
            <Textarea
              id="waiver-reason"
              placeholder="Please explain why you are requesting to waive your breaks today..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <Alert>
            <AlertDescription>
              This waiver request must be submitted BEFORE your shift starts and approved by a director. You will need
              to submit a new request for each day you wish to waive breaks.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Waiver Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
