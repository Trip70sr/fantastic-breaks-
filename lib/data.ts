import type { Employee, BreakEntry } from "./types"

export const initialEmployees: Employee[] = [
  { id: "1", name: 'Alana "Grey" Stogner', department: "RBT" },
  { id: "2", name: "Alana Gayle", department: "RBT" },
  { id: "3", name: "Alisa Lewis", department: "RBT" },
  { id: "4", name: "Anele Aguilar", department: "RBT" },
  { id: "5", name: "Angelier Stevenson", department: "RBT" },
  { id: "6", name: "Ava Mead", department: "RBT" },
  { id: "7", name: "Barbara Graham", department: "RBT" },
  { id: "8", name: "Brian Scott", department: "RBT" },
  { id: "9", name: "Dominic Kenned", department: "RBT" },
  { id: "10", name: "Elecia Cantu", department: "RBT" },
  { id: "11", name: 'Elena "E" Dunz', department: "RBT" },
  { id: "12", name: "Halle Smith", department: "RBT" },
  { id: "13", name: "Jessica Fuller", department: "RBT" },
  { id: "14", name: "Lexis Anderson", department: "RBT" },
  { id: "15", name: "Madeline Heinen", department: "RBT" },
  { id: "16", name: "Madison Sanchez", department: "RBT" },
  { id: "17", name: "Malia Leung", department: "RBT" },
  { id: "18", name: "Molly Leasure", department: "RBT" },
  { id: "19", name: "Stephanie Triplett", department: "RBT" },
  { id: "20", name: "Strawman Jackson", department: "RBT" },
  { id: "21", name: "Taylor Gundrum", department: "RBT" },
]

// Sample break entries data
export const initialBreakEntries: BreakEntry[] = [
  {
    id: "1",
    employeeId: "1",
    date: "2024-01-15",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    break1Start: "10:00",
    break1End: "10:15",
    break2Start: "14:00",
    break2End: "14:15",
    coverageEmployeeId: "2",
    coverage2EmployeeId: "3",
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  {
    id: "2",
    employeeId: "2",
    date: "2024-01-15",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    coverageEmployeeId: "1",
    coverage2EmployeeId: "4",
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  {
    id: "3",
    employeeId: "3",
    date: "2024-01-15",
    shiftStart: "07:00",
    shiftEnd: "15:00",
    break1Start: "09:00",
    break1End: "09:15",
    break2Start: "13:00",
    break2End: "13:15",
    coverageEmployeeId: "4",
    coverage2EmployeeId: "1",
    outsideTherapyStart: "11:00",
    outsideTherapyEnd: "12:00",
    outsideTherapyReason: "Client meeting",
  },
]

// Load break entries from localStorage or return initial data
export function loadBreakEntries(): BreakEntry[] {
  if (typeof window === "undefined") {
    return initialBreakEntries
  }

  try {
    const stored = localStorage.getItem("breakEntries")
    return stored ? JSON.parse(stored) : initialBreakEntries
  } catch (error) {
    console.error("Error loading break entries:", error)
    return initialBreakEntries
  }
}

// Save break entries to localStorage
export function saveBreakEntries(entries: BreakEntry[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("breakEntries", JSON.stringify(entries))
    localStorage.setItem("lastDataUpdate", new Date().toISOString())
  } catch (error) {
    console.error("Error saving break entries:", error)
  }
}

// Load employees from localStorage or return initial data
export function loadEmployees(): Employee[] {
  if (typeof window === "undefined") {
    return initialEmployees
  }

  try {
    const stored = localStorage.getItem("employees")
    return stored ? JSON.parse(stored) : initialEmployees
  } catch (error) {
    console.error("Error loading employees:", error)
    return initialEmployees
  }
}

// Save employees to localStorage
export function saveEmployees(employees: Employee[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("employees", JSON.stringify(employees))
    localStorage.setItem("lastDataUpdate", new Date().toISOString())
  } catch (error) {
    console.error("Error saving employees:", error)
  }
}

// Generate a unique ID for new entries
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Get employee name by ID
export function getEmployeeName(employeeId: string, employees: Employee[]): string {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown Employee"
}

// Filter break entries by date
export function filterEntriesByDate(entries: BreakEntry[], date: string): BreakEntry[] {
  return entries.filter((entry) => entry.date === date)
}

// Filter break entries by employee
export function filterEntriesByEmployee(entries: BreakEntry[], employeeId: string): BreakEntry[] {
  return entries.filter((entry) => entry.employeeId === employeeId)
}

// Get unique departments from employees
export function getDepartments(employees: Employee[]): string[] {
  const departments = employees.map((emp) => emp.department)
  return [...new Set(departments)].sort()
}

// Filter employees by department
export function filterEmployeesByDepartment(employees: Employee[], department: string): Employee[] {
  if (department === "all") return employees
  return employees.filter((emp) => emp.department === department)
}

// Get break statistics
export function getBreakStats(entries: BreakEntry[], employees: Employee[]) {
  const totalEntries = entries.length
  const entriesWithBreaks = entries.filter((entry) => entry.break1Start && entry.break1End).length
  const entriesWithSecondBreaks = entries.filter((entry) => entry.break2Start && entry.break2End).length
  const entriesWithCoverage = entries.filter(
    (entry) => entry.coverageEmployeeId && entry.coverageEmployeeId !== "none",
  ).length

  return {
    totalEntries,
    entriesWithBreaks,
    entriesWithSecondBreaks,
    entriesWithCoverage,
    breakComplianceRate: totalEntries > 0 ? (entriesWithBreaks / totalEntries) * 100 : 0,
    coverageRate: entriesWithBreaks > 0 ? (entriesWithCoverage / entriesWithBreaks) * 100 : 0,
  }
}

// Get working employees for a specific date
export function getWorkingEmployeesForDate(entries: BreakEntry[], employees: Employee[], date: string): Employee[] {
  const workingEmployeeIds = entries.filter((entry) => entry.date === date).map((entry) => entry.employeeId)

  return employees.filter((emp) => workingEmployeeIds.includes(emp.id))
}

// Validate break entry data
export function validateBreakEntry(entry: Partial<BreakEntry>): string[] {
  const errors: string[] = []

  if (!entry.employeeId) {
    errors.push("Employee is required")
  }

  if (!entry.date) {
    errors.push("Date is required")
  }

  if (!entry.shiftStart) {
    errors.push("Shift start time is required")
  }

  if (!entry.shiftEnd) {
    errors.push("Shift end time is required")
  }

  if (entry.shiftStart && entry.shiftEnd) {
    const startTime = new Date(`2000-01-01T${entry.shiftStart}:00`)
    const endTime = new Date(`2000-01-01T${entry.shiftEnd}:00`)

    if (startTime >= endTime) {
      errors.push("Shift end time must be after start time")
    }
  }

  if (entry.break1Start && entry.break1End) {
    const break1Start = new Date(`2000-01-01T${entry.break1Start}:00`)
    const break1End = new Date(`2000-01-01T${entry.break1End}:00`)

    if (break1Start >= break1End) {
      errors.push("Break 1 end time must be after start time")
    }
  }

  if (entry.break2Start && entry.break2End) {
    const break2Start = new Date(`2000-01-01T${entry.break2Start}:00`)
    const break2End = new Date(`2000-01-01T${entry.break2End}:00`)

    if (break2Start >= break2End) {
      errors.push("Break 2 end time must be after start time")
    }
  }

  return errors
}
