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
    breakStart: "10:00",
    breakEnd: "10:15",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    status: "completed",
  },
  {
    id: "2",
    employeeId: "2",
    date: "2024-01-15",
    breakStart: "10:15",
    breakEnd: "10:30",
    lunchStart: "12:30",
    lunchEnd: "13:30",
    status: "completed",
  },
  {
    id: "3",
    employeeId: "3",
    date: "2024-01-15",
    breakStart: "09:45",
    breakEnd: "10:00",
    lunchStart: "11:45",
    lunchEnd: "12:45",
    status: "in-progress",
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
