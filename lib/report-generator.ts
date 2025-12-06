"use client"

import type { BreakViolation, Employee, BreakEntry } from "./types"
import { calculateRevenueImpacts } from "./revenue-analytics"
import { getViolationStats } from "./colorado-compliance"
import { loadComplianceSettings } from "./compliance-storage"

export interface DailyReport {
  date: string
  totalViolations: number
  totalRevenueLoss: number
  violationsByType: {
    excessive: number
    unauthorized: number
    insufficientRest: number
  }
  affectedEmployees: string[]
  topViolator: {
    name: string
    violations: number
    loss: number
  } | null
  complianceRate: number
}

export interface MonthlyReport {
  month: string
  year: number
  totalViolations: number
  totalRevenueLoss: number
  averageDailyLoss: number
  workingDays: number
  violationsByType: {
    excessive: number
    unauthorized: number
    insufficientRest: number
  }
  affectedEmployees: string[]
  topViolators: Array<{
    name: string
    violations: number
    loss: number
  }>
  complianceRate: number
  trendData: Array<{
    week: number
    violations: number
    loss: number
  }>
}

export function generateDailyReport(
  date: string,
  violations: BreakViolation[],
  employees: Employee[],
  allBreakEntries: BreakEntry[],
): DailyReport {
  const settings = loadComplianceSettings()

  // Filter violations for the specific date
  const dailyViolations = violations.filter((v) => v.date === date)

  // Calculate revenue impacts
  const impacts = calculateRevenueImpacts(dailyViolations, employees, settings.hourlyRate)
  const totalRevenueLoss = impacts.reduce((sum, impact) => sum + impact.lostRevenue, 0)

  // Get violation stats
  const stats = getViolationStats(dailyViolations)

  // Get affected employees
  const affectedEmployeeIds = new Set(dailyViolations.map((v) => v.employeeId))
  const affectedEmployees = employees.filter((e) => affectedEmployeeIds.has(e.id)).map((e) => e.name)

  // Find top violator for the day
  const violationsByEmployee = new Map<string, { count: number; loss: number }>()
  impacts.forEach((impact) => {
    const current = violationsByEmployee.get(impact.employeeName) || { count: 0, loss: 0 }
    violationsByEmployee.set(impact.employeeName, {
      count: current.count + 1,
      loss: current.loss + impact.lostRevenue,
    })
  })

  const topViolatorEntry = Array.from(violationsByEmployee.entries()).sort((a, b) => b[1].loss - a[1].loss)[0]

  const topViolator = topViolatorEntry
    ? {
        name: topViolatorEntry[0],
        violations: topViolatorEntry[1].count,
        loss: topViolatorEntry[1].loss,
      }
    : null

  // Calculate compliance rate
  const dailyEntries = allBreakEntries.filter((e) => e.date === date)
  const complianceRate =
    dailyEntries.length > 0 ? ((dailyEntries.length - affectedEmployeeIds.size) / dailyEntries.length) * 100 : 100

  return {
    date,
    totalViolations: dailyViolations.length,
    totalRevenueLoss: Number(totalRevenueLoss.toFixed(2)),
    violationsByType: {
      excessive: stats.excessive,
      unauthorized: stats.unauthorized,
      insufficientRest: stats.insufficientRest,
    },
    affectedEmployees,
    topViolator,
    complianceRate: Number(complianceRate.toFixed(1)),
  }
}

