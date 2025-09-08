import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Employee, BreakEntry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time from 24-hour to 12-hour format
export function formatTime(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minutes} ${ampm}`
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Calculate duration between two times in minutes
export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  return endTotalMinutes - startTotalMinutes
}

// Format duration in minutes to hours and minutes
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 min"

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

// Export data to CSV
export function exportToCSV(entries: BreakEntry[], employees: Employee[], filename = "break-data.csv"): void {
  const headers = ["Employee", "Department", "Date", "Break Start", "Break End", "Lunch Start", "Lunch End", "Status"]

  const csvContent = [
    headers.join(","),
    ...entries.map((entry) => {
      const employee = employees.find((emp) => emp.id === entry.employeeId)
      return [
        employee?.name || "Unknown",
        employee?.department || "Unknown",
        entry.date,
        entry.breakStart || "",
        entry.breakEnd || "",
        entry.lunchStart || "",
        entry.lunchEnd || "",
        entry.status,
      ].join(",")
    }),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Get employee statistics
export function getEmployeeStats(entries: BreakEntry[], employees: Employee[]) {
  const totalEmployees = employees.length
  const workingToday = new Set(entries.map((entry) => entry.employeeId)).size
  const onBreak = entries.filter((entry) => entry.status === "in-progress").length
  const completedBreaks = entries.filter((entry) => entry.status === "completed").length
  const missedBreaks = entries.filter((entry) => entry.status === "missed").length

  return {
    totalEmployees,
    workingToday,
    onBreak,
    completedBreaks,
    missedBreaks,
  }
}

// Filter entries by date
export function filterEntriesByDate(entries: BreakEntry[], date: Date): BreakEntry[] {
  const dateString = date.toISOString().split("T")[0]
  return entries.filter((entry) => entry.date === dateString)
}

// Filter entries by employee
export function filterEntriesByEmployee(entries: BreakEntry[], employeeId: string): BreakEntry[] {
  if (employeeId === "all") return entries
  return entries.filter((entry) => entry.employeeId === employeeId)
}

// Filter entries by department
export function filterEntriesByDepartment(
  entries: BreakEntry[],
  employees: Employee[],
  department: string,
): BreakEntry[] {
  if (department === "all") return entries

  const departmentEmployeeIds = employees.filter((emp) => emp.department === department).map((emp) => emp.id)

  return entries.filter((entry) => departmentEmployeeIds.includes(entry.employeeId))
}

// Filter entries by status
export function filterEntriesByStatus(entries: BreakEntry[], status: string): BreakEntry[] {
  if (status === "all") return entries
  return entries.filter((entry) => entry.status === status)
}

// Get unique departments
export function getDepartments(employees: Employee[]): string[] {
  const departments = employees.map((emp) => emp.department)
  return [...new Set(departments)].sort()
}

// Validate time format (HH:MM)
export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

// Check if end time is after start time
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  if (!isValidTime(startTime) || !isValidTime(endTime)) return false

  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  return endTotalMinutes > startTotalMinutes
}

// Get current time in HH:MM format
export function getCurrentTime(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}
