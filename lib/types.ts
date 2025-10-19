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
