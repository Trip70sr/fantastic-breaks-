import type { Employee, BreakEntry } from "./types"

export const initialEmployees: Employee[] = [
  { id: "1", name: "Sarah Johnson", department: "RBT" },
  { id: "2", name: "Michael Chen", department: "RBT" },
  { id: "3", name: "Emily Rodriguez", department: "Operations" },
  { id: "4", name: "David Kim", department: "BCBA" },
  { id: "5", name: "Jessica Williams", department: "RBT" },
  { id: "6", name: "Alex Thompson", department: "Floater" },
  { id: "7", name: "Maria Garcia", department: "RBT" },
  { id: "8", name: "James Wilson", department: "Operations" },
]

export const initialBreakEntries: BreakEntry[] = [
  {
    id: "1",
    employeeId: "1",
    date: new Date().toISOString(),
    shiftStart: "08:00",
    shiftEnd: "16:00",
    break1Start: "10:00",
    break1End: "10:15",
    break2Start: "14:00",
    break2End: "14:15",
    coverageEmployeeId: "2",
    coverage2EmployeeId: "3",
  },
  {
    id: "2",
    employeeId: "2",
    date: new Date().toISOString(),
    shiftStart: "09:00",
    shiftEnd: "17:00",
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    // Missing coverage - should trigger alerts
    coverageEmployeeId: "",
    coverage2EmployeeId: "",
  },
  {
    id: "3",
    employeeId: "4",
    date: new Date().toISOString(),
    shiftStart: "07:30",
    shiftEnd: "15:30",
    break1Start: "09:30",
    break1End: "09:45",
    break2Start: "13:30",
    break2End: "13:45",
    coverageEmployeeId: "5",
    // Missing coverage for break 2 - should trigger alert
    coverage2EmployeeId: "",
    outsideTherapyStart: "12:00",
    outsideTherapyEnd: "12:30",
    outsideTherapyReason: "Client meeting",
  },
  {
    id: "4",
    employeeId: "5",
    date: new Date().toISOString(),
    shiftStart: "10:00",
    shiftEnd: "14:00",
    break1Start: "12:00",
    break1End: "12:15",
    // No coverage assigned - should trigger alert
    coverageEmployeeId: "",
  },
]

// Load functions for localStorage integration
export function loadEmployees(): Employee[] {
  if (typeof window === "undefined") return initialEmployees

  try {
    const saved = localStorage.getItem("employees")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error loading employees:", error)
  }

  return initialEmployees
}

export function loadBreakEntries(): BreakEntry[] {
  if (typeof window === "undefined") return initialBreakEntries

  try {
    const saved = localStorage.getItem("breakEntries")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error loading break entries:", error)
  }

  return initialBreakEntries
}

export function saveEmployees(employees: Employee[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("employees", JSON.stringify(employees))
    localStorage.setItem("lastDataUpdate", new Date().toISOString())
  } catch (error) {
    console.error("Error saving employees:", error)
  }
}

export function saveBreakEntries(entries: BreakEntry[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("breakEntries", JSON.stringify(entries))
    localStorage.setItem("lastDataUpdate", new Date().toISOString())
  } catch (error) {
    console.error("Error saving break entries:", error)
  }
}

// Utility functions
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function getEmployeeName(employeeId: string, employees: Employee[]): string {
  const employee = employees.find((e) => e.id === employeeId)
  return employee ? employee.name : "Unknown Employee"
}

export function validateBreakEntry(entry: Partial<BreakEntry>): string[] {
  const errors: string[] = []

  if (!entry.employeeId) errors.push("Employee is required")
  if (!entry.shiftStart) errors.push("Shift start time is required")
  if (!entry.shiftEnd) errors.push("Shift end time is required")
  if (!entry.date) errors.push("Date is required")

  return errors
}

export function getBreakStats(entries: BreakEntry[], employees: Employee[]) {
  const totalEntries = entries.length
  const entriesWithBreaks = entries.filter((e) => e.break1Start && e.break1End).length
  const entriesWithCoverage = entries.filter((e) => e.coverageEmployeeId).length
  const entriesWithSecondBreak = entries.filter((e) => e.break2Start && e.break2End).length

  return {
    totalEntries,
    entriesWithBreaks,
    entriesWithCoverage,
    entriesWithSecondBreak,
    breakCoverageRate: totalEntries > 0 ? (entriesWithCoverage / totalEntries) * 100 : 0,
  }
}

export function filterEntriesByDate(entries: BreakEntry[], date: Date): BreakEntry[] {
  const targetDate = date.toISOString().split("T")[0]
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0]
    return entryDate === targetDate
  })
}

export function filterEntriesByEmployee(entries: BreakEntry[], employeeId: string): BreakEntry[] {
  return entries.filter((entry) => entry.employeeId === employeeId)
}

export function getDepartments(employees: Employee[]): string[] {
  return [...new Set(employees.map((emp) => emp.department))]
}

export function getWorkingEmployeesForDate(entries: BreakEntry[], employees: Employee[], date: Date): Employee[] {
  const dateEntries = filterEntriesByDate(entries, date)
  const workingEmployeeIds = dateEntries.map((entry) => entry.employeeId)
  return employees.filter((emp) => workingEmployeeIds.includes(emp.id))
}

// Coverage validation functions
export function hasMissingCoverage(entry: BreakEntry): boolean {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End
  const hasCoverage1 = entry.coverageEmployeeId && entry.coverageEmployeeId !== "none"
  const hasCoverage2 = entry.coverage2EmployeeId && entry.coverage2EmployeeId !== "none"

  return (hasBreak1 && !hasCoverage1) || (hasBreak2 && !hasCoverage2)
}

export function getCoverageIssues(entry: BreakEntry): string[] {
  const issues: string[] = []
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End
  const hasCoverage1 = entry.coverageEmployeeId && entry.coverageEmployeeId !== "none"
  const hasCoverage2 = entry.coverage2EmployeeId && entry.coverage2EmployeeId !== "none"

  if (hasBreak1 && !hasCoverage1) {
    issues.push("Break 1 missing coverage")
  }
  if (hasBreak2 && !hasCoverage2) {
    issues.push("Break 2 missing coverage")
  }

  return issues
}
