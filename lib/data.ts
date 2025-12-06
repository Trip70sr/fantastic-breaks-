"use client"

import type { Employee, BreakEntry } from "./types"

const EMPLOYEES_KEY = "employees"
const BREAK_ENTRIES_KEY = "breakEntries"

export const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "Customer Service",
    shift: "Morning",
    email: "sarah.j@company.com",
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Sales",
    shift: "Afternoon",
    email: "michael.c@company.com",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "Customer Service",
    shift: "Evening",
    email: "emily.r@company.com",
  },
  {
    id: "4",
    name: "David Kim",
    department: "Tech Support",
    shift: "Morning",
    email: "david.k@company.com",
  },
  {
    id: "5",
    name: "Jessica Taylor",
    department: "Sales",
    shift: "Afternoon",
    email: "jessica.t@company.com",
  },
]

// Employee functions
export function loadEmployees(): Employee[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EMPLOYEES_KEY)
  return data ? JSON.parse(data) : initialEmployees
}

export function saveEmployees(employees: Employee[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
}

export function addEmployee(employee: Employee): void {
  const employees = loadEmployees()
  employees.push(employee)
  saveEmployees(employees)
}

export function updateEmployee(id: string, updates: Partial<Employee>): void {
  const employees = loadEmployees()
  const index = employees.findIndex((e) => e.id === id)
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates }
    saveEmployees(employees)
  }
}

export function deleteEmployee(id: string): void {
  const employees = loadEmployees()
  saveEmployees(employees.filter((e) => e.id !== id))
}

// Break entry functions
export function loadBreakEntries(): BreakEntry[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(BREAK_ENTRIES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveBreakEntries(entries: BreakEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(BREAK_ENTRIES_KEY, JSON.stringify(entries))
}

export function addBreakEntry(entry: BreakEntry): void {
  const entries = loadBreakEntries()
  entries.push(entry)
  saveBreakEntries(entries)
}

export function updateBreakEntry(id: string, updates: Partial<BreakEntry>): void {
  const entries = loadBreakEntries()
  const index = entries.findIndex((e) => e.id === id)
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates }
    saveBreakEntries(entries)
  }
}

export function deleteBreakEntry(id: string): void {
  const entries = loadBreakEntries()
  saveBreakEntries(entries.filter((e) => e.id !== id))
}

export function getBreakEntriesByEmployee(employeeId: string): BreakEntry[] {
  return loadBreakEntries().filter((e) => e.employeeId === employeeId)
}

export function getBreakEntriesByDate(date: string): BreakEntry[] {
  return loadBreakEntries().filter((e) => e.date === date)
}

export function exportData(): string {
  return JSON.stringify({
    employees: loadEmployees(),
    breakEntries: loadBreakEntries(),
  })
}

export function importData(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData)
    if (data.employees) saveEmployees(data.employees)
    if (data.breakEntries) saveBreakEntries(data.breakEntries)
  } catch (error) {
    throw new Error("Invalid data format")
  }
}
