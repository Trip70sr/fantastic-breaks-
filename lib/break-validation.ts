import type { BreakEntry, ShiftScheduleEntry } from "./types"

export type BreakType = "FIRST" | "SECOND"

export interface BreakValidationResult {
  valid: boolean
  message: string
  breakType?: BreakType
}

export interface ValidationResult {
  isValid: boolean
  message: string
}

/**
 * Validates a complete break entry with shift times and break times
 * Used by the employee break list view component
 */
export function validateBreakEntry(
  employeeId: string,
  date: string,
  shiftStart: string,
  shiftEnd: string,
  break1Start?: string,
  break1End?: string,
  break2Start?: string,
  break2End?: string,
  existingBreaks?: BreakEntry[],
): ValidationResult {
  // Validate shift times
  if (!shiftStart || !shiftEnd) {
    return {
      isValid: false,
      message: "Shift start and end times are required.",
    }
  }

  // Calculate shift duration
  const start = new Date(`1970-01-01T${shiftStart}`)
  const end = new Date(`1970-01-01T${shiftEnd}`)
  const shiftHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  if (shiftHours < 0) {
    return {
      isValid: false,
      message: "End time must be after start time.",
    }
  }

  // Validate first break if provided
  if (break1Start && break1End) {
    const break1StartTime = new Date(`1970-01-01T${break1Start}`)
    const break1EndTime = new Date(`1970-01-01T${break1End}`)

    if (break1EndTime <= break1StartTime) {
      return {
        isValid: false,
        message: "First break end time must be after start time.",
      }
    }

    // Check if first break is already recorded for this employee today
    if (existingBreaks) {
      const hasFirstBreak = existingBreaks.some(
        (entry) =>
          entry.employeeId === employeeId &&
          entry.date === date &&
          entry.break1Start &&
          entry.break1End &&
          entry.id !== `${employeeId}-${date}-${Date.now()}`, // Exclude current entry
      )

      if (hasFirstBreak) {
        return {
          isValid: false,
          message: "This employee has already had the first break today. Please give another employee a break.",
        }
      }
    }
  }

  // Validate second break if provided
  if (break2Start && break2End) {
    const break2StartTime = new Date(`1970-01-01T${break2Start}`)
    const break2EndTime = new Date(`1970-01-01T${break2End}`)

    if (break2EndTime <= break2StartTime) {
      return {
        isValid: false,
        message: "Second break end time must be after start time.",
      }
    }

    // Check if employee worked 6.5+ hours
    if (shiftHours < 6.5) {
      return {
        isValid: false,
        message: "Second break is only available if the employee works 6.5 hours or more.",
      }
    }

    // Check if first break is completed
    if (!break1Start || !break1End) {
      return {
        isValid: false,
        message: "This employee must complete their first break before taking a second break.",
      }
    }

    // Check if second break is already recorded
    if (existingBreaks) {
      const hasSecondBreak = existingBreaks.some(
        (entry) =>
          entry.employeeId === employeeId &&
          entry.date === date &&
          entry.break2Start &&
          entry.break2End &&
          entry.id !== `${employeeId}-${date}-${Date.now()}`,
      )

      if (hasSecondBreak) {
        return {
          isValid: false,
          message: "This employee has already had their second break today. Please select another employee.",
        }
      }
    }
  }

  return {
    isValid: true,
    message: break2Start
      ? "Second break recorded successfully. Employee worked 6.5+ hours."
      : "Break entry validated successfully.",
  }
}

/**
 * Validates if a break can be assigned to an employee
 * Enforces Colorado break laws and prevents duplicate breaks
 */
