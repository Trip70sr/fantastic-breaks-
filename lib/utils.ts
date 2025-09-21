import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Employee, BreakEntry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// No updates needed for the rest of the code

export function exportToCSV(breakEntries: BreakEntry[], employees: Employee[], filename: string) {
  const headers = [
    "Employee Name",
    "Department",
    "Date",
    "Shift Start",
    "Shift End",
    "Break 1 Start",
    "Break 1 End",
    "Break 1 Coverage",
    "Break 2 Start",
    "Break 2 End",
    "Break 2 Coverage",
    "Outside Therapy Start",
    "Outside Therapy End",
    "Outside Therapy Reason",
  ]

  const rows = breakEntries.map((entry) => {
    const employee = employees.find((emp) => emp.id === entry.employeeId)
    const coverageEmployee1 = employees.find((emp) => emp.id === entry.coverageEmployeeId)
    const coverageEmployee2 = employees.find((emp) => emp.id === entry.coverage2EmployeeId)

    return [
      employee?.name || "Unknown",
      employee?.department || "Unknown",
      new Date(entry.date).toLocaleDateString(),
      entry.shiftStart,
      entry.shiftEnd,
      entry.break1Start || "",
      entry.break1End || "",
      coverageEmployee1?.name || "",
      entry.break2Start || "",
      entry.break2End || "",
      coverageEmployee2?.name || "",
      entry.outsideTherapyStart || "",
      entry.outsideTherapyEnd || "",
      entry.outsideTherapyReason || "",
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function calculateShiftHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMinute
  let endMinutes = endHour * 60 + endMinute

  // Handle overnight shifts
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60
  }

  return (endMinutes - startMinutes) / 60
}

export function formatShiftHours(hours: number): string {
  return `${hours.toFixed(2)} hrs`
}

export function formatTime(time: string): string {
  if (!time) return ""

  const [hour, minute] = time.split(":")
  const hourNum = Number.parseInt(hour)
  const ampm = hourNum >= 12 ? "PM" : "AM"
  const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum

  return `${displayHour}:${minute} ${ampm}`
}

export function calculateBreakDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  return endMinutes - startMinutes
}

export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}
