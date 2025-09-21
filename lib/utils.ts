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

export function calculateBreakCoverage(breakEntries: any[], date: string): { [key: string]: number } {
  const timeSlots: { [key: string]: number } = {}

  breakEntries
    .filter((entry) => entry.date === date)
    .forEach((entry) => {
      if (entry.break1Start && entry.break1End) {
        const slot1 = `${entry.break1Start}-${entry.break1End}`
        timeSlots[slot1] = (timeSlots[slot1] || 0) + 1
      }
      if (entry.break2Start && entry.break2End) {
        const slot2 = `${entry.break2Start}-${entry.break2End}`
        timeSlots[slot2] = (timeSlots[slot2] || 0) + 1
      }
    })

  return timeSlots
}
