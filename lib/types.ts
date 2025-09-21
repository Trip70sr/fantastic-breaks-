export interface Employee {
  id: string
  name: string
  department: string
  shiftStart: string
  shiftEnd: string
  isActive: boolean
  email?: string
  phone?: string
  position?: string
  hireDate?: string
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

export interface BreakSchedule {
  id: string
  employeeId: string
  employeeName: string
  date: string
  shiftStart: string
  shiftEnd: string
  break1Start: string
  break1End: string
  break1Coverage: string
  break2Start: string
  break2End: string
  break2Coverage: string
  notes: string
  status: "scheduled" | "in-progress" | "completed"
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

export interface CoverageAlert {
  id: string
  employeeId: string
  employeeName: string
  date: string
  breakNumber: 1 | 2
  breakTime: string
  severity: "high" | "medium" | "low"
  message: string
  isResolved: boolean
  createdAt: string
}

export interface BackupData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  timestamp: string
  version: string
}

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  todayBreaks: number
  coveragePercentage: number
  uncoveredBreaks: number
  upcomingBreaks: number
}

export interface TimeSlot {
  time: string
  available: boolean
  employeeName?: string
  breakType?: "break1" | "break2"
}

export interface WeeklySchedule {
  [date: string]: {
    [employeeId: string]: BreakEntry
  }
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  coverageAlerts: boolean
  scheduleReminders: boolean
  weeklyReports: boolean
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  timeFormat: "12h" | "24h"
  dateFormat: "US" | "EU" | "ISO"
  notifications: NotificationSettings
  defaultView: "dashboard" | "schedule" | "employees"
}
