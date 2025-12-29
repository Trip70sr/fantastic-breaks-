"use client"

import type { ShiftVerification } from "./types"
import { logAuditAction } from "./audit-trail"

const STORAGE_KEY = "shift-verifications"

export function saveShiftVerification(verification: ShiftVerification): void {
  const verifications = loadShiftVerifications()
  verifications.push(verification)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verifications))

  logAuditAction({
    entity: "shift",
    entityId: verification.employeeId,
    action: verification.status === "corrected" ? "updated" : "verified",
    performedBy: "coverage_employee",
    performedById: verification.verifiedBy,
    reason:
      verification.status === "corrected"
        ? `Schedule corrected: ${verification.originalStart}-${verification.originalEnd} → ${verification.correctedStart}-${verification.correctedEnd}${verification.reason ? `. Reason: ${verification.reason}` : ""}`
        : "Schedule verbally verified as accurate",
    before:
      verification.status === "corrected"
        ? { start: verification.originalStart, end: verification.originalEnd }
        : undefined,
    after: {
      start: verification.status === "corrected" ? verification.correctedStart : verification.originalStart,
      end: verification.status === "corrected" ? verification.correctedEnd : verification.originalEnd,
    },
    relatedData: {
      date: verification.date,
      status: verification.status,
    },
  })
}

export function loadShiftVerifications(): ShiftVerification[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getVerificationForEmployee(employeeId: string, date: string): ShiftVerification | undefined {
  const verifications = loadShiftVerifications()
  return verifications.find((v) => v.employeeId === employeeId && v.date === date)
}
