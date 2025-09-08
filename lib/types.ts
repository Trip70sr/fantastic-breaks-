export interface Employee {
  id: string
  name: string
  department: string
}

export interface BreakEntry {
  id: string
  employeeId: string
  date: string
  breakStart: string
  breakEnd: string
  lunchStart?: string
  lunchEnd?: string
  status: "scheduled" | "in-progress" | "completed" | "missed"
}

export interface BreakStats {
  totalEmployees: number
  onBreak: number
  completedBreaks: number
  missedBreaks: number
}

export interface ShareableData {
  date: string
  entries: BreakEntry[]
  employees: Employee[]
  generatedAt: string
}
