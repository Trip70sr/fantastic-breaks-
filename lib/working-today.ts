"use client"

import type { Employee } from "./types"

/**
 * Derives the list of working employees from break assignments.
 * This is the single source of truth for who is working today.
 *
 * @param employees - All employees
 * @param assignedIds - Employee IDs assigned for breaks today
 * @returns Filtered list of working employees
 */
export function getWorkingToday(employees: Employee[], assignedIds: string[]): Employee[] {
  return employees.filter((e) => assignedIds.includes(e.id))
}
