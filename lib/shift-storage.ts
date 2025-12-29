"use client"

import type { ShiftScheduleEntry } from "./types"
import { logAuditAction } from "./audit-trail"

const STORAGE_KEY = "shift_schedules"

export function saveShiftSchedule(schedule: ShiftScheduleEntry): void {
  const schedules = getShiftSchedules()

  // Replace existing schedule for same employee/date or add new
  const index = schedules.findIndex((s) => s.employeeId === schedule.employeeId && s.date === schedule.date)

  if (index >= 0) {
    schedules[index] = schedule
  } else {
    schedules.push(schedule)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules))

  // Log audit trail
  logAuditAction({
    entity: "shift",
    entityId: schedule.employeeId,
    action: "created",
    actor: schedule.selfReported ? "employee" : "manager",
    reason: "Self-reported schedule via shift entry",
    metadata: {
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      therapyMinutes: schedule.therapyMinutes,
      netWorkMinutes: schedule.netWorkMinutes,
    },
  })
}

export function getShiftSchedules(): ShiftScheduleEntry[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getShiftScheduleForEmployee(employeeId: string, date: string): ShiftScheduleEntry | undefined {
  const schedules = getShiftSchedules()
  return schedules.find((s) => s.employeeId === employeeId && s.date === date)
}

export function deleteShiftSchedule(employeeId: string, date: string): void {
  const schedules = getShiftSchedules()
  const filtered = schedules.filter((s) => !(s.employeeId === employeeId && s.date === date))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

  logAuditAction({
    entity: "shift",
    entityId: employeeId,
    action: "deleted",
    actor: "manager",
    reason: "Shift schedule removed",
    metadata: { date },
  })
}
