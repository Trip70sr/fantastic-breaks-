export type Department = "RBT" | "Operations" | "BCBA" | "Floater"

export interface Employee {
  id: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  hireDate: string
  isActive: boolean
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  break1Start: string
  break1End: string
  break1Coverage: string
  break2Start: string
  break2End: string
  break2Coverage: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CoverageEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  shift: "morning" | "afternoon" | "evening" | "night"
  startTime: string
  endTime: string
  position: string
  department: string
  status: "scheduled" | "completed" | "missed" | "partial"
  notes?: string
}

export interface CoverageAlert {
  id: string
  employeeId: string
  employeeName: string
  date: string
  breakNumber: 1 | 2
  breakTime: string
  severity: "high" | "medium" | "low"
  message: string
}

export interface DepartmentStats {
  department: string
  totalEmployees: number
  activeEmployees: number
  totalBreaks: number
  averageBreakDuration: number
  complianceRate: number
}

export interface BreakStats {
  totalBreaks: number
  totalDuration: number
  averageDuration: number
  breaksByType: {
    lunch: number
    break: number
    personal: number
  }
  complianceRate: number
  missedBreaks: number
}

export interface TimeRange {
  start: string
  end: string
}

export interface FilterOptions {
  dateRange: {
    start: Date
    end: Date
  }
  departments: string[]
  employees: string[]
  breakTypes: string[]
  approved?: boolean
}

export interface SharedBreakData {
  employeeName: string
  date: string
  break1Start: string
  break1End: string
  break1Coverage: string
  break2Start: string
  break2End: string
  break2Coverage: string
  notes: string
  expiresAt: string
  token: string
}

export interface BackupData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  exportDate: string
  version: string
}

export interface EmailTemplate {
  subject: string
  body: string
  recipientEmail: string
  shareUrl: string
}

export interface ShareableLink {
  id: string
  token: string
  employeeId: string
  employeeName: string
  expiresAt: string
  createdAt: string
  accessCount: number
  lastAccessed?: string
  permissions: {
    viewBreaks: boolean
    viewCoverage: boolean
    editBreaks: boolean
  }
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  breakReminders: boolean
  coverageAlerts: boolean
  complianceReports: boolean
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  timezone: string
  dateFormat: string
  timeFormat: "12h" | "24h"
  notifications: NotificationSettings
  defaultView: "dashboard" | "timesheet" | "coverage"
}

export type CoverageStatus = "covered" | "missing" | "none"
