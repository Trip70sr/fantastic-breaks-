export type Department = "RBT" | "Operations" | "BCBA" | "Floater"

export interface Employee {
  id: string
  name: string
  department: Department
  email: string
  phone: string
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  shiftStart: string
  shiftEnd: string
  break1Start: string
  break1End: string
  break2Start: string
  break2End: string
  coverageEmployeeId: string
  coverage2EmployeeId: string
  outsideTherapyStart: string
  outsideTherapyEnd: string
  outsideTherapyReason: string
}

export interface ManagementFilters {
  showAllDepartments: boolean
  showMissingBreaks: boolean
  showCoverageIssues: boolean
  showOvertimeAlerts: boolean
}

export interface NotificationSettings {
  directorEmail: string
  breakDurationThreshold: number
  enableBreakDurationAlerts: boolean
  enableRealTimeAlerts: boolean
  alertCooldownMinutes: number
}

export interface BreakAlert {
  id: string
  employeeId: string
  employeeName: string
  breakType: "break1" | "break2"
  breakStart: string
  breakEnd: string
  duration: number
  threshold: number
  date: string
  timestamp: Date
  emailSent: boolean
  acknowledged: boolean
}
