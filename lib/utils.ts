import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Employee, BreakEntry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function calculateShiftHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  let endTotalMinutes = endHours * 60 + endMinutes

  // Handle overnight shifts
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60
  }

  const diffMinutes = endTotalMinutes - startTotalMinutes
  return diffMinutes / 60
}

export function formatShiftHours(hours: number): string {
  return `${hours.toFixed(2)} hrs`
}

export function exportToCSV(breakEntries: BreakEntry[], employees: Employee[], filename: string) {
  const headers = [
    "Employee Name",
    "Department",
    "Date",
    "Shift Start",
    "Shift End",
    "Shift Hours",
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
    const coverageEmployee1 = entry.coverageEmployeeId
      ? employees.find((emp) => emp.id === entry.coverageEmployeeId)
      : null
    const coverageEmployee2 = entry.coverage2EmployeeId
      ? employees.find((emp) => emp.id === entry.coverage2EmployeeId)
      : null

    const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)

    return [
      employee?.name || "Unknown",
      employee?.department || "Unknown",
      new Date(entry.date).toLocaleDateString(),
      formatTime(entry.shiftStart),
      formatTime(entry.shiftEnd),
      formatShiftHours(shiftHours),
      entry.break1Start ? formatTime(entry.break1Start) : "",
      entry.break1End ? formatTime(entry.break1End) : "",
      coverageEmployee1?.name || "",
      entry.break2Start ? formatTime(entry.break2Start) : "",
      entry.break2End ? formatTime(entry.break2End) : "",
      coverageEmployee2?.name || "",
      entry.outsideTherapyStart ? formatTime(entry.outsideTherapyStart) : "",
      entry.outsideTherapyEnd ? formatTime(entry.outsideTherapyEnd) : "",
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

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
