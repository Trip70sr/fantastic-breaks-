import type { Employee, BreakEntry, CoverageStatus } from "./types"

export const employees: Employee[] = [
  { id: "1", name: "Sarah Johnson", department: "RBT", isActive: true, workingToday: true },
  { id: "2", name: "Michael Chen", department: "Operations", isActive: true, workingToday: true },
  { id: "3", name: "Emily Rodriguez", department: "BCBA", isActive: true, workingToday: true },
  { id: "4", name: "David Kim", department: "RBT", isActive: true, workingToday: false },
  { id: "5", name: "Jessica Williams", department: "Floater", isActive: true, workingToday: true },
  { id: "6", name: "Robert Brown", department: "Operations", isActive: false, workingToday: false },
  { id: "7", name: "Lisa Davis", department: "BCBA", isActive: true, workingToday: true },
  { id: "8", name: "James Wilson", department: "RBT", isActive: true, workingToday: false },
]

export const breakEntries: BreakEntry[] = [
  {
    id: "1",
    employeeId: "1",
    date: new Date().toISOString().split("T")[0],
    break1Start: "10:00",
    break1End: "10:15",
    break1Coverage: "3",
    break2Start: "14:00",
    break2End: "14:15",
    break2Coverage: "5",
    notes: "Regular schedule",
  },
  {
    id: "2",
    employeeId: "2",
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:00",
    break1End: "11:15",
    break1Coverage: "",
    break2Start: "15:00",
    break2End: "15:15",
    break2Coverage: "",
    notes: "Missing coverage for both breaks",
  },
  {
    id: "3",
    employeeId: "3",
    date: new Date().toISOString().split("T")[0],
    break1Start: "09:00",
    break1End: "09:15",
    break1Coverage: "1",
    break2Start: "13:00",
    break2End: "13:15",
    break2Coverage: "7",
    notes: "Covered by team lead",
  },
  {
    id: "4",
    employeeId: "4",
    date: new Date().toISOString().split("T")[0],
    break1Start: "09:30",
    break1End: "09:45",
    break1Coverage: "5",
    break2Start: "13:30",
    break2End: "13:45",
    break2Coverage: "",
    notes: "Break 2 needs coverage",
  },
  {
    id: "5",
    employeeId: "5",
    date: new Date().toISOString().split("T")[0],
    break1Start: "12:00",
    break1End: "12:15",
    break1Coverage: "",
    break2Start: "",
    break2End: "",
    break2Coverage: "",
    notes: "Break 1 missing coverage",
  },
  {
    id: "6",
    employeeId: "7",
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:30",
    break1End: "11:45",
    break1Coverage: "1",
    break2Start: "15:30",
    break2End: "15:45",
    break2Coverage: "3",
    notes: "All breaks covered",
  },
]

export function getEmployeeName(employeeId: string): string {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown Employee"
}

export function hasMissingCoverage(entry: BreakEntry): boolean {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const missingBreak1Coverage = hasBreak1 && !entry.break1Coverage
  const missingBreak2Coverage = hasBreak2 && !entry.break2Coverage

  return missingBreak1Coverage || missingBreak2Coverage
}

export function getCoverageStatus(entry: BreakEntry): {
  break1Status: CoverageStatus
  break2Status: CoverageStatus
} {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const break1Status: CoverageStatus = !hasBreak1 ? "none" : entry.break1Coverage ? "covered" : "missing"

  const break2Status: CoverageStatus = !hasBreak2 ? "none" : entry.break2Coverage ? "covered" : "missing"

  return { break1Status, break2Status }
}
