"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, Share2, Copy, ExternalLink, Calendar, User, Clock } from "lucide-react"
import type { Employee, BreakEntry, SharedBreakData } from "@/lib/types"
import { generateShareToken, isValidEmail, formatTime, formatDate } from "@/lib/utils"
import { toast } from "sonner"

interface EmailSharingProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
}

export function EmailSharing({ employees, breakEntries }: EmailSharingProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const getBreakEntryForEmployeeAndDate = (employeeId: string, date: string) => {
    return breakEntries.find((entry) => entry.employeeId === employeeId && entry.date === date)
  }

  const generateShareableLink = () => {
    if (!selectedEmployee || !selectedDate) {
      toast.error("Please select an employee and date")
      return
    }

    const employee = employees.find((emp) => emp.id === selectedEmployee)
    const breakEntry = getBreakEntryForEmployeeAndDate(selectedEmployee, selectedDate)

    if (!employee) {
      toast.error("Selected employee not found")
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const token = generateShareToken()
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      const shareableUrl = `${baseUrl}/shared?token=${token}&employee=${encodeURIComponent(employee.name)}&date=${selectedDate}`

      // In a real application, you would save this shared data to a database
      const sharedData: SharedBreakData = {
        employeeName: employee.name,
        date: selectedDate,
        break1Start: breakEntry?.break1Start || "",
        break1End: breakEntry?.break1End || "",
        break1Coverage: breakEntry?.break1Coverage || "",
        break2Start: breakEntry?.break2Start || "",
        break2End: breakEntry?.break2End || "",
        break2Coverage: breakEntry?.break2Coverage || "",
        notes: breakEntry?.notes || "",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        token,
      }

      // Store in localStorage for demo purposes
      localStorage.setItem(`shared_${token}`, JSON.stringify(sharedData))

      setShareUrl(shareableUrl)

      // Generate default email content
      setEmailSubject(`Break Schedule for ${employee.name} - ${formatDate(selectedDate)}`)
      setEmailBody(generateEmailTemplate(employee, breakEntry, shareableUrl, selectedDate))

      setIsGenerating(false)
      toast.success("Shareable link generated successfully")
    }, 1000)
  }

  const generateEmailTemplate = (employee: Employee, breakEntry: BreakEntry | undefined, url: string, date: string) => {
    return `Hi there,

I'm sharing the break schedule for ${employee.name} on ${formatDate(date)}.

Employee: ${employee.name}
Department: ${employee.department}
Date: ${formatDate(date)}

Break Schedule:
${
  breakEntry?.break1Start && breakEntry?.break1End
    ? `• Break 1: ${formatTime(breakEntry.break1Start)} - ${formatTime(breakEntry.break1End)}${breakEntry.break1Coverage ? ` (Coverage: ${breakEntry.break1Coverage})` : " (No coverage assigned)"}`
    : "• Break 1: Not scheduled"
}
${
  breakEntry?.break2Start && breakEntry?.break2End
    ? `• Break 2: ${formatTime(breakEntry.break2Start)} - ${formatTime(breakEntry.break2End)}${breakEntry.break2Coverage ? ` (Coverage: ${breakEntry.break2Coverage})` : " (No coverage assigned)"}`
    : "• Break 2: Not scheduled"
}

${breakEntry?.notes ? `Notes: ${breakEntry.notes}` : ""}

You can view the full schedule details here: ${url}

This link will expire in 7 days for security purposes.

Best regards,
Employee Break Management System`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard")
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard")
      })
  }

  const openEmailClient = () => {
    if (!recipientEmail || !isValidEmail(recipientEmail)) {
      toast.error("Please enter a valid recipient email")
      return
    }

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.open(mailtoUrl, "_blank")
    toast.success("Email client opened")
  }

  const selectedEmployeeData = employees.find((emp) => emp.id === selectedEmployee)
  const selectedBreakEntry = selectedEmployee ? getBreakEntryForEmployeeAndDate(selectedEmployee, selectedDate) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Email Sharing
          </CardTitle>
          <CardDescription>Generate shareable links for break schedules and send them via email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employee">Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter((emp) => emp.isActive)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {employee.name} - {employee.department}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
          </div>

          {/* Preview Section */}
          {selectedEmployeeData && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Schedule Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedEmployeeData.name}</span>
                  <Badge variant="outline">{selectedEmployeeData.department}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(selectedDate)}</span>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Break 1</div>
                    {selectedBreakEntry?.break1Start && selectedBreakEntry?.break1End ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(selectedBreakEntry.break1Start)} - {formatTime(selectedBreakEntry.break1End)}
                        </div>
                        <div className="text-muted-foreground">
                          Coverage: {selectedBreakEntry.break1Coverage || "Not assigned"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not scheduled</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Break 2</div>
                    {selectedBreakEntry?.break2Start && selectedBreakEntry?.break2End ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(selectedBreakEntry.break2Start)} - {formatTime(selectedBreakEntry.break2End)}
                        </div>
                        <div className="text-muted-foreground">
                          Coverage: {selectedBreakEntry.break2Coverage || "Not assigned"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not scheduled</div>
                    )}
                  </div>
                </div>

                {selectedBreakEntry?.notes && (
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm text-muted-foreground">{selectedBreakEntry.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Generate Link Section */}
          <div className="space-y-4">
            <Button
              onClick={generateShareableLink}
              disabled={!selectedEmployee || !selectedDate || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Link...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Shareable Link
                </>
              )}
            </Button>

            {shareUrl && (
              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Shareable link generated:</div>
                    <div className="flex items-center gap-2">
                      <Input value={shareUrl} readOnly className="font-mono text-sm" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(shareUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      This link will expire in 7 days and can be shared with anyone who needs access to this schedule.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Email Section */}
          {shareUrl && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Send via Email</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="Enter recipient's email address"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    placeholder="Email message"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={openEmailClient} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
