"use client"

import type { BreakWaiver } from "./types"
import { logAuditAction } from "./audit-trail"

const BREAK_WAIVER_KEY = "break_waivers"

export function getAllWaivers(): BreakWaiver[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(BREAK_WAIVER_KEY)
  return data ? JSON.parse(data) : []
}

export function getWaiversForDate(date: string): BreakWaiver[] {
  return getAllWaivers().filter((w) => w.date === date)
}

export function getApprovedWaiversForDate(date: string): BreakWaiver[] {
  return getAllWaivers().filter((w) => w.date === date && w.status === "approved")
}

export function hasApprovedWaiver(employeeId: string, date: string): boolean {
  return getAllWaivers().some((w) => w.employeeId === employeeId && w.date === date && w.status === "approved")
}

export function createWaiverRequest(
  employeeId: string,
  employeeName: string,
  employeeEmail: string,
  date: string,
  reason: string,
): BreakWaiver {
  const waiver: BreakWaiver = {
    id: `waiver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    employeeName,
    employeeEmail,
    date,
    requestedAt: new Date().toISOString(),
    requestEmailSent: true,
    status: "pending",
    reason,
  }

  const waivers = getAllWaivers()
  waivers.push(waiver)
  localStorage.setItem(BREAK_WAIVER_KEY, JSON.stringify(waivers))

  logAuditAction("break_waiver", waiver.id, "waiver_requested", employeeName, {
    employeeId,
    date,
    reason,
  })

  return waiver
}

export function approveWaiver(waiverId: string, directorUsername: string): boolean {
  const waivers = getAllWaivers()
  const waiver = waivers.find((w) => w.id === waiverId)

  if (!waiver || waiver.status !== "pending") return false

  waiver.status = "approved"
  waiver.approvedBy = directorUsername
  waiver.approvedAt = new Date().toISOString()

  localStorage.setItem(BREAK_WAIVER_KEY, JSON.stringify(waivers))

  logAuditAction("break_waiver", waiverId, "waiver_approved", directorUsername, {
    employeeId: waiver.employeeId,
    employeeName: waiver.employeeName,
    date: waiver.date,
  })

  return true
}

export function denyWaiver(waiverId: string, directorUsername: string): boolean {
  const waivers = getAllWaivers()
  const waiver = waivers.find((w) => w.id === waiverId)

  if (!waiver || waiver.status !== "pending") return false

  waiver.status = "denied"
  waiver.approvedBy = directorUsername
  waiver.approvedAt = new Date().toISOString()

  localStorage.setItem(BREAK_WAIVER_KEY, JSON.stringify(waivers))

  logAuditAction("break_waiver", waiverId, "waiver_denied", directorUsername, {
    employeeId: waiver.employeeId,
    employeeName: waiver.employeeName,
    date: waiver.date,
  })

  return true
}
