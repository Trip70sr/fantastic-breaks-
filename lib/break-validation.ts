import type { BreakEntry, ShiftScheduleEntry } from "./types"
import { getRequiredBreaks } from "./colorado-compliance"

export interface BreakDuplicateCheck {
  isDuplicate: boolean
  message: string
  existingBreaks: {
    break1: boolean
    break2: boolean
    break3: boolean
  }
  requiredBreaks: number
  eligibleForMore: boolean
}

/**
 * Check if a break entry would be a duplicate for a specific employee on a date
 */
export function checkBreakDuplicate(
  employeeId: string,
  date: string,
  existingEntries: BreakEntry[],
  shiftSchedules: ShiftScheduleEntry[],
  breakNumber: 1 | 2 | 3,
): BreakDuplicateCheck {
  console.log("[v0] Checking break duplicate for employee:", employeeId, "date:", date, "break:", breakNumber)

  // Find all existing entries for this employee on this date
  const employeeEntries = existingEntries.filter((entry) => entry.employeeId === employeeId && entry.date === date)

  console.log("[v0] Found existing entries:", employeeEntries.length)

  // Determine which breaks already exist
  const existingBreaks = {
    break1: false,
    break2: false,
    break3: false,
  }

  employeeEntries.forEach((entry) => {
    if (entry.break1Start && entry.break1End) {
      existingBreaks.break1 = true
    }
    if (entry.break2Start && entry.break2End) {
      existingBreaks.break2 = true
    }
    if (entry.break3Start && entry.break3End) {
      existingBreaks.break3 = true
    }
  })

  console.log("[v0] Existing breaks:", existingBreaks)

  // Calculate required breaks based on shift hours
  const schedule = shiftSchedules.find((s) => s.employeeId === employeeId && s.date === date)

  let requiredBreaks = 0
  if (schedule) {
    const shiftHours = schedule.netWorkMinutes / 60
    const breakRequirements = getRequiredBreaks(shiftHours)
    requiredBreaks = breakRequirements.restBreaks
    console.log("[v0] Shift hours:", shiftHours, "Required breaks:", requiredBreaks)
  } else {
    // Try to infer from existing entries
    const entry = employeeEntries[0]
    if (entry) {
      const [startHour, startMin] = entry.shiftStart.split(":").map(Number)
      const [endHour, endMin] = entry.shiftEnd.split(":").map(Number)
      const startMinutes = startHour * 60 + startMin
      let endMinutes = endHour * 60 + endMin
      if (endMinutes < startMinutes) endMinutes += 24 * 60
      const shiftMinutes = endMinutes - startMinutes
      const shiftHours = shiftMinutes / 60
      const breakRequirements = getRequiredBreaks(shiftHours)
      requiredBreaks = breakRequirements.restBreaks
      console.log("[v0] Inferred shift hours from entry:", shiftHours, "Required breaks:", requiredBreaks)
    }
  }

  // Check if the specific break number already exists
  const breakAlreadyExists =
    (breakNumber === 1 && existingBreaks.break1) ||
    (breakNumber === 2 && existingBreaks.break2) ||
    (breakNumber === 3 && existingBreaks.break3)

  // Count total breaks taken
  const totalBreaksTaken =
    (existingBreaks.break1 ? 1 : 0) + (existingBreaks.break2 ? 1 : 0) + (existingBreaks.break3 ? 1 : 0)

  const eligibleForMore = totalBreaksTaken < requiredBreaks

  console.log("[v0] Total breaks taken:", totalBreaksTaken, "Eligible for more:", eligibleForMore)

  // Generate appropriate message
  let message = ""
  let isDuplicate = false

  if (breakAlreadyExists) {
    isDuplicate = true
    message = `Break ${breakNumber} has already been completed for this employee today. Please select another employee.`
  } else if (!eligibleForMore) {
    isDuplicate = true
    message = `This employee's breaks have been completed (${totalBreaksTaken}/${requiredBreaks} breaks taken). Please select another employee.`
  }

  return {
    isDuplicate,
    message,
    existingBreaks,
    requiredBreaks,
    eligibleForMore,
  }
}

/**
 * Get which break number should be entered next for an employee
 */
export function getNextBreakNumber(employeeId: string, date: string, existingEntries: BreakEntry[]): 1 | 2 | 3 {
  const employeeEntries = existingEntries.filter((entry) => entry.employeeId === employeeId && entry.date === date)

  let hasBreak1 = false
  let hasBreak2 = false

  employeeEntries.forEach((entry) => {
    if (entry.break1Start && entry.break1End) hasBreak1 = true
    if (entry.break2Start && entry.break2End) hasBreak2 = true
  })

  if (!hasBreak1) return 1
  if (!hasBreak2) return 2
  return 3
}
