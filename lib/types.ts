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

export interface CoverageAlert {
  id: string
  employeeId: string
  employeeName: string
  date: string
  breakTime: string
  type: "break1" | "break2"
  severity: "high" | "medium" | "low"
  message: string
}
