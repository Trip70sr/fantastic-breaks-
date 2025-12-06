"use client"

import type { BreakEntry, Employee, BreakViolation } from "./types"

export interface ColoradoBreakRules {
  minShiftForBreak: number // hours
  requiredBreakMinutes: number // minutes per break period
  allowedBreakVariance: number // minutes of acceptable variance
  maxShiftWithoutMeal: number // hours before meal break required
  mealBreakMinutes: number // minutes for meal break
  maxConsecutiveHours: number // max hours without break
}

export const COLORADO_BREAK_RULES: ColoradoBreakRules = {
  minShiftForBreak: 4, // 4+ hour shift requires break
  requiredBreakMinutes: 10, // 10 minute paid rest break per 4 hours
  allowedBreakVariance: 5, // allow up to 5 minutes extra
  maxShiftWithoutMeal: 5, // meal break required after 5 hours
  mealBreakMinutes: 30, // 30 minute meal break
  maxConsecutiveHours: 4, // break required every 4 hours
}

function calculateMinutes(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  let endMinutes = endHour * 60 + endMin

  // Handle overnight shifts
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60
  }

  return endMinutes - startMinutes
}

function calculateShiftHours(shiftStart: string, shiftEnd: string): number {
  return calculateMinutes(shiftStart, shiftEnd) / 60
}

export function getRequiredBreaks(shiftHours: number): {
  restBreaks: number
  mealBreaks: number
  totalRequiredBreakMinutes: number
} {
  const rules = COLORADO_BREAK_RULES

  // Rest breaks: 10 minutes per 4 hours worked
  const restBreaks = Math.floor(shiftHours / rules.maxConsecutiveHours)

  // Meal break: 30 minutes if shift > 5 hours
  const mealBreaks = shiftHours > rules.maxShiftWithoutMeal ? 1 : 0

  const totalRequiredBreakMinutes = restBreaks * rules.requiredBreakMinutes + mealBreaks * rules.mealBreakMinutes

  return {
    restBreaks,
    mealBreaks,
    totalRequiredBreakMinutes,
  }
}

export function analyzeBreakCompliance(entry: BreakEntry, employee: Employee): BreakViolation[] {
  const violations: BreakViolation[] = []
  const rules = COLORADO_BREAK_RULES

  // Calculate shift duration
  const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)

  // Get required breaks
  const { restBreaks, mealBreaks, totalRequiredBreakMinutes } = getRequiredBreaks(shiftHours)

  // Calculate actual breaks taken
  let actualBreakMinutes = 0
  let breakCount = 0

  if (entry.break1Start && entry.break1End) {
    const break1Duration = calculateMinutes(entry.break1Start, entry.break1End)
    actualBreakMinutes += break1Duration
    breakCount++

    // Check if break 1 is excessive
    const expectedDuration = break1Duration > 20 ? rules.mealBreakMinutes : rules.requiredBreakMinutes
    const allowedMax = expectedDuration + rules.allowedBreakVariance

    if (break1Duration > allowedMax) {
      violations.push({
        id: `${entry.id}-break1-excessive`,
        employeeId: entry.employeeId,
        date: entry.date,
        violationType: "excessive_duration",
        description: `Break 1 exceeded allowed duration by ${break1Duration - allowedMax} minutes`,
        breakDuration: break1Duration,
        expectedDuration,
        shiftHours,
        revenueImpact: 0, // Will be calculated by revenue system
      })
    }
  }

  if (entry.break2Start && entry.break2End) {
    const break2Duration = calculateMinutes(entry.break2Start, entry.break2End)
    actualBreakMinutes += break2Duration
    breakCount++

    // Check if break 2 is excessive
    const expectedDuration = break2Duration > 20 ? rules.mealBreakMinutes : rules.requiredBreakMinutes
    const allowedMax = expectedDuration + rules.allowedBreakVariance

    if (break2Duration > allowedMax) {
      violations.push({
        id: `${entry.id}-break2-excessive`,
        employeeId: entry.employeeId,
        date: entry.date,
        violationType: "excessive_duration",
        description: `Break 2 exceeded allowed duration by ${break2Duration - allowedMax} minutes`,
        breakDuration: break2Duration,
        expectedDuration,
        shiftHours,
        revenueImpact: 0,
      })
    }
  }

  // Check if employee took unauthorized additional breaks
  const totalRequiredBreaks = restBreaks + mealBreaks
  if (breakCount > totalRequiredBreaks) {
    violations.push({
      id: `${entry.id}-unauthorized-breaks`,
      employeeId: entry.employeeId,
      date: entry.date,
      violationType: "unauthorized_break",
      description: `Took ${breakCount} breaks when only ${totalRequiredBreaks} authorized for ${shiftHours.toFixed(1)} hour shift`,
      breakDuration: actualBreakMinutes,
      expectedDuration: totalRequiredBreakMinutes,
      shiftHours,
      revenueImpact: 0,
    })
  }

  // Check if employee is not taking sufficient rest (missing required breaks)
  if (shiftHours >= rules.minShiftForBreak && breakCount < restBreaks) {
    violations.push({
      id: `${entry.id}-insufficient-rest`,
      employeeId: entry.employeeId,
      date: entry.date,
      violationType: "insufficient_rest",
      description: `Only took ${breakCount} breaks when ${restBreaks} rest breaks required for ${shiftHours.toFixed(1)} hour shift`,
      breakDuration: actualBreakMinutes,
      expectedDuration: totalRequiredBreakMinutes,
      shiftHours,
      revenueImpact: 0,
    })
  }

  return violations
}

export function analyzeMultipleEntries(entries: BreakEntry[], employees: Employee[]): BreakViolation[] {
  const allViolations: BreakViolation[] = []

  for (const entry of entries) {
    const employee = employees.find((e) => e.id === entry.employeeId)
    if (employee) {
      const violations = analyzeBreakCompliance(entry, employee)
      allViolations.push(...violations)
    }
  }

  return allViolations
}

export function getViolationsByEmployee(violations: BreakViolation[]): Map<string, BreakViolation[]> {
  const byEmployee = new Map<string, BreakViolation[]>()

  for (const violation of violations) {
    const existing = byEmployee.get(violation.employeeId) || []
    existing.push(violation)
    byEmployee.set(violation.employeeId, existing)
  }

  return byEmployee
}

export function getViolationsByDate(violations: BreakViolation[], date: string): BreakViolation[] {
  return violations.filter((v) => v.date === date)
}

export function getViolationsByType(violations: BreakViolation[], type: string): BreakViolation[] {
  return violations.filter((v) => v.violationType === type)
}

export function getViolationStats(violations: BreakViolation[]) {
  return {
    total: violations.length,
    excessive: violations.filter((v) => v.violationType === "excessive_duration").length,
    unauthorized: violations.filter((v) => v.violationType === "unauthorized_break").length,
    insufficientRest: violations.filter((v) => v.violationType === "insufficient_rest").length,
  }
}
