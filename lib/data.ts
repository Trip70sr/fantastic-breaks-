import type { Employee, BreakEntry, CoverageStatus } from "./types"

// Initial employee data with coverage test scenarios
export const initialEmployees: Employee[] = [
  { id: "1", name: "Sarah Johnson", department: "Customer Service", shift: "9:00-17:00", isWorking: true },
  { id: "2", name: "Michael Chen", department: "Sales", shift: "10:00-18:00", isWorking: true },
  { id: "3", name: "Emily Rodriguez", department: "Marketing", shift: "8:00-16:00", isWorking: false },
  { id: "4", name: "David Kim", department: "IT Support", shift: "9:00-17:00", isWorking: true },
  { id: "5", name: "Jessica Williams", department: "HR", shift: "8:30-16:30", isWorking: true },
  { id: "6", name: "Robert Taylor", department: "Operations", shift: "7:00-15:00", isWorking: false },
]

// Initial break entries with coverage test scenarios
export const initialBreakEntries: BreakEntry[] = [
  {
    id: 1,
    employeeId: 1,
    date: new Date().toISOString().split("T")[0],
    break1Start: "10:30",
    break1End: "10:45",
    break1Coverage: 4,
    break2Start: "14:30",
    break2End: "14:45",
    break2Coverage: 5,
    notes: "Regular breaks",
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
    id: 4,
    employeeId: 5,
    date: new Date().toISOString().split("T")[0],
    break1Start: "12:00",
    break1End: "12:15",
    notes: "Break 1 missing coverage",
  },
]

// Export aliases for compatibility
export const employees = initialEmployees
export const breakEntries = initialBreakEntries

// Helper function to get employee name by ID
export const getEmployeeName = (employeeId: number): string => {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown"
}

// Helper function to check if an employee has missing coverage
export const hasMissingCoverage = (entry: BreakEntry): boolean => {
  const break1Status = getCoverageStatus(entry, 1)
  const break2Status = getCoverageStatus(entry, 2)

  return break1Status === "missing" || break2Status === "missing"
}

// Helper function to get coverage status for display
export const getCoverageStatus = (entry: BreakEntry, breakNumber: 1 | 2): CoverageStatus => {
  const hasBreak = breakNumber === 1 ? entry.break1Start && entry.break1End : entry.break2Start && entry.break2End

  if (!hasBreak) return "none"

  const hasCoverage = breakNumber === 1 ? entry.break1Coverage : entry.break2Coverage

  return hasCoverage ? "covered" : "missing"
}

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
  const entriesWithCoverage = entries.filter((e) => e.break1Coverage || e.break2Coverage).length
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
export function getCoverageIssues(entry: BreakEntry): string[] {
  const issues: string[] = []
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End
  const hasCoverage1 = entry.break1Coverage
  const hasCoverage2 = entry.break2Coverage

  if (hasBreak1 && !hasCoverage1) {
    issues.push("Break 1 missing coverage")
  }
  if (hasBreak2 && !hasCoverage2) {
    issues.push("Break 2 missing coverage")
  }

  return issues
}
