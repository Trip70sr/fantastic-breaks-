"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Employee, BreakEntry } from "@/lib/types"
import { Mail, Send, Copy, CheckCircle, AlertTriangle, Users, Calendar, LinkIcon } from "lucide-react"
import { format } from "date-fns"

interface EmailSharingProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  breakEntries: BreakEntry[]
}

export default function EmailSharing({ isOpen, onClose, employees, breakEntries }: EmailSharingProps) {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: `Break Schedule Report - ${format(new Date(), "PPP")}`,
    message: "",
  })
  const [shareStatus, setShareStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [shareLink, setShareLink] = useState("")

  const generateShareLink = () => {
    // Generate a unique token (in production, this would be more secure)
    const token = btoa(`${Date.now()}-${Math.random()}`).substring(0, 32)

    // Get current date for filtering
    const today = format(new Date(), "yyyy-MM-dd")

    // Create share URL with search parameters
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const url = `${baseUrl}/shared?token=${token}&date=${today}`

    setShareLink(url)
    return url
  }

  const generateReport = () => {
    setIsGeneratingReport(true)

    const today = new Date()
    const todayEntries = breakEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.toDateString() === today.toDateString()
    })

    const totalEmployees = employees.length
    const workingToday = todayEntries.length
    const entriesWithBreaks = todayEntries.filter((entry) => entry.break1Start && entry.break1End).length
    const missingCoverage = todayEntries.filter(
      (entry) =>
        (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
        (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId),
    ).length

    // Generate share link
    const link = generateShareLink()

    let report = `EMPLOYEE BREAK SCHEDULE REPORT\n`
    report += `Generated: ${format(new Date(), "PPP 'at' p")}\n`
    report += `View Online: ${link}\n\n`

    report += `SUMMARY:\n`
    report += `• Total Employees: ${totalEmployees}\n`
    report += `• Working Today: ${workingToday}\n`
    report += `• Employees with Breaks: ${entriesWithBreaks}\n`
    report += `• Missing Coverage: ${missingCoverage}\n\n`

    if (todayEntries.length > 0) {
      report += `TODAY'S SCHEDULE:\n`
      report += `${"=".repeat(50)}\n\n`

      todayEntries.forEach((entry) => {
        const employee = employees.find((emp) => emp.id === entry.employeeId)
        const coverageEmp1 = entry.coverageEmployeeId
          ? employees.find((emp) => emp.id === entry.coverageEmployeeId)
          : null
        const coverageEmp2 = entry.coverage2EmployeeId
          ? employees.find((emp) => emp.id === entry.coverage2EmployeeId)
          : null

        report += `${employee?.name || "Unknown"} (${employee?.department || "N/A"})\n`
        report += `  Shift: ${entry.shiftStart} - ${entry.shiftEnd}\n`

        if (entry.break1Start && entry.break1End) {
          report += `  Break 1: ${entry.break1Start} - ${entry.break1End}`
          if (coverageEmp1) {
            report += ` (Coverage: ${coverageEmp1.name})`
          } else {
            report += ` ⚠️ NO COVERAGE`
          }
          report += `\n`
        }

        if (entry.break2Start && entry.break2End) {
          report += `  Break 2: ${entry.break2Start} - ${entry.break2End}`
          if (coverageEmp2) {
            report += ` (Coverage: ${coverageEmp2.name})`
          } else {
            report += ` ⚠️ NO COVERAGE`
          }
          report += `\n`
        }

        if (entry.outsideTherapyStart && entry.outsideTherapyEnd) {
          report += `  Outside Therapy: ${entry.outsideTherapyStart} - ${entry.outsideTherapyEnd}`
          if (entry.outsideTherapyReason) {
            report += ` (${entry.outsideTherapyReason})`
          }
          report += `\n`
        }

        report += `\n`
      })

      if (missingCoverage > 0) {
        report += `COVERAGE ALERTS:\n`
        report += `${"=".repeat(50)}\n`
        report += `⚠️ ${missingCoverage} break(s) are missing coverage assignments.\n`
        report += `Please review and assign coverage to ensure proper staffing.\n\n`
      }
    } else {
      report += `No employees are scheduled to work today.\n\n`
    }

    report += `DEPARTMENTS:\n`
    const departments = [...new Set(employees.map((emp) => emp.department))]
    departments.forEach((dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept)
      const workingInDept = todayEntries.filter((entry) => {
        const emp = employees.find((e) => e.id === entry.employeeId)
        return emp?.department === dept
      }).length
      report += `• ${dept}: ${deptEmployees.length} total, ${workingInDept} working today\n`
    })

    report += `\n---\n`
    report += `This report was generated automatically by the Employee Break Management System.\n`
    report += `For questions or updates, please contact your supervisor.\n\n`
    report += `View Full Report Online: ${link}`

    setEmailData({
      ...emailData,
      message: report,
    })

    setIsGeneratingReport(false)
  }

  const handleCopyReport = () => {
    navigator.clipboard.writeText(emailData.message).then(() => {
      setShareStatus({
        type: "success",
        message: "Report copied to clipboard! You can now paste it into your email client.",
      })
    })
  }

  const handleCopyLink = () => {
    if (!shareLink) {
      generateShareLink()
    }
    navigator.clipboard.writeText(shareLink).then(() => {
      setShareStatus({
        type: "success",
        message: "Share link copied to clipboard!",
      })
    })
  }

  const handleSendEmail = () => {
    if (!emailData.to.trim()) {
      setShareStatus({
        type: "error",
        message: "Please enter an email address.",
      })
      return
    }

    const subject = encodeURIComponent(emailData.subject)
    const body = encodeURIComponent(emailData.message)
    const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`

    window.location.href = mailtoLink

    setShareStatus({
      type: "success",
      message: "Opening your default email client...",
    })
  }

  const getQuickStats = () => {
    const today = new Date()
    const todayEntries = breakEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.toDateString() === today.toDateString()
    })

    return {
      totalEmployees: employees.length,
      workingToday: todayEntries.length,
      withBreaks: todayEntries.filter((entry) => entry.break1Start && entry.break1End).length,
      missingCoverage: todayEntries.filter(
        (entry) =>
          (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
          (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId),
      ).length,
    }
  }

  if (!isOpen) return null

  const stats = getQuickStats()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Share Break Schedule Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
                  <div className="text-sm text-gray-600">Total Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.workingToday}</div>
                  <div className="text-sm text-gray-600">Working Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.withBreaks}</div>
                  <div className="text-sm text-gray-600">With Breaks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.missingCoverage}</div>
                  <div className="text-sm text-gray-600">Missing Coverage</div>
                </div>
              </div>
              {stats.missingCoverage > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Coverage Alert:</strong> {stats.missingCoverage} break(s) are missing coverage assignments.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Share Link */}
          {shareLink && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Shareable Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="font-mono text-sm" />
                  <Button onClick={handleCopyLink} variant="outline" className="bg-transparent">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Anyone with this link can view today's break schedule (read-only)
                </p>
              </CardContent>
            </Card>
          )}

          {/* Email Form */}
          <Card>
            <CardHeader>
              <CardTitle>Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-to">To (Email Address)</Label>
                  <Input
                    id="email-to"
                    type="email"
                    placeholder="supervisor@company.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-message">Message</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Users className="h-4 w-4" />
                    {isGeneratingReport ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
                <Textarea
                  id="email-message"
                  placeholder="Click 'Generate Report' to create a detailed break schedule report..."
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              {shareStatus.type && (
                <Alert variant={shareStatus.type === "error" ? "destructive" : "default"}>
                  {shareStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>{shareStatus.message}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSendEmail} className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={handleCopyReport} className="flex items-center gap-2 bg-transparent">
                  <Copy className="h-4 w-4" />
                  Copy Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Option 1 - Share Link:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Click "Generate Report" to create a shareable link</li>
                  <li>Copy the link and share it via any method (email, chat, etc.)</li>
                  <li>Recipients can view the schedule in their browser</li>
                </ol>
              </div>
              <div>
                <strong>Option 2 - Email Client:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Enter the recipient's email address</li>
                  <li>Click "Generate Report" to create a detailed schedule</li>
                  <li>Click "Send Email" to open your default email client</li>
                </ol>
              </div>
              <div>
                <strong>Option 3 - Copy & Paste:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Click "Generate Report" to create the schedule</li>
                  <li>Click "Copy Report" to copy the text</li>
                  <li>Paste into any app or document</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
