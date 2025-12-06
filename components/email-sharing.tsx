"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Share2, Copy, Mail, Check, Calendar } from "lucide-react"
import { toast } from "sonner"
import type { Employee } from "@/lib/types"

interface EmailSharingProps {
  employees: Employee[]
  onClose?: () => void
}

export function EmailSharing({ employees, onClose }: EmailSharingProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [includeFilters, setIncludeFilters] = useState(false)

  const generateShareUrl = () => {
    const token = Math.random().toString(36).substring(2, 15)
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

    let url = `${baseUrl}/shared?token=${token}`

    if (includeFilters) {
      if (selectedEmployee) {
        const employee = employees.find((e) => e.id === selectedEmployee)
        if (employee) {
          url += `&employee=${encodeURIComponent(employee.name)}`
        }
      }
      if (selectedDate) {
        url += `&date=${selectedDate}`
      }
    }

    setShareUrl(url)
    toast.success("Share link generated successfully!")
  }

  const copyToClipboard = async () => {
    if (!shareUrl) {
      toast.error("Please generate a share link first")
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const openEmailClient = () => {
    if (!shareUrl) {
      toast.error("Please generate a share link first")
      return
    }

    const subject = encodeURIComponent("Employee Break Schedule Report")
    const body = encodeURIComponent(`Hi,\n\nHere's the employee break schedule report:\n\n${shareUrl}\n\nBest regards`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Break Report
        </CardTitle>
        <CardDescription>Generate a secure link to share employee break schedules with team members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-filters" className="text-base">
              Include Filters
            </Label>
            <Switch id="include-filters" checked={includeFilters} onCheckedChange={setIncludeFilters} />
          </div>

          {includeFilters && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label htmlFor="employee-filter">
                  <Users className="h-4 w-4 inline mr-2" />
                  Filter by Employee (Optional)
                </Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee-filter">
                    <SelectValue placeholder="All employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-filter">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Filter by Date (Optional)
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Generate Link */}
        <div className="space-y-4">
          <Button onClick={generateShareUrl} className="w-full" size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Generate Share Link
          </Button>

          {shareUrl && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm" />
                <Button onClick={copyToClipboard} variant="outline" size="icon" className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button onClick={openEmailClient} variant="secondary" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Open in Email Client
              </Button>
            </div>
          )}
        </div>

        {onClose && (
          <>
            <Separator />
            <Button onClick={onClose} variant="ghost" className="w-full">
              Close
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default EmailSharing