export function generateMonthlyReport(
  month: number,
  year: number,
  violations: BreakViolation[],
  employees: Employee[],
  allBreakEntries: BreakEntry[],
): MonthlyReport {
  const settings = loadComplianceSettings()

  // Filter violations for the specific month
  const monthlyViolations = violations.filter((v) => {
    const date = new Date(v.date)
    return date.getMonth() === month && date.getFullYear() === year
  })

  // Calculate revenue impacts
  const impacts = calculateRevenueImpacts(monthlyViolations, employees, settings.hourlyRate)
  const totalRevenueLoss = impacts.reduce((sum, impact) => sum + impact.lostRevenue, 0)

  // Get violation stats
  const stats = getViolationStats(monthlyViolations)

  // Get affected employees
  const affectedEmployeeIds = new Set(monthlyViolations.map((v) => v.employeeId))
  const affectedEmployees = employees.filter((e) => affectedEmployeeIds.has(e.id)).map((e) => e.name)

  // Get unique working days
  const uniqueDates = new Set(monthlyViolations.map((v) => v.date))
  const workingDays = uniqueDates.size

  // Calculate average daily loss
  const averageDailyLoss = workingDays > 0 ? totalRevenueLoss / workingDays : 0

  // Get top violators
  const violationsByEmployee = new Map<string, { count: number; loss: number }>()
  impacts.forEach((impact) => {
    const current = violationsByEmployee.get(impact.employeeName) || { count: 0, loss: 0 }
    violationsByEmployee.set(impact.employeeName, {
      count: current.count + 1,
      loss: current.loss + impact.lostRevenue,
    })
  })

  const topViolators = Array.from(violationsByEmployee.entries())
    .map(([name, data]) => ({
      name,
      violations: data.count,
      loss: data.loss,
    }))
    .sort((a, b) => b.loss - a.loss)
    .slice(0, 5)

  // Calculate compliance rate
  const monthlyEntries = allBreakEntries.filter((e) => {
    const date = new Date(e.date)
    return date.getMonth() === month && date.getFullYear() === year
  })
  const complianceRate =
    monthlyEntries.length > 0 ? ((monthlyEntries.length - affectedEmployeeIds.size) / monthlyEntries.length) * 100 : 100

  // Generate trend data by week
  const trendData: Array<{ week: number; violations: number; loss: number }> = []
  for (let week = 1; week <= 4; week++) {
    const weekViolations = monthlyViolations.filter((v) => {
      const date = new Date(v.date)
      const weekOfMonth = Math.ceil(date.getDate() / 7)
      return weekOfMonth === week
    })
    const weekImpacts = calculateRevenueImpacts(weekViolations, employees, settings.hourlyRate)
    const weekLoss = weekImpacts.reduce((sum, impact) => sum + impact.lostRevenue, 0)
    trendData.push({
      week,
      violations: weekViolations.length,
      loss: Number(weekLoss.toFixed(2)),
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return {
    month: monthNames[month],
    year,
    totalViolations: monthlyViolations.length,
    totalRevenueLoss: Number(totalRevenueLoss.toFixed(2)),
    averageDailyLoss: Number(averageDailyLoss.toFixed(2)),
    workingDays,
    violationsByType: {
      excessive: stats.excessive,
      unauthorized: stats.unauthorized,
      insufficientRest: stats.insufficientRest,
    },
    affectedEmployees,
    topViolators,
    complianceRate: Number(complianceRate.toFixed(1)),
    trendData,
  }
}

export function exportDailyReportCSV(report: DailyReport): string {
  const lines = [
    "Daily Compliance Report",
    `Date,${report.date}`,
    `Total Violations,${report.totalViolations}`,
    `Total Revenue Loss,$${report.totalRevenueLoss}`,
    `Compliance Rate,${report.complianceRate}%`,
    "",
    "Violations by Type",
    `Excessive Duration,${report.violationsByType.excessive}`,
    `Unauthorized Breaks,${report.violationsByType.unauthorized}`,
    `Insufficient Rest,${report.violationsByType.insufficientRest}`,
    "",
    "Affected Employees",
    ...report.affectedEmployees.map((name) => name),
  ]

  if (report.topViolator) {
    lines.push("", "Top Violator")
    lines.push(`${report.topViolator.name},${report.topViolator.violations} violations,$${report.topViolator.loss}`)
  }

  return lines.join("\n")
}

export function exportMonthlyReportCSV(report: MonthlyReport): string {
  const lines = [
    "Monthly Compliance Report",
    `Month,${report.month} ${report.year}`,
    `Total Violations,${report.totalViolations}`,
    `Total Revenue Loss,$${report.totalRevenueLoss}`,
    `Average Daily Loss,$${report.averageDailyLoss}`,
    `Working Days,${report.workingDays}`,
    `Compliance Rate,${report.complianceRate}%`,
    "",
    "Violations by Type",
    `Excessive Duration,${report.violationsByType.excessive}`,
    `Unauthorized Breaks,${report.violationsByType.unauthorized}`,
    `Insufficient Rest,${report.violationsByType.insufficientRest}`,
    "",
    "Top Violators",
    "Name,Violations,Revenue Loss",
    ...report.topViolators.map((v) => `${v.name},${v.violations},$${v.loss}`),
    "",
    "Weekly Trend",
    "Week,Violations,Revenue Loss",
    ...report.trendData.map((d) => `Week ${d.week},${d.violations},$${d.loss}`),
  ]

  return lines.join("\n")
}
