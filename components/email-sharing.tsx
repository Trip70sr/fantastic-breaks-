"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Employee, BreakEntry } from "@/lib/types"
import { Mail, Share2, Copy, CheckCircle, AlertCircle, Calendar, Users } from "lucide-react"
import { format } from "date-fns"

interface EmailSharingProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  breakEntries: BreakEntry[]
}

export default function EmailSharing({ isOpen, onClose, employees, breakEntries }: EmailSharingProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [recipientEmail, setRecipientEmail] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle")

  const todayEntries = breakEntries.filter((entry) => new Date(entry.date).toISOString().split("T")[0] === selectedDate)

  const generateShareableUrl = () => {
    const data = {
      employees,
      breakEntries: todayEntries,
      date: selectedDate,
    }

    const encodedData = btoa(JSON.stringify(data))
    const baseUrl = window.location.origin
    const url = `${baseUrl}/shared/${encodedData}`

    setShareUrl(url)
    return url
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateEmailContent = () => {
    const workingEmployees = todayEntries.map((entry) => {
      const employee = employees.find((emp) => emp.id === entry.employeeId)
      return employee ? `${employee.name} (${employee.department})` : "Unknown Employee"
    })

    const breaksSummary = todayEntries
      .map((entry) => {
        const employee = employees.find((emp) => emp.id === entry.employeeId)
        const hasBreak1 = entry.break1Start && entry.break1End
        const hasBreak2 = entry.break2Start && entry.break2End

        return `${employee?.name || "Unknown"}: ${hasBreak1 ? "✓" : "✗"} Break 1${hasBreak2 ? ", ✓ Break 2" : ""}`
      })
      .join("\n")

    return `Subject: Employee Break Schedule - ${format(new Date(selectedDate), "PPP")}

Dear Team,

Please find the employee break schedule for ${format(new Date(selectedDate), "PPP")}:

Working Employees (${workingEmployees.length}):
${workingEmployees.join("\n")}

Break Status:
${breaksSummary}

${customMessage ? `\nAdditional Notes:\n${customMessage}` : ""}

Best regards,
Break Management System`
  }

  const handleEmailShare = () => {
    const emailContent = generateEmailContent()
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(`Employee Break Schedule - ${format(new Date(selectedDate), "PPP")}`)}&body=${encodeURIComponent(emailContent)}`
    window.open(mailtoUrl)
  }

  const getBreakStats = () => {
    const totalEmployees = todayEntries.length
    const employeesWithBreaks = todayEntries.filter((entry) => entry.break1Start && entry.break1End).length
    const employeesWithCoverage = todayEntries.filter((entry) => entry.coverageEmployeeId).length
    const missingCoverage = todayEntries.filter(
      (entry) =>
        (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
        (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId),
    ).length

    return {
      totalEmployees,
      employeesWithBreaks,
      employeesWithCoverage,
      missingCoverage,
      coverageRate: totalEmployees > 0 ? (employeesWithCoverage / totalEmployees) * 100 : 0,
    }
  }

  const stats = getBreakStats()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Break Schedule
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Recipient Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="manager@company.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add any additional notes or instructions..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Email Preview:</h4>
                  <pre className="text-xs whitespace-pre-wrap font-mono">{generateEmailContent()}</pre>
                </div>

                <Button onClick={handleEmailShare} disabled={!recipientEmail} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Shareable Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Generate a secure link that contains the break schedule data. This link can be shared with managers
                    or supervisors.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="share-date">Date</Label>
                  <Input
                    id="share-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <Button onClick={generateShareableUrl} className="w-full">
                  Generate Share Link
                </Button>

                {shareUrl && (
                  <div className="space-y-2">
                    <Label>Generated Link:</Label>
                    <div className="flex gap-2">
                      <Input value={shareUrl} readOnly className="font-mono text-xs" />
                      <Button variant="outline" onClick={() => copyToClipboard(shareUrl)} className="shrink-0">
                        {copyStatus === "copied" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    {copyStatus === "copied" && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Daily Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{format(new Date(selectedDate), "PPP")}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
                        <div className="text-sm text-muted-foreground">Working</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.employeesWithBreaks}</div>
                        <div className="text-sm text-muted-foreground">With Breaks</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Coverage Rate:</span>
                        <Badge variant={stats.coverageRate > 80 ? "default" : "secondary"}>
                          {stats.coverageRate.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Missing Coverage:</span>
                        <Badge variant={stats.missingCoverage > 0 ? "destructive" : "default"}>
                          {stats.missingCoverage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Working Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todayEntries.map((entry) => {
                      const employee = employees.find((emp) => emp.id === entry.employeeId)
                      const hasBreak = entry.break1Start && entry.break1End

                      return (
                        <div key={entry.id} className="flex justify-between items-center text-sm">
                          <span>{employee?.name || "Unknown"}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {employee?.department}
                            </Badge>
                            <Badge variant={hasBreak ? "default" : "secondary"} className="text-xs">
                              {hasBreak ? "Break ✓" : "No Break"}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}

                    {todayEntries.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No employees scheduled for this date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
