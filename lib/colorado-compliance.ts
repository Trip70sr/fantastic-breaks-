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

export interface AbuseThresholds {
  highRiskOverageCount: number // Number of overages to flag as high risk
  highRiskLostHours: number // Total lost hours to flag as high risk
  criticalOverageCount: number // Number of overages for critical flag
  criticalLostHours: number // Total lost hours for critical flag
}

export const DEFAULT_ABUSE_THRESHOLDS: AbuseThresholds = {
  highRiskOverageCount: 3,
  highRiskLostHours: 1.5,
  criticalOverageCount: 5,
  criticalLostHours: 3.0,
}

export function categorizeViolation(violationType: string): "compliance" | "financial" {
  switch (violationType) {
    case "overage":
    case "excessive_duration":
    case "unauthorized_break":
      return "financial" // These cause direct revenue loss
    case "shortage":
    case "missed":
    case "late":
    case "insufficient_rest":
      return "compliance" // These are compliance risks but no direct loss
    default:
      return "compliance"
  }
}

export interface EmployeeRiskProfile {
  employeeId: string
  employeeName: string
  totalOverages: number
  totalLostHours: number
  riskLevel: "low" | "medium" | "high" | "critical"
  complianceViolations: number
  financialViolations: number
}

export function assessEmployeeRisk(
  violations: BreakViolation[],
  employeeId: string,
  employeeName: string,
  thresholds: AbuseThresholds = DEFAULT_ABUSE_THRESHOLDS,
): EmployeeRiskProfile {
  const employeeViolations = violations.filter((v) => v.employeeId === employeeId)

  let totalOverages = 0
  let totalLostHours = 0
  let complianceViolations = 0
  let financialViolations = 0

  employeeViolations.forEach((v) => {
    const category = categorizeViolation(v.violationType)

    if (category === "financial") {
      financialViolations++
      const excessMinutes = Math.max(0, v.breakDuration - v.expectedDuration)
      totalLostHours += excessMinutes / 60

      if (v.violationType === "overage" || v.violationType === "excessive_duration") {
        totalOverages++
      }
    } else {
      complianceViolations++
    }
  })

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical" = "low"

  if (totalOverages >= thresholds.criticalOverageCount || totalLostHours >= thresholds.criticalLostHours) {
    riskLevel = "critical"
  } else if (totalOverages >= thresholds.highRiskOverageCount || totalLostHours >= thresholds.highRiskLostHours) {
    riskLevel = "high"
  } else if (totalOverages > 0 || complianceViolations > 2) {
    riskLevel = "medium"
  }

  return {
    employeeId,
    employeeName,
    totalOverages,
    totalLostHours: Number(totalLostHours.toFixed(2)),
    riskLevel,
    complianceViolations,
    financialViolations,
  }
}

export function getAtRiskEmployees(
  violations: BreakViolation[],
  employees: Employee[],
  thresholds: AbuseThresholds = DEFAULT_ABUSE_THRESHOLDS,
): EmployeeRiskProfile[] {
  const profiles = employees.map((emp) => assessEmployeeRisk(violations, emp.id, emp.name, thresholds))

  return profiles
    .filter((p) => p.riskLevel === "high" || p.riskLevel === "critical")
    .sort((a, b) => {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
    })
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
        id: `${entry.id}-break1-overage`,
        employeeId: entry.employeeId,
        employeeName: employee.name,
        date: entry.date,
        violationType: "overage",
        breakDuration: break1Duration,
        expectedDuration,
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
        id: `${entry.id}-break2-overage`,
        employeeId: entry.employeeId,
        employeeName: employee.name,
        date: entry.date,
        violationType: "overage",
        breakDuration: break2Duration,
        expectedDuration,
      })
    }
  }

  // Check if employee took unauthorized additional breaks
  const totalRequiredBreaks = restBreaks + mealBreaks
  if (breakCount > totalRequiredBreaks) {
    violations.push({
      id: `${entry.id}-unauthorized`,
      employeeId: entry.employeeId,
      employeeName: employee.name,
      date: entry.date,
      violationType: "missed",
      breakDuration: actualBreakMinutes,
      expectedDuration: totalRequiredBreakMinutes,
    })
  }

  // Check if employee is not taking sufficient rest (missing required breaks)
  if (shiftHours >= rules.minShiftForBreak && breakCount < restBreaks) {
    violations.push({
      id: `${entry.id}-insufficient`,
      employeeId: entry.employeeId,
      employeeName: employee.name,
      date: entry.date,
      violationType: "insufficient_rest",
      breakDuration: actualBreakMinutes,
      expectedDuration: totalRequiredBreakMinutes,
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
  let complianceCount = 0
  let financialCount = 0

  violations.forEach((v) => {
    if (categorizeViolation(v.violationType) === "financial") {
      financialCount++
    } else {
      complianceCount++
    }
  })

  return {
    total: violations.length,
    financial: financialCount,
    compliance: complianceCount,
    overage: violations.filter((v) => v.violationType === "overage").length,
    missed: violations.filter((v) => v.violationType === "missed").length,
    insufficientRest: violations.filter((v) => v.violationType === "insufficient_rest").length,
  }
}
