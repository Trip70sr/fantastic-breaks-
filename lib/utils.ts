"use client"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BreakEntry, Employee } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string | undefined): string {
  if (!time) return "-"
  return time
}

export function calculateTotalHours(entry: BreakEntry): string {
  if (!entry.shiftStart || !entry.shiftEnd) return "0.00"

  const start = new Date(`2000-01-01T${entry.shiftStart}`)
  const end = new Date(`2000-01-01T${entry.shiftEnd}`)

  let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  // Subtract break times
  if (entry.break1Start && entry.break1End) {
    const break1Start = new Date(`2000-01-01T${entry.break1Start}`)
    const break1End = new Date(`2000-01-01T${entry.break1End}`)
    hours -= (break1End.getTime() - break1Start.getTime()) / (1000 * 60 * 60)
  }

  if (entry.break2Start && entry.break2End) {
    const break2Start = new Date(`2000-01-01T${entry.break2Start}`)
    const break2End = new Date(`2000-01-01T${entry.break2End}`)
    hours -= (break2End.getTime() - break2Start.getTime()) / (1000 * 60 * 60)
  }

  return hours.toFixed(2)
}

export function calculateShiftHours(start: string, end: string, breakMinutes = 0): number {
  const startTime = new Date(`2000-01-01T${start}`)
  const endTime = new Date(`2000-01-01T${end}`)
  const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  return (totalMinutes - breakMinutes) / 60
}

export function formatShiftHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

export function exportToCSV(entries: BreakEntry[], employees: Employee[], filename = "break-report"): void {
  if (typeof window === "undefined") return

  const headers = [
    "Date",
    "Employee",
    "Department",
    "Shift Start",
    "Shift End",
    "Break 1 Start",
    "Break 1 End",
    "Coverage 1",
    "Break 2 Start",
    "Break 2 End",
    "Coverage 2",
    "Total Hours",
  ]

  const rows = entries.map((entry) => {
    const employee = employees.find((e) => e.id === entry.employeeId)
    const coverage1 = employees.find((e) => e.id === entry.coverageEmployeeId)
    const coverage2 = employees.find((e) => e.id === entry.coverage2EmployeeId)

    return [
      new Date(entry.date).toLocaleDateString(),
      employee?.name || "Unknown",
      employee?.department || "-",
      formatTime(entry.shiftStart),
      formatTime(entry.shiftEnd),
      formatTime(entry.break1Start),
      formatTime(entry.break1End),
      coverage1?.name || "-",
      formatTime(entry.break2Start),
      formatTime(entry.break2End),
      coverage2?.name || "-",
      calculateTotalHours(entry),
    ]
  })

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
