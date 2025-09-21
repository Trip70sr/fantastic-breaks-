import type { Employee, BreakEntry, CoverageStatus } from "./types"

export const employees: Employee[] = [
  { id: 1, name: "Sarah Johnson", position: "Team Lead", department: "Customer Service", isWorking: true },
  { id: 2, name: "Michael Chen", position: "Representative", department: "Customer Service", isWorking: true },
  { id: 3, name: "Emily Rodriguez", position: "Supervisor", department: "Sales", isWorking: true },
  { id: 4, name: "David Kim", position: "Associate", department: "Sales", isWorking: true },
  { id: 5, name: "Jessica Williams", position: "Specialist", department: "Technical Support", isWorking: true },
  { id: 6, name: "Robert Brown", position: "Manager", department: "Operations", isWorking: false },
  { id: 7, name: "Lisa Davis", position: "Coordinator", department: "HR", isWorking: true },
  { id: 8, name: "James Wilson", position: "Analyst", department: "Finance", isWorking: false },
]

export const breakEntries: BreakEntry[] = [
  {
    id: 1,
    employeeId: 1,
    date: new Date().toISOString().split("T")[0],
    break1Start: "10:00",
    break1End: "10:15",
    break1Coverage: 3,
    break2Start: "14:00",
    break2End: "14:15",
    break2Coverage: 5,
    notes: "Regular schedule",
  },
  {
    id: 2,
    employeeId: 2,
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    notes: "Missing coverage for both breaks",
  },
  {
    id: 3,
    employeeId: 3,
    date: new Date().toISOString().split("T")[0],
    break1Start: "09:00",
    break1End: "09:15",
    break1Coverage: 1,
    break2Start: "13:00",
    break2End: "13:15",
    break2Coverage: 7,
    notes: "Covered by team lead",
  },
  {
    id: 4,
    employeeId: 4,
    date: new Date().toISOString().split("T")[0],
    break1Start: "09:30",
    break1End: "09:45",
    break1Coverage: 5,
    break2Start: "13:30",
    break2End: "13:45",
    notes: "Break 2 needs coverage",
  },
  {
    id: 5,
    employeeId: 5,
    date: new Date().toISOString().split("T")[0],
    break1Start: "12:00",
    break1End: "12:15",
    notes: "Break 1 missing coverage",
  },
  {
    id: 6,
    employeeId: 7,
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:30",
    break1End: "11:45",
    break1Coverage: 1,
    break2Start: "15:30",
    break2End: "15:45",
    break2Coverage: 3,
    notes: "All breaks covered",
  },
]

// Export aliases for backward compatibility
export const initialEmployees = employees
export const initialBreakEntries = breakEntries

export function getCoverageStatus(entry: BreakEntry, breakNumber: 1 | 2): CoverageStatus {
  const hasBreak = breakNumber === 1 ? entry.break1Start && entry.break1End : entry.break2Start && entry.break2End

  if (!hasBreak) return "none"

  const hasCoverage = breakNumber === 1 ? entry.break1Coverage : entry.break2Coverage

  return hasCoverage ? "covered" : "missing"
}

export function hasMissingCoverage(entry: BreakEntry): boolean {
  const break1Status = getCoverageStatus(entry, 1)
  const break2Status = getCoverageStatus(entry, 2)

  return break1Status === "missing" || break2Status === "missing"
}

export function getEmployeeName(employeeId: number): string {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown"
}
