import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  if (!time) return ""
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateShareToken(): string {
  return Math.random().toString(36).substr(2, 16)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function calculateBreakCoverage(breakEntries: any[], employees: any[]): number {
  if (breakEntries.length === 0) return 100

  let totalBreaks = 0
  let coveredBreaks = 0

  breakEntries.forEach((entry) => {
    if (entry.break1Start && entry.break1End) {
      totalBreaks++
      if (entry.break1Coverage) coveredBreaks++
    }
    if (entry.break2Start && entry.break2End) {
      totalBreaks++
      if (entry.break2Coverage) coveredBreaks++
    }
  })

  return totalBreaks === 0 ? 100 : Math.round((coveredBreaks / totalBreaks) * 100)
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
  return Math.round((diffMinutes / 60) * 100) / 100
}

export function formatShiftHours(hours: number): string {
  if (hours === 0) return "0 hours"

  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)

  if (minutes === 0) {
    return `${wholeHours} ${wholeHours === 1 ? "hour" : "hours"}`
  } else if (wholeHours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
  } else {
    return `${wholeHours}h ${minutes}m`
  }
}

export function calculateBreakDuration(start: string, end: string): number {
  if (!start || !end) return 0
  const startTime = new Date(`2000-01-01T${start}:00`)
  const endTime = new Date(`2000-01-01T${end}:00`)
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
}

export function isBreakTimeConflict(
  break1Start: string,
  break1End: string,
  break2Start: string,
  break2End: string,
): boolean {
  if (!break1Start || !break1End || !break2Start || !break2End) return false

  const b1Start = new Date(`2000-01-01T${break1Start}:00`)
  const b1End = new Date(`2000-01-01T${break1End}:00`)
  const b2Start = new Date(`2000-01-01T${break2Start}:00`)
  const b2End = new Date(`2000-01-01T${break2End}:00`)

  return b1Start < b2End && b2Start < b1End
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function sortByTime(a: string, b: string): number {
  const timeA = new Date(`2000-01-01T${a}:00`)
  const timeB = new Date(`2000-01-01T${b}:00`)
  return timeA.getTime() - timeB.getTime()
}

export function getTimeFromNow(date: string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMs = targetDate.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Tomorrow"
  if (diffInDays === -1) return "Yesterday"
  if (diffInDays > 1) return `In ${diffInDays} days`
  return `${Math.abs(diffInDays)} days ago`
}
