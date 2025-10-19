"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Copy, Mail, Check, Calendar, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BreakRecord } from "@/lib/types"

interface EmailSharingProps {
  breaks: BreakRecord[]
}

export function EmailSharing({ breaks }: EmailSharingProps) {
  const [copied, setCopied] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  // Get unique employees and dates
  const uniqueEmployees = Array.from(new Set(breaks.map((b) => b.employeeName)))
  const uniqueDates = Array.from(new Set(breaks.map((b) => b.date)))
    .sort()
    .reverse()

  const generateShareLink = () => {
    const token = Math.random().toString(36).substring(2, 15)
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

    let url = `${baseUrl}/shared?token=${token}`

    if (selectedEmployee !== "all") {
      url += `&employee=${encodeURIComponent(selectedEmployee)}`
    }

    if (selectedDate !== "all") {
      url += `&date=${selectedDate}`
    }

    return url
  }

  const shareLink = generateShareLink()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const sendEmail = () => {
    const subject = encodeURIComponent("Break Report")
    const body = encodeURIComponent(
      `View the break report here:\n\n${shareLink}\n\nThis link contains break records${
        selectedEmployee !== "all" ? ` for ${selectedEmployee}` : ""
      }${selectedDate !== "all" ? ` on ${selectedDate}` : ""}.`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <CardTitle>Share Break Report</CardTitle>
        </div>
        <CardDescription>Generate a secure link to share break records with others</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="employee-filter" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Filter by Employee
            </Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger id="employee-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {uniqueEmployees.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-filter" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Filter by Date
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="date-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Share Link */}
        <div className="space-y-2">
          <Label htmlFor="share-link">Share Link</Label>
          <div className="flex gap-2">
            <Input id="share-link" value={shareLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0 bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={sendEmail} className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Send via Email
          </Button>
          <Button variant="outline" onClick={copyToClipboard} className="flex-1 bg-transparent">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground">
          {selectedEmployee !== "all" || selectedDate !== "all" ? (
            <>
              This link will show {selectedEmployee !== "all" ? `records for ${selectedEmployee}` : "all employees"}
              {selectedEmployee !== "all" && selectedDate !== "all" && " "}
              {selectedDate !== "all" && `on ${selectedDate}`}.
            </>
          ) : (
            "This link will show all break records."
          )}
        </p>
      </CardContent>
    </Card>
  )
}
