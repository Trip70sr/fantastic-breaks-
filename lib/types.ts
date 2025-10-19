export interface Employee {
  id: string
  name: string
  department: string
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
}

export interface BreakRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string
  clockOut: string
  breakStart?: string
  breakEnd?: string
  breakDuration: number
}
