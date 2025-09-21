import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateShiftHours(shiftStart: string, shiftEnd: string): number {
  if (!shiftStart || !shiftEnd) return 0
  const start = new Date(`2000-01-01T${shiftStart}:00`)
  const end = new Date(`2000-01-01T${shiftEnd}:00`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
}

export function formatShiftHours(hours: number): string {
  if (hours === 0) return "0 hours"
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)

  if (minutes === 0) {
    return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""}`
  }

  return `${wholeHours}h ${minutes}m`
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
