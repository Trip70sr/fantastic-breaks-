"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, Plus, X, Save, Check } from "lucide-react"
import { loadComplianceSettings, saveComplianceSettings } from "@/lib/compliance-storage"
import { toast } from "sonner"
import type { ComplianceSettings } from "@/lib/types"

export default function NotificationSettings() {
  const [settings, setSettings] = useState<ComplianceSettings | null>(null)
  const [newEmail, setNewEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(loadComplianceSettings())
  }, [])

  const handleToggleNotifications = (enabled: boolean) => {
    if (settings) {
      const updated = { ...settings, notificationsEnabled: enabled }
      setSettings(updated)
    }
  }

  const handleAddEmail = () => {
    if (!settings) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (settings.notificationEmails.includes(newEmail)) {
      toast.error("This email is already in the list")
      return
    }

    const updated = {
      ...settings,
      notificationEmails: [...settings.notificationEmails, newEmail],
    }
    setSettings(updated)
    setNewEmail("")
    toast.success("Email added successfully")
  }

  const handleRemoveEmail = (email: string) => {
    if (!settings) return

    const updated = {
      ...settings,
      notificationEmails: settings.notificationEmails.filter((e) => e !== email),
    }
    setSettings(updated)
    toast.success("Email removed successfully")
  }

  const handleUpdateThreshold = (key: keyof ComplianceSettings["violationThresholds"], value: number) => {
    if (!settings) return

    const updated = {
      ...settings,
      violationThresholds: {
        ...settings.violationThresholds,
        [key]: value,
      },
    }
    setSettings(updated)
  }

  const handleUpdateHourlyRate = (value: number) => {
    if (!settings) return

    const updated = {
      ...settings,
      hourlyRate: value,
    }
    setSettings(updated)
  }

  const handleSaveSettings = () => {
    if (!settings) return

    saveComplianceSettings(settings)
    setSaved(true)
    toast.success("Settings saved successfully")

    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-blue-900">Notification Settings</h3>
        <p className="text-sm text-blue-600">Configure email alerts for break compliance violations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enable Notifications
          </CardTitle>
          <CardDescription>Turn on automated email alerts for violation thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-notifications" className="text-base">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                {settings.notificationsEnabled
                  ? "Notifications are currently enabled"
                  : "Notifications are currently disabled"}
              </p>
            </div>
            <Switch
              id="enable-notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification Recipients
          </CardTitle>
          <CardDescription>Add email addresses to receive violation alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Email Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddEmail()
                  }
                }}
              />
            </div>
            <Button onClick={handleAddEmail} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Email List */}
          <div className="space-y-2">
            {settings.notificationEmails.length > 0 ? (
              settings.notificationEmails.map((email) => (
                <div key={email} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                  <span className="text-sm">{email}</span>
                  <Button onClick={() => handleRemoveEmail(email)} size="icon" variant="ghost" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <Alert>
                <AlertDescription className="text-sm">
                  No email recipients configured. Add email addresses above to receive notifications.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Violation Thresholds</CardTitle>
          <CardDescription>Configure when notifications should be triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excessive-minutes">Excessive Break Alert (minutes over allowed)</Label>
            <Input
              id="excessive-minutes"
              type="number"
              min="1"
              value={settings.violationThresholds.excessiveBreakMinutes}
              onChange={(e) => handleUpdateThreshold("excessiveBreakMinutes", Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Trigger immediate alert when a break exceeds allowed duration by this many minutes
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="daily-threshold">Daily Violation Threshold</Label>
            <Input
              id="daily-threshold"
              type="number"
              min="1"
              value={settings.violationThresholds.dailyViolationCount}
              onChange={(e) => handleUpdateThreshold("dailyViolationCount", Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Send alert when daily violations reach this count across all employees
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="monthly-threshold">Monthly Violation Threshold</Label>
            <Input
              id="monthly-threshold"
              type="number"
              min="1"
              value={settings.violationThresholds.monthlyViolationCount}
              onChange={(e) => handleUpdateThreshold("monthlyViolationCount", Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Send alert when monthly violations reach this count across all employees
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Calculation</CardTitle>
          <CardDescription>Set the hourly rate for revenue loss calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="hourly-rate">Average Hourly Rate ($)</Label>
          <Input
            id="hourly-rate"
            type="number"
            min="0"
            step="0.01"
            value={settings.hourlyRate}
            onChange={(e) => handleUpdateHourlyRate(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Used to calculate lost revenue from excessive breaks and unauthorized time off
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg" className="gap-2">
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Notifications</span>
            <Badge variant={settings.notificationsEnabled ? "default" : "secondary"}>
              {settings.notificationsEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Recipients</span>
            <Badge variant="outline">{settings.notificationEmails.length} email(s)</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Excessive Break Alert</span>
            <Badge variant="outline">{settings.violationThresholds.excessiveBreakMinutes} min</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Daily Threshold</span>
            <Badge variant="outline">{settings.violationThresholds.dailyViolationCount} violations</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Threshold</span>
            <Badge variant="outline">{settings.violationThresholds.monthlyViolationCount} violations</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Hourly Rate</span>
            <Badge variant="outline">${settings.hourlyRate}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
