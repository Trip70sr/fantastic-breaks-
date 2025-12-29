"use client"

import type { BreakViolation, Employee } from "./types"

export interface RevenueImpact {
  violationId: string
  employeeId: string
  employeeName: string
  date: string
  excessMinutes: number
  lostHours: number // Added lostHours field for clarity
  hourlyRate: number
  lostRevenue: number
  violationType: string
}

export interface RevenueAnalytics {
  dailyLoss: number
  weeklyLoss: number
  monthlyLoss: number
  yearlyLoss: number
  totalViolations: number
  affectedEmployees: number
  averageLossPerViolation: number
  impactByEmployee: Map<string, number>
  impactByType: Map<string, number>
}

const getExcessMinutes = (v: BreakViolation): number => {
  if (v.violationType === "overage" || v.violationType === "missed") {
    return Math.max(0, v.breakDuration - v.expectedDuration)
  }
  return 0 // shortages do not cause revenue loss
}

export function calculateViolationRevenue(violation: BreakViolation, hourlyRate: number): number {
  // Calculate excess minutes beyond allowed
  let excessMinutes = 0

  switch (violation.violationType) {
    case "excessive_duration":
      excessMinutes = violation.breakDuration - violation.expectedDuration
      break
    case "unauthorized_break":
      // Full duration of unauthorized breaks counts as lost time
      excessMinutes = violation.breakDuration - violation.expectedDuration
      break
    case "insufficient_rest":
      // No direct revenue loss for insufficient rest (employee working more)
      excessMinutes = 0
      break
  }

  // Convert minutes to hours and multiply by rate
  const lostHours = excessMinutes / 60
  return Number((lostHours * hourlyRate).toFixed(2))
}

export function calculateRevenueImpacts(violations: BreakViolation[], employees: Employee[]): RevenueImpact[] {
  const employeeMap = new Map(employees.map((e) => [e.id, e]))

  return violations.map((v) => {
    const employee = employeeMap.get(v.employeeId)
    const hourlyRate = employee?.hourlyRate ?? 0
    const excessMinutes = getExcessMinutes(v)
    const lostHours = excessMinutes / 60
    const lostRevenue = Number((lostHours * hourlyRate).toFixed(2))

    return {
      violationId: v.id,
      employeeId: v.employeeId,
      employeeName: v.employeeName,
      date: v.date,
      excessMinutes,
      lostHours,
      hourlyRate,
      lostRevenue,
      violationType: v.violationType,
    }
  })
}

export function aggregateRevenueAnalytics(
  impacts: RevenueImpact[],
  dateRange?: { start: Date; end: Date },
): RevenueAnalytics {
  let filteredImpacts = impacts

  // Filter by date range if provided
  if (dateRange) {
    filteredImpacts = impacts.filter((impact) => {
      const date = new Date(impact.date)
      return date >= dateRange.start && date <= dateRange.end
    })
  }

  // Calculate total loss
  const totalLoss = filteredImpacts.reduce((sum, impact) => sum + impact.lostRevenue, 0)

  // Get unique employees
  const uniqueEmployees = new Set(filteredImpacts.map((i) => i.employeeId)).size

  // Calculate daily loss (based on filtered data)
  const dates = [...new Set(filteredImpacts.map((i) => i.date))]
  const dailyLoss = dates.length > 0 ? totalLoss / dates.length : 0

  // Calculate impact by employee
  const impactByEmployee = new Map<string, number>()
  filteredImpacts.forEach((impact) => {
    const current = impactByEmployee.get(impact.employeeName) || 0
    impactByEmployee.set(impact.employeeName, current + impact.lostRevenue)
  })

  // Calculate impact by type
  const impactByType = new Map<string, number>()
  filteredImpacts.forEach((impact) => {
    const current = impactByType.get(impact.violationType) || 0
    impactByType.set(impact.violationType, current + impact.lostRevenue)
  })

  return {
    dailyLoss: Number(dailyLoss.toFixed(2)),
    weeklyLoss: Number((dailyLoss * 5).toFixed(2)), // 5 work days
    monthlyLoss: Number((dailyLoss * 22).toFixed(2)), // ~22 work days
    yearlyLoss: Number((dailyLoss * 260).toFixed(2)), // ~260 work days
    totalViolations: filteredImpacts.length,
    affectedEmployees: uniqueEmployees,
    averageLossPerViolation: filteredImpacts.length > 0 ? Number((totalLoss / filteredImpacts.length).toFixed(2)) : 0,
    impactByEmployee,
    impactByType,
  }
}

export function getTopViolators(
  impacts: RevenueImpact[],
  limit = 10,
): Array<{ employee: string; loss: number; count: number }> {
  const byEmployee = new Map<string, { loss: number; count: number }>()

  impacts.forEach((impact) => {
    const current = byEmployee.get(impact.employeeName) || { loss: 0, count: 0 }
    byEmployee.set(impact.employeeName, {
      loss: current.loss + impact.lostRevenue,
      count: current.count + 1,
    })
  })

  return Array.from(byEmployee.entries())
    .map(([employee, data]) => ({ employee, ...data }))
    .sort((a, b) => b.loss - a.loss)
    .slice(0, limit)
}

export function getRevenueByDateRange(impacts: RevenueImpact[], startDate: string, endDate: string): RevenueImpact[] {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return impacts.filter((impact) => {
    const date = new Date(impact.date)
    return date >= start && date <= end
  })
}

export function getDailyRevenueBreakdown(impacts: RevenueImpact[]): Map<string, number> {
  const byDate = new Map<string, number>()

  impacts.forEach((impact) => {
    const current = byDate.get(impact.date) || 0
    byDate.set(impact.date, current + impact.lostRevenue)
  })

  return byDate
}

export function exportRevenueReport(impacts: RevenueImpact[], analytics: RevenueAnalytics): string {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalViolations: analytics.totalViolations,
      affectedEmployees: analytics.affectedEmployees,
      dailyLoss: analytics.dailyLoss,
      weeklyLoss: analytics.weeklyLoss,
      monthlyLoss: analytics.monthlyLoss,
      yearlyLoss: analytics.yearlyLoss,
      averageLossPerViolation: analytics.averageLossPerViolation,
    },
    impactByEmployee: Object.fromEntries(analytics.impactByEmployee),
    impactByType: Object.fromEntries(analytics.impactByType),
    details: impacts,
  }

  return JSON.stringify(report, null, 2)
}
