export interface Employee {
  id: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  startDate: string
  status: "active" | "inactive"
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  shiftStart?: string
  shiftEnd?: string
  break1Start?: string
  break1End?: string
  break1Coverage?: string
  coverageEmployeeId?: string
  break2Start?: string
  break2End?: string
  break2Coverage?: string
  coverage2EmployeeId?: string
  outsideTherapyStart?: string
  outsideTherapyEnd?: string
  outsideTherapyReason?: string
  notes?: string
}

export interface ShareLink {
  id: string
  token: string
  employeeId: string
  createdAt: string
  expiresAt: string
  permissions: "view" | "edit" | "admin"
  recipientEmail: string
}
