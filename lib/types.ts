export interface Employee {
  id: string
  name: string
  department: string
  active: boolean
  hourlyRate: number // Add hourlyRate for revenue loss calculations
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
  role: "admin" | "director" // Changed super_admin to admin
  createdAt: string
  lastLogin?: string
}

export interface BreakViolation {
  id: string
  employeeId: string
  employeeName: string
  date: string // ISO date
  violationType: "overage" | "shortage" | "missed" | "late" | "insufficient_rest"
  description: string
  breakDuration: number // minutes taken
  expectedDuration: number // minutes allowed
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

export interface RevenueTrend {
  period: string
  lostMinutes: number
  lostHours: number
  lostRevenue: number
}

export type Department = string

export interface BreakAssignment {
  date: string // YYYY-MM-DD
  employeeIds: string[]
  assignedBy: string // admin/manager user
  assignedAt: string // ISO timestamp
}

export interface ShiftScheduleEntry {
  id: string
  employeeId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  therapyMinutes: number // excluded from work hours
  netWorkMinutes: number // total minutes - therapy minutes
  selfReported: boolean // true if employee entered their own schedule
  reportedAt: string // ISO timestamp
}

export interface ShiftVerification {
  id: string
  employeeId: string
  date: string // YYYY-MM-DD
  verifiedBy: string // coverage employee id
  status: "verified" | "corrected"
  originalStart?: string // HH:mm
  originalEnd?: string // HH:mm
  correctedStart?: string // HH:mm
  correctedEnd?: string // HH:mm
  timestamp: string // ISO timestamp
  reason?: string // why correction was needed
}

export interface BreakWaiver {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  date: string // YYYY-MM-DD
  requestedAt: string // ISO timestamp
  requestEmailSent: boolean
  approvedBy?: string // director username
  approvedAt?: string // ISO timestamp
  status: "pending" | "approved" | "denied"
  reason?: string // employee's reason for waiving
}

export interface EmployeeCredentials {
  employeeId: string
  username: string
  passwordHash: string
  role: "employee" | "manager"
  createdAt: string
  lastLogin?: string
}

export interface UserSession {
  userId: string
  username: string
  role: "employee" | "manager" | "hr_admin" | "admin" | "director" // Changed super_admin to admin
  employeeId?: string // for employee users
  loginTime: number
}
