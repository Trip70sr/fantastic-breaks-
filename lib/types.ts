export interface Employee {
  id: string
  name: string
  department: string
  active: boolean
}

export interface BreakEntry {
  id: string
  date: string
  employeeId: string
  shiftStart: string
  shiftEnd: string
  break1Start?: string
  break1End?: string
  coverageEmployeeId?: string
  break2Start?: string
  break2End?: string
  coverage2EmployeeId?: string
}

export interface AdminCredentials {
  username: string
  passwordHash: string
  role: "super_admin" | "admin"
  createdAt: string
  lastLogin?: string
}

export interface BreakViolation {
  id: string
  employeeId: string
  date: string
  violationType: "excessive_duration" | "unauthorized_break" | "insufficient_rest"
  description: string
  breakDuration: number // in minutes
  expectedDuration: number // in minutes
  shiftHours: number
  revenueImpact: number // in dollars
}

export interface ComplianceSettings {
  hourlyRate: number // average hourly rate for revenue calculation
  violationThresholds: {
    excessiveBreakMinutes: number // minutes over allowed break
    dailyViolationCount: number // violations per day to trigger alert
    monthlyViolationCount: number // violations per month to trigger alert
  }
  notificationEmails: string[]
  notificationsEnabled: boolean
}
