"use client"

import type { Employee, BreakEntry, BreakViolation } from "./types"

export interface AuditEntry {
  id: string
  timestamp: string
  action: "break_start" | "break_end" | "violation_detected" | "manual_edit" | "report_generated" | "settings_changed"
  actor: string // employee or admin username
  actorRole: "employee" | "manager" | "hr_admin" | "super_admin"
  details: {
    employeeId?: string
    employeeName?: string
    breakEntryId?: string
    violationId?: string
    changes?: Record<string, any>
    reason?: string
  }
  ipAddress?: string
  deviceInfo?: string
  relatedRecords: {
    breakEntries?: string[]
    violations?: string[]
    employees?: string[]
  }
}

export interface WageClaimDefense {
  auditId: string
  timestamp: string
  employeeName: string
  violationType: string
  evidence: {
    originalBreakEntry: BreakEntry
    detectedViolation: BreakViolation
    coloradoLawReference: string
    calculationMethod: string
    revenueImpact: number
  }
  witnessedBy: string[]
  approvedBy?: string
  legalNotes?: string
}

const AUDIT_TRAIL_KEY = "audit_trail"
const WAGE_DEFENSE_KEY = "wage_claim_defense"

export function createAuditEntry(
  action: AuditEntry["action"],
  actor: string,
  actorRole: AuditEntry["actorRole"],
  details: AuditEntry["details"],
  relatedRecords: AuditEntry["relatedRecords"] = {},
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    actor,
    actorRole,
    details,
    ipAddress: typeof window !== "undefined" ? "client" : "server",
    deviceInfo: typeof window !== "undefined" ? navigator.userAgent : "server",
    relatedRecords,
  }

  if (typeof window !== "undefined") {
    const existingTrail = localStorage.getItem(AUDIT_TRAIL_KEY)
    const trail: AuditEntry[] = existingTrail ? JSON.parse(existingTrail) : []
    trail.push(entry)
    localStorage.setItem(AUDIT_TRAIL_KEY, JSON.stringify(trail))
  }

  return entry
}

export function createWageClaimDefense(
  breakEntry: BreakEntry,
  violation: BreakViolation,
  employee: Employee,
  revenueImpact: number,
  approver: string,
): WageClaimDefense {
  const defense: WageClaimDefense = {
    auditId: `wcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    employeeName: employee.name,
    violationType: violation.violationType,
    evidence: {
      originalBreakEntry: breakEntry,
      detectedViolation: violation,
      coloradoLawReference: getColoradoLawReference(violation.violationType),
      calculationMethod: "Colorado Wage Order #38 - Meal & Rest Break Rules",
      revenueImpact,
    },
    witnessedBy: [approver],
    approvedBy: approver,
    legalNotes: `Violation automatically detected by system. Revenue impact calculated based on hourly rate of $${employee.hourlyRate}/hr.`,
  }

  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(WAGE_DEFENSE_KEY)
    const records: WageClaimDefense[] = existing ? JSON.parse(existing) : []
    records.push(defense)
    localStorage.setItem(WAGE_DEFENSE_KEY, JSON.stringify(records))
  }

  return defense
}

function getColoradoLawReference(violationType: string): string {
  const references: Record<string, string> = {
    overage: "7 CCR 1103-1 Rule 5.2 - 30-minute meal breaks required for 5+ hour shifts",
    shortage: "7 CCR 1103-1 Rule 5.2 - Meal breaks must be uninterrupted",
    missed: "7 CCR 1103-1 Rule 5.2 - Employer must provide opportunity for breaks",
    late: "7 CCR 1103-1 Rule 5.2 - Meal breaks should occur after 5 hours",
    insufficient_rest: "7 CCR 1103-1 Rule 5.1 - 10-minute rest breaks required per 4 hours",
  }
  return references[violationType] || "Colorado Wage Order #38"
}

export function getAuditTrail(filters?: {
  startDate?: string
  endDate?: string
  actor?: string
  action?: AuditEntry["action"]
  employeeId?: string
}): AuditEntry[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(AUDIT_TRAIL_KEY)
  if (!data) return []

  let trail: AuditEntry[] = JSON.parse(data)

  if (filters) {
    if (filters.startDate) {
      trail = trail.filter((e) => e.timestamp >= filters.startDate!)
    }
    if (filters.endDate) {
      trail = trail.filter((e) => e.timestamp <= filters.endDate!)
    }
    if (filters.actor) {
      trail = trail.filter((e) => e.actor === filters.actor)
    }
    if (filters.action) {
      trail = trail.filter((e) => e.action === filters.action)
    }
    if (filters.employeeId) {
      trail = trail.filter((e) => e.details.employeeId === filters.employeeId)
    }
  }

  return trail.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function getWageClaimDefenseRecords(employeeName?: string): WageClaimDefense[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(WAGE_DEFENSE_KEY)
  if (!data) return []

  let records: WageClaimDefense[] = JSON.parse(data)

  if (employeeName) {
    records = records.filter((r) => r.employeeName === employeeName)
  }

  return records.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function exportAuditTrail(startDate?: string, endDate?: string): string {
  const trail = getAuditTrail({ startDate, endDate })
  return JSON.stringify(trail, null, 2)
}

export function exportWageDefenseReport(): string {
  const records = getWageClaimDefenseRecords()
  return JSON.stringify(records, null, 2)
}
