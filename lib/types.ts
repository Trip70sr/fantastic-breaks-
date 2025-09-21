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
  breakTime: string
  severity: "high" | "medium" | "low"
  message: string
}

export interface BackupData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  exportDate: string
  version: string
}
