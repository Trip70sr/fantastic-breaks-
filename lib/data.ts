import type { Employee, BreakEntry, Department } from "./types"

// Initial employee data with coverage test scenarios
export const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "RBT" as Department,
    email: "sarah.johnson@company.com",
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Operations" as Department,
    email: "michael.chen@company.com",
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "BCBA" as Department,
    email: "emily.rodriguez@company.com",
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    name: "David Kim",
    department: "RBT" as Department,
    email: "david.kim@company.com",
    phone: "(555) 456-7890",
  },
  {
    id: "5",
    name: "Jessica Williams",
    department: "Floater" as Department,
    email: "jessica.williams@company.com",
    phone: "(555) 567-8901",
  },
  {
    id: "6",
    name: "Alex Thompson",
    department: "RBT" as Department,
    email: "alex.thompson@company.com",
    phone: "(555) 678-9012",
  },
]

// Initial break entries with coverage test scenarios
export const initialBreakEntries: BreakEntry[] = [
  // Sarah Johnson - Complete coverage
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
    coverageEmployeeId: "6", // Alex Thompson
    coverage2EmployeeId: "5", // Jessica Williams
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Michael Chen - NO COVERAGE (should be red)
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
    coverageEmployeeId: "", // NO COVERAGE
    coverage2EmployeeId: "", // NO COVERAGE
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Emily Rodriguez - Complete coverage
  {
    id: "3",
    employeeId: "3",
    date: new Date().toISOString(),
    shiftStart: "07:30",
    shiftEnd: "15:30",
    break1Start: "09:30",
    break1End: "09:45",
    break2Start: "13:30",
    break2End: "13:45",
    coverageEmployeeId: "1", // Sarah Johnson
    coverage2EmployeeId: "4", // David Kim
    outsideTherapyStart: "11:00",
    outsideTherapyEnd: "12:00",
    outsideTherapyReason: "Client meeting",
  },
  // David Kim - Partial coverage (Break 2 missing - should be red)
  {
    id: "4",
    employeeId: "4",
    date: new Date().toISOString(),
    shiftStart: "08:30",
    shiftEnd: "16:30",
    break1Start: "09:30",
    break1End: "09:45",
    break2Start: "13:30",
    break2End: "13:45",
    coverageEmployeeId: "5", // Jessica Williams
    coverage2EmployeeId: "", // NO COVERAGE for break 2
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Jessica Williams - Missing coverage (should be red)
  {
    id: "5",
    employeeId: "5",
    date: new Date().toISOString(),
    shiftStart: "10:00",
    shiftEnd: "16:00",
    break1Start: "12:00",
    break1End: "12:15",
    break2Start: "",
    break2End: "",
    coverageEmployeeId: "", // NO COVERAGE
    coverage2EmployeeId: "",
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Alex Thompson - Complete coverage
  {
    id: "6",
    employeeId: "6",
    date: new Date().toISOString(),
    shiftStart: "09:00",
    shiftEnd: "17:00",
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    coverageEmployeeId: "2", // Michael Chen
    coverage2EmployeeId: "3", // Emily Rodriguez
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
]

// Export aliases for compatibility
export const employees = initialEmployees
export const breakEntries = initialBreakEntries

// Helper function to get employee name by ID
export const getEmployeeName = (employeeId: string): string => {
  const employee = initialEmployees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown"
}

// Helper function to check if an employee has missing coverage
export const hasMissingCoverage = (entry: BreakEntry): boolean => {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const missingBreak1Coverage = hasBreak1 && !entry.coverageEmployeeId
  const missingBreak2Coverage = hasBreak2 && !entry.coverage2EmployeeId

  return missingBreak1Coverage || missingBreak2Coverage
}

// Helper function to get coverage status for display
export const getCoverageStatus = (entry: BreakEntry) => {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const break1Status = hasBreak1 ? (entry.coverageEmployeeId ? "covered" : "missing") : "none"
  const break2Status = hasBreak2 ? (entry.coverage2EmployeeId ? "covered" : "missing") : "none"

  return { break1Status, break2Status }
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