export function validateBreakAssignment(
  employeeId: string,
  date: string,
  breakType: BreakType,
  existingBreaks: BreakEntry[],
  shiftSchedule?: ShiftScheduleEntry,
): BreakValidationResult {
  // Get all breaks for this employee on this date
  const employeeBreaksToday = existingBreaks.filter(
    (entry) => entry.employeeId === employeeId && entry.date.startsWith(date),
  )

  // Check for duplicate FIRST break
  if (breakType === "FIRST") {
    const hasFirstBreak = employeeBreaksToday.some((entry) => entry.break1Start && entry.break1End)

    if (hasFirstBreak) {
      return {
        valid: false,
        message: "This employee has already had the first break today. Please give another employee a break.",
      }
    }
  }

  // Check for duplicate SECOND break
  if (breakType === "SECOND") {
    const hasSecondBreak = employeeBreaksToday.some((entry) => entry.break2Start && entry.break2End)

    if (hasSecondBreak) {
      return {
        valid: false,
        message: "This employee has already had their second break today. Please select another employee.",
      }
    }

    // Check if employee is eligible for second break (6.5+ hours)
    if (shiftSchedule) {
      const shiftHours = shiftSchedule.netWorkMinutes / 60

      if (shiftHours < 6.5) {
        return {
          valid: false,
          message: "Second break is only available if the employee works 6.5 hours or more.",
        }
      }
    } else {
      // If no schedule found, calculate from break entry
      const entry = employeeBreaksToday[0]
      if (entry && entry.shiftStart && entry.shiftEnd) {
        const start = new Date(`1970-01-01T${entry.shiftStart}`)
        const end = new Date(`1970-01-01T${entry.shiftEnd}`)
        const shiftHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

        if (shiftHours < 6.5) {
          return {
            valid: false,
            message: "Second break is only available if the employee works 6.5 hours or more.",
          }
        }
      }
    }

    // Check if employee has had first break
    const hasFirstBreak = employeeBreaksToday.some((entry) => entry.break1Start && entry.break1End)

    if (!hasFirstBreak) {
      return {
        valid: false,
        message: "This employee must complete their first break before taking a second break.",
      }
    }
  }

  // Validation passed
  return {
    valid: true,
    message:
      breakType === "SECOND"
        ? "Second break is available because this employee worked 6.5 hours or more."
        : "Break can be assigned.",
    breakType,
  }
}

/**
 * Determines which break type should be assigned next
 */
export function getNextBreakType(
  employeeId: string,
  date: string,
  existingBreaks: BreakEntry[],
  shiftSchedule?: ShiftScheduleEntry,
): { breakType: BreakType; eligible: boolean; message: string } {
  const employeeBreaksToday = existingBreaks.filter(
    (entry) => entry.employeeId === employeeId && entry.date.startsWith(date),
  )

  const hasFirstBreak = employeeBreaksToday.some((entry) => entry.break1Start && entry.break1End)
  const hasSecondBreak = employeeBreaksToday.some((entry) => entry.break2Start && entry.break2End)

  // If no breaks yet, return FIRST
  if (!hasFirstBreak) {
    return {
      breakType: "FIRST",
      eligible: true,
      message: "Employee is eligible for first break.",
    }
  }

  // If first break done, check eligibility for second
  if (hasFirstBreak && !hasSecondBreak) {
    // Check 6.5 hour requirement
    let shiftHours = 0

    if (shiftSchedule) {
      shiftHours = shiftSchedule.netWorkMinutes / 60
    } else {
      const entry = employeeBreaksToday[0]
      if (entry && entry.shiftStart && entry.shiftEnd) {
        const start = new Date(`1970-01-01T${entry.shiftStart}`)
        const end = new Date(`1970-01-01T${entry.shiftEnd}`)
        shiftHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }
    }

    if (shiftHours >= 6.5) {
      return {
        breakType: "SECOND",
        eligible: true,
        message: "Employee is eligible for second break (worked 6.5+ hours).",
      }
    } else {
      return {
        breakType: "SECOND",
        eligible: false,
        message: "Employee is not eligible for second break. Must work 6.5+ hours.",
      }
    }
  }

  // All breaks completed
  return {
    breakType: "FIRST",
    eligible: false,
    message: "This employee has completed all required breaks for today.",
  }
}
