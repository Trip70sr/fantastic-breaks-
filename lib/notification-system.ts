"use client"

import type { BreakViolation, Employee } from "./types"
import { loadComplianceSettings } from "./compliance-storage"

export interface NotificationLog {
  id: string
  timestamp: string
  type: "daily_threshold" | "monthly_threshold" | "immediate_alert"
  violationCount: number
  affectedEmployees: string[]
  message: string
  sent: boolean
}

const NOTIFICATION_LOGS_KEY = "notification_logs"

export function loadNotificationLogs(): NotificationLog[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(NOTIFICATION_LOGS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveNotificationLogs(logs: NotificationLog[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(NOTIFICATION_LOGS_KEY, JSON.stringify(logs))
}

export function addNotificationLog(log: NotificationLog): void {
  const logs = loadNotificationLogs()
  logs.push(log)
  saveNotificationLogs(logs)
}

export function checkDailyThreshold(violations: BreakViolation[], date: string): NotificationLog | null {
  const settings = loadComplianceSettings()

  if (!settings.notificationsEnabled) return null

  const dailyViolations = violations.filter((v) => v.date === date)

  if (dailyViolations.length >= settings.violationThresholds.dailyViolationCount) {
    const affectedEmployees = [...new Set(dailyViolations.map((v) => v.employeeId))]

    return {
      id: `daily-${date}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "daily_threshold",
      violationCount: dailyViolations.length,
      affectedEmployees,
      message: `Daily violation threshold exceeded: ${dailyViolations.length} violations on ${date} (threshold: ${settings.violationThresholds.dailyViolationCount})`,
      sent: false,
    }
  }

  return null
}

export function checkMonthlyThreshold(
  violations: BreakViolation[],
  month: number,
  year: number,
): NotificationLog | null {
  const settings = loadComplianceSettings()

  if (!settings.notificationsEnabled) return null

  const monthlyViolations = violations.filter((v) => {
    const vDate = new Date(v.date)
    return vDate.getMonth() === month && vDate.getFullYear() === year
  })

  if (monthlyViolations.length >= settings.violationThresholds.monthlyViolationCount) {
    const affectedEmployees = [...new Set(monthlyViolations.map((v) => v.employeeId))]

    return {
      id: `monthly-${month}-${year}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "monthly_threshold",
      violationCount: monthlyViolations.length,
      affectedEmployees,
      message: `Monthly violation threshold exceeded: ${monthlyViolations.length} violations in month ${month + 1}/${year} (threshold: ${settings.violationThresholds.monthlyViolationCount})`,
      sent: false,
    }
  }

  return null
}

export function checkExcessiveBreakAlert(violation: BreakViolation): NotificationLog | null {
  const settings = loadComplianceSettings()

  if (!settings.notificationsEnabled) return null

  if (violation.violationType === "excessive_duration") {
    const excessMinutes = violation.breakDuration - violation.expectedDuration

    if (excessMinutes >= settings.violationThresholds.excessiveBreakMinutes) {
      return {
        id: `immediate-${violation.id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "immediate_alert",
        violationCount: 1,
        affectedEmployees: [violation.employeeId],
        message: `Immediate alert: Excessive break detected - ${excessMinutes} minutes over limit (threshold: ${settings.violationThresholds.excessiveBreakMinutes} minutes)`,
        sent: false,
      }
    }
  }

  return null
}

export function generateEmailContent(log: NotificationLog, employees: Employee[]): string {
  const employeeNames = log.affectedEmployees
    .map((id) => {
      const emp = employees.find((e) => e.id === id)
      return emp ? emp.name : "Unknown"
    })
    .join(", ")

  let subject = ""
  let body = ""

  switch (log.type) {
    case "daily_threshold":
      subject = "ALERT: Daily Break Violation Threshold Exceeded"
      body = `
Dear Management,

This is an automated alert from the Employee Break Protocol system.

DAILY THRESHOLD ALERT
Date: ${new Date(log.timestamp).toLocaleDateString()}

The daily violation threshold has been exceeded:
- Total Violations: ${log.violationCount}
- Affected Employees: ${log.affectedEmployees.length}
- Employee Names: ${employeeNames}

${log.message}

Please review the admin dashboard for detailed information and take appropriate action.

Best regards,
Employee Break Protocol System
      `
      break

    case "monthly_threshold":
      subject = "ALERT: Monthly Break Violation Threshold Exceeded"
      body = `
Dear Management,

This is an automated alert from the Employee Break Protocol system.

MONTHLY THRESHOLD ALERT
Date: ${new Date(log.timestamp).toLocaleDateString()}

The monthly violation threshold has been exceeded:
- Total Violations: ${log.violationCount}
- Affected Employees: ${log.affectedEmployees.length}
- Employee Names: ${employeeNames}

${log.message}

Please review the monthly report in the admin dashboard for detailed analysis.

Best regards,
Employee Break Protocol System
      `
      break

    case "immediate_alert":
      subject = "URGENT: Excessive Break Violation Detected"
      body = `
Dear Management,

This is an urgent automated alert from the Employee Break Protocol system.

IMMEDIATE VIOLATION ALERT
Time: ${new Date(log.timestamp).toLocaleString()}

${log.message}

Affected Employee: ${employeeNames}

Please address this issue immediately to minimize revenue impact.

Best regards,
Employee Break Protocol System
      `
      break
  }

  return `Subject: ${subject}\n\n${body}`
}

export function simulateSendEmail(emailContent: string, recipients: string[]): boolean {
  console.log("[v0] Simulating email send...")
  console.log("[v0] Recipients:", recipients)
  console.log("[v0] Email Content:", emailContent)

  // In a real implementation, this would call an email API
  // For now, we'll simulate success
  return true
}

export function processNotification(log: NotificationLog, employees: Employee[]): boolean {
  const settings = loadComplianceSettings()

  if (settings.notificationEmails.length === 0) {
    console.log("[v0] No notification emails configured")
    return false
  }

  const emailContent = generateEmailContent(log, employees)
  const success = simulateSendEmail(emailContent, settings.notificationEmails)

  if (success) {
    log.sent = true
    addNotificationLog(log)
  }

  return success
}
