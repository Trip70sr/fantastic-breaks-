"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Copy, Check, Share2 } from "lucide-react"
import { toast } from "sonner"
import type { BreakRecord, Employee } from "@/lib/types"

interface EmailSharingProps {
  breakRecords: BreakRecord[]
  employees: Employee[]
}

export function EmailSharing({ breakRecords, employees }: EmailSharingProps) {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Break Schedule Report")
  const [message, setMessage] = useState("")
  const [filterEmployee, setFilterEmployee] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<string>("all")
  const [copied, setCopied] = useState(false)

  const generateShareToken = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const generateShareLink = () => {
    const token = generateShareToken()
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    let url = `${baseUrl}/shared?token=${token}`

    if (filterEmployee !== "all") {
      url += `&employee=${encodeURIComponent(filterEmployee)}`
    }
    if (filterDate !== "all") {
      url += `&date=${encodeURIComponent(filterDate)}`
    }

    return url
  }

  const handleCopyLink = async () => {
    const shareLink = generateShareLink()
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast.success("Share link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleSendEmail = () => {
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    const shareLink = generateShareLink()
    const filteredRecords = breakRecords.filter((record) => {
      if (filterEmployee !== "all" && record.employeeName !== filterEmployee) return false
      if (filterDate !== "all" && record.date !== filterDate) return false
      return true
    })

    const emailBody = `
${message}

View Break Schedule Report:
${shareLink}

Summary:
- Total Breaks: ${filteredRecords.length}
- Date Range: ${filterDate === "all" ? "All dates" : filterDate}
- Employee: ${filterEmployee === "all" ? "All employees" : filterEmployee}

This link provides read-only access to the break records.
    `.trim()

    // In a real application, this would send an actual email via an API
    // For now, we'll open the default email client
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink

    toast.success("Email client opened with pre-filled content")
  }

  const uniqueDates = [...new Set(breakRecords.map((r) => r.date))].sort().reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Break Report
        </CardTitle>
        <CardDescription>Generate a shareable link or send via email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="filter-employee">Filter by Employee</Label>
            <Select value={filterEmployee} onValueChange={setFilterEmployee}>
              <SelectTrigger id="filter-employee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.name}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-date">Filter by Date</Label>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger id="filter-date">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Share Link */}
        <div className="space-y-2">
          <Label>Share Link</Label>
          <div className="flex gap-2">
            <Input value={generateShareLink()} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopyLink} size="icon" variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Send via Email</h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleSendEmail} className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
