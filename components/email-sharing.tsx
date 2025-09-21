"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Copy, Link, Clock, Users } from "lucide-react"
import { toast } from "sonner"

interface ShareableLink {
  id: string
  token: string
  employeeName: string
  expiresAt: string
  createdAt: string
  accessCount: number
}

export default function EmailSharing() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Break Schedule Update")
  const [message, setMessage] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [shareableLinks, setShareableLinks] = useState<ShareableLink[]>([])

  const generateShareableLink = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee")
      return
    }

    const token = Math.random().toString(36).substr(2, 16)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const newLink: ShareableLink = {
      id: Date.now().toString(),
      token,
      employeeName: selectedEmployee,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      accessCount: 0,
    }

    setShareableLinks((prev) => [...prev, newLink])

    const shareUrl = `${window.location.origin}/shared/${token}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Shareable link generated and copied to clipboard")
  }

  const copyLink = (token: string) => {
    const shareUrl = `${window.location.origin}/shared/${token}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard")
  }

  const sendEmail = () => {
    if (!email || !subject) {
      toast.error("Please fill in email and subject")
      return
    }

    // In a real app, this would send an actual email
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.open(mailtoLink)
    toast.success("Email client opened")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Sharing
        </CardTitle>
        <CardDescription>Share break schedules via email or generate shareable links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Send Email</h4>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="employee@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Break Schedule Update"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your break schedule has been updated..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={sendEmail} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Generate Shareable Link</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="employee-select">Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                    <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                    <SelectItem value="David Kim">David Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateShareableLink} className="w-full">
                <Link className="h-4 w-4 mr-2" />
                Generate Link (7 days)
              </Button>
            </div>
          </div>

          {shareableLinks.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Active Links</h4>
              <div className="space-y-3">
                {shareableLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{link.employeeName}</span>
                        <Badge variant={isExpired(link.expiresAt) ? "destructive" : "default"}>
                          {isExpired(link.expiresAt) ? "Expired" : "Active"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expires: {formatDate(link.expiresAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Views: {link.accessCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLink(link.token)}
                      disabled={isExpired(link.expiresAt)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
