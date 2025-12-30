"use client"

import type { BreakAssignment } from "./types"
import { logAuditAction } from "./audit-trail"

const ASSIGNMENTS_KEY = "breakAssignments"

export function loadAssignments(): BreakAssignment[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(ASSIGNMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAssignments(assignments: BreakAssignment[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments))
}

export function getAssignmentForDate(date: string): BreakAssignment | null {
  const assignments = loadAssignments()
  return assignments.find((a) => a.date === date) || null
}

export function setAssignmentForDate(date: string, employeeIds: string[], assignedBy: string): void {
  const assignments = loadAssignments()
  const existingIndex = assignments.findIndex((a) => a.date === date)

  const newAssignment: BreakAssignment = {
    date,
    employeeIds,
    assignedBy,
    assignedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    assignments[existingIndex] = newAssignment
  } else {
    assignments.push(newAssignment)
  }

  saveAssignments(assignments)

  logAuditAction({
    action: "assign_breaks",
    actor: assignedBy,
    target: "break_assignment",
    targetId: date,
    details: {
      date,
      employeeCount: employeeIds.length,
      employeeIds,
    },
  })
}

export function clearAssignmentForDate(date: string, clearedBy: string): void {
  const assignments = loadAssignments()
  const filtered = assignments.filter((a) => a.date !== date)
  saveAssignments(filtered)

  logAuditAction({
    action: "clear_break_assignment",
    actor: clearedBy,
    target: "break_assignment",
    targetId: date,
    details: { date },
  })
}
