export interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  startDate: string
  status: "active" | "inactive"
  avatar?: string
}

export interface BreakEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  shiftStart: string
  shiftEnd: string
  break1Start?: string
  break1End?: string
  break1Coverage?: string
  break2Start?: string
  break2End?: string
  break2Coverage?: string
  notes?: string
  status: "scheduled" | "in-progress" | "completed" | "missed"
}

export interface ShareableData {
  token: string
  employeeName: string
  date: string
  breakEntry: BreakEntry
  createdAt: string
  expiresAt: string
}

export interface CoverageAlert {
  id: string
  employeeId: string
  employeeName: string
  date: string
  breakNumber: 1 | 2
  severity: "high" | "medium" | "low"
  message: string
  resolved: boolean
}

export interface BackupData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  timestamp: string
  version: string
}
