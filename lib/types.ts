export type Department = "RBT" | "Operations" | "BCBA" | "Floater"

export interface Employee {
  id: string
  name: string
  department: Department
  position: string
  email: string
  phone: string
  hireDate: string
  status: "active" | "inactive"
  avatar?: string
  isActive?: boolean
  workingToday?: boolean
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  breakType: "lunch" | "break" | "personal"
  startTime: string
  endTime: string
  duration: number // in minutes
  notes: string
  location?: string
  approved: boolean
  approvedBy?: string
  approvedAt?: string
  break1Start: string
  break1End: string
  break1Coverage: string
  break2Start: string
  break2End: string
  break2Coverage: string
  coverageEmployeeId?: string
  coverage2EmployeeId?: string
  shiftStart?: string
  shiftEnd?: string
  outsideTherapyStart?: string
  outsideTherapyEnd?: string
  outsideTherapyReason?: string
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
