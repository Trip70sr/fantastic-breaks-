"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Mail, Copy, Share2, Calendar, User } from "lucide-react"
import { getAllEmployees, getAllBreakRecords } from "@/lib/data"

export default function EmailSharing() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [shareLink, setShareLink] = useState<string>("")

  const employees = getAllEmployees()
  const breakRecords = getAllBreakRecords()

  // Get unique dates from break records
  const uniqueDates = Array.from(new Set(breakRecords.map((r) => r.date)))
    .sort()
    .reverse()

  const generateShareLink = () => {
    // Generate a simple token (in production, this should be a secure JWT or UUID)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Build share URL with query parameters
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const params = new URLSearchParams()
    params.append("token", token)

    if (selectedEmployee !== "all") {
      params.append("employee", selectedEmployee)
    }

    if (selectedDate !== "all") {
      params.append("date", selectedDate)
    }

    const link = `${baseUrl}/shared?${params.toString()}`
    setShareLink(link)

    toast.success("Share link generated!", {
      description: "You can now copy or email this link",
    })
  }

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      toast.success("Link copied to clipboard!")
    }
  }

  const openEmailClient = () => {
    if (shareLink) {
      const subject = encodeURIComponent("Employee Break Report")
      const body = encodeURIComponent(
        `Here is the break report you requested:\n\n${shareLink}\n\nThis link provides access to employee break records${selectedEmployee !== "all" ? ` for ${selectedEmployee}` : ""}${selectedDate !== "all" ? ` on ${selectedDate}` : ""}.`,
      )

      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5" />
          Share Break Report
        </CardTitle>
        <CardDescription>Generate a secure link to share break records via email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Employee Filter */}
        <div className="space-y-2">
          <Label htmlFor="employee-filter" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Filter by Employee (Optional)
          </Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="employee-filter">
              <SelectValue placeholder="All employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.name}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-filter" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date (Optional)
          </Label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger id="date-filter">
              <SelectValue placeholder="All dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              {uniqueDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button onClick={generateShareLink} className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Generate Share Link
        </Button>

        {/* Share Link Display */}
        {shareLink && (
          <div className="space-y-3 pt-4 border-t">
            <Label htmlFor="share-link">Share Link</Label>
            <div className="flex gap-2">
              <Input id="share-link" value={shareLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={openEmailClient} variant="secondary" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send via Email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
