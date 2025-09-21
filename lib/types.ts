export interface Employee {
  id: string
  name: string
  department: string
  position?: string
  email?: string
  phone?: string
  hireDate?: string
  isActive?: boolean
  workingToday?: boolean
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  shiftStart: string
  shiftEnd: string
  break1Start?: string
  break1End?: string
  break2Start?: string
  break2End?: string
  coverageEmployeeId?: string
  coverage2EmployeeId?: string
  outsideTherapyStart?: string
  outsideTherapyEnd?: string
  outsideTherapyReason?: string
  notes?: string
}

export interface ShareableData {
  employees: Employee[]
  breakEntries: BreakEntry[]
  generatedAt: string
  expiresAt: string
}
