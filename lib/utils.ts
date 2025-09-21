import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BreakEntry, Employee } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateShiftHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0

  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

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
    const coverageEmployee1 = employees.find((emp) => emp.id === entry.coverageEmployeeId)
    const coverageEmployee2 = employees.find((emp) => emp.id === entry.coverage2EmployeeId)
    const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)

    return [
      employee?.name || "",
      employee?.department || "",
      new Date(entry.date).toLocaleDateString(),
      formatTime(entry.shiftStart),
      formatTime(entry.shiftEnd),
      formatShiftHours(shiftHours),
      formatTime(entry.break1Start),
      formatTime(entry.break1End),
      coverageEmployee1?.name || "",
      formatTime(entry.break2Start),
      formatTime(entry.break2End),
      coverageEmployee2?.name || "",
      formatTime(entry.outsideTherapyStart),
      formatTime(entry.outsideTherapyEnd),
      entry.outsideTherapyReason,
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}
