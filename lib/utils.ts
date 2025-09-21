import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BreakEntry, Employee } from "./types"

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

export function calculateBreakDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)

  return (end.getTime() - start.getTime()) / (1000 * 60) // Return minutes
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false

  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)

  return end > start
}

export function calculateTotalHours(entry: BreakEntry): string {
  const {
    shiftStart,
    shiftEnd,
    break1Start,
    break1End,
    break2Start,
    break2End,
    outsideTherapyStart,
    outsideTherapyEnd,
  } = entry

  if (!shiftStart || !shiftEnd) return "0.00"

  const startTotalMinutes = calculateBreakDuration("00:00", shiftStart)
  const endTotalMinutes = calculateBreakDuration("00:00", shiftEnd)

  // Handle cases where the shift spans across midnight
  const shiftDurationMinutes =
    endTotalMinutes >= startTotalMinutes
      ? endTotalMinutes - startTotalMinutes
      : 24 * 60 - startTotalMinutes + endTotalMinutes

  // Subtract break durations
  const break1Duration = calculateBreakDuration(break1Start, break1End)
  const break2Duration = calculateBreakDuration(break2Start, break2End)
  const outsideTherapyDuration = calculateBreakDuration(outsideTherapyStart, outsideTherapyEnd)

  const totalMinutes = shiftDurationMinutes - break1Duration - break2Duration - outsideTherapyDuration
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}.${minutes.toString().padStart(2, "0")}`
}

export function calculateShiftHours(shiftStart?: string, shiftEnd?: string): number {
  if (!shiftStart || !shiftEnd) return 0

  const startTotalMinutes = calculateBreakDuration("00:00", shiftStart)
  const endTotalMinutes = calculateBreakDuration("00:00", shiftEnd)

  // Handle cases where the shift spans across midnight
  const shiftDurationMinutes =
    endTotalMinutes >= startTotalMinutes
      ? endTotalMinutes - startTotalMinutes
      : 24 * 60 - startTotalMinutes + endTotalMinutes

  return shiftDurationMinutes / 60
}

export function formatShiftHours(hours: number): string {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)

  if (minutes === 0) {
    return `${wholeHours}.00 hrs`
  } else {
    return `${wholeHours}.${minutes.toString().padStart(2, "0")} hrs`
  }
}

export function exportToCSV(breakEntries: BreakEntry[], employees: Employee[], filename: string) {
  // Create headers
  const headers = [
    "Date",
    "Employee",
    "Department",
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
    "Total Hours",
  ]

  // Create rows
  const rows = breakEntries.map((entry) => {
    const employee = employees.find((e) => e.id === entry.employeeId)
    const coverage1Employee = employees.find((e) => e.id === entry.coverageEmployeeId)
    const coverage2Employee = employees.find((e) => e.id === entry.coverage2EmployeeId)

    const date = new Date(entry.date)
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    return {
      Date: formattedDate,
      Employee: employee?.name || "Unknown",
      Department: employee?.department || "Unknown",
      "Shift Start": formatTime(entry.shiftStart),
      "Shift End": formatTime(entry.shiftEnd),
      "Break 1 Start": formatTime(entry.break1Start),
      "Break 1 End": formatTime(entry.break1End),
      "Break 1 Coverage": coverage1Employee?.name || "",
      "Break 2 Start": formatTime(entry.break2Start),
      "Break 2 End": formatTime(entry.break2End),
      "Break 2 Coverage": coverage2Employee?.name || "",
      "Outside Therapy Start": formatTime(entry.outsideTherapyStart),
      "Outside Therapy End": formatTime(entry.outsideTherapyEnd),
      "Outside Therapy Reason": entry.outsideTherapyReason || "",
      "Total Hours": calculateTotalHours(entry),
    }
  })

  // Combine headers and rows
  const csvContent =
    "data:text/csv;charset=utf-8," + [headers, ...rows.map(Object.values)].map((row) => row.join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatOutsideTherapyTime(start?: string, end?: string, reason?: string): string {
  if (!start || !end) return ""

  const formattedTime = `${formatTime(start)} - ${formatTime(end)}`
  return reason ? `${formattedTime} (${reason})` : formattedTime
}
