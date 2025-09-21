export interface Employee {
  id: number
  name: string
  department: string
  shift: string
  isWorking: boolean
}

export interface BreakEntry {
  id: number
  employeeId: number
  date: string
  break1Start?: string
  break1End?: string
  break1Coverage?: number
  break2Start?: string
  break2End?: string
  break2Coverage?: number
  notes?: string
}

export type CoverageStatus = "covered" | "missing" | "none"
