export interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  hireDate: string
  isActive: boolean
  workingToday: boolean
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
}

export interface ShareableData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  generatedAt: string
  expiresAt: string
}
