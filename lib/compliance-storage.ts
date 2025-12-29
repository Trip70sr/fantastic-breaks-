"use client"

import type { BreakViolation, ComplianceSettings } from "./types"

const VIOLATIONS_KEY = "break_violations"
const COMPLIANCE_SETTINGS_KEY = "compliance_settings"

export const DEFAULT_COMPLIANCE_SETTINGS: ComplianceSettings = {
  hourlyRate: 25.0,
  violationThresholds: {
    excessiveBreakMinutes: 10,
    dailyViolationCount: 3,
    monthlyViolationCount: 10,
  },
  notificationEmails: [],
  notificationsEnabled: false,
}

export function loadViolations(): BreakViolation[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(VIOLATIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveViolations(violations: BreakViolation[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(VIOLATIONS_KEY, JSON.stringify(violations))
}

export function addViolation(violation: BreakViolation): void {
  const violations = loadViolations()
  // Check if violation already exists
  const exists = violations.some((v) => v.id === violation.id)
  if (!exists) {
    violations.push(violation)
    saveViolations(violations)
  }
}

export function deleteViolation(id: string): void {
  const violations = loadViolations()
  saveViolations(violations.filter((v) => v.id !== id))
}

export function clearViolations(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(VIOLATIONS_KEY)
}

export function loadComplianceSettings(): ComplianceSettings {
  if (typeof window === "undefined") return DEFAULT_COMPLIANCE_SETTINGS
  const data = localStorage.getItem(COMPLIANCE_SETTINGS_KEY)
  return data ? JSON.parse(data) : DEFAULT_COMPLIANCE_SETTINGS
}

export function saveComplianceSettings(settings: ComplianceSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPLIANCE_SETTINGS_KEY, JSON.stringify(settings))
}

export function updateComplianceSettings(updates: Partial<ComplianceSettings>): void {
  const current = loadComplianceSettings()
  const updated = { ...current, ...updates }
  saveComplianceSettings(updated)
}
