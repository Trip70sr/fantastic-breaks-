"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Play } from "lucide-react"
import type { Employee, BreakEntry, ShiftScheduleEntry } from "@/lib/types"
import ShiftScheduleModal from "./shift-schedule-modal"
import { getRequiredBreaks } from "@/lib/colorado-compliance"
import { hasApprovedWaiver } from "@/lib/break-waiver-storage"

interface AssignedBreakTimesheetProps {
  employees: Employee[]
  assignedIds: string[]
  breakEntries: BreakEntry[]
  shiftSchedules: ShiftScheduleEntry[]
  date: string
  onStartBreak: (employeeId: string, breakType: "break1" | "break2") => void
  onSaveShiftSchedule: (schedule: ShiftScheduleEntry) => void
}

function getBreakStatus(
  entry: BreakEntry | undefined,
  schedule: ShiftScheduleEntry | undefined,
): {
  breaksTaken: number
  requiredBreaks: number
  status: "complete" | "partial" | "none"
  shiftHours: number
} {
  // Check if we have a shift schedule (self-reported)
  if (schedule) {
    const shiftHours = schedule.netWorkMinutes / 60
    const { restBreaks } = getRequiredBreaks(shiftHours)

    // Count breaks from entry if it exists
    let breaksTaken = 0
    if (entry) {
      if (entry.break1Start && entry.break1End) breaksTaken++
      if (entry.break2Start && entry.break2End) breaksTaken++
    }

    const status = breaksTaken === 0 ? "none" : breaksTaken >= restBreaks ? "complete" : "partial"

    return { breaksTaken, requiredBreaks: restBreaks, status, shiftHours }
  }

  // Fallback to entry data
  if (!entry) return { breaksTaken: 0, requiredBreaks: 0, status: "none", shiftHours: 0 }

  const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)
  const { restBreaks } = getRequiredBreaks(shiftHours)

  let breaksTaken = 0
  if (entry.break1Start && entry.break1End) breaksTaken++
  if (entry.break2Start && entry.break2End) breaksTaken++

  const status = breaksTaken === 0 ? "none" : breaksTaken >= restBreaks ? "complete" : "partial"

  return { breaksTaken, requiredBreaks: restBreaks, status, shiftHours }
}

function calculateShiftHours(start: string, end: string): number {
  const [startHour, startMin] = start.split(":").map(Number)
  const [endHour, endMin] = end.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  return (endMinutes - startMinutes) / 60
}

function isBreakOverdue(entry: BreakEntry | undefined, schedule: ShiftScheduleEntry | undefined): boolean {
  // Check if we have a shift schedule
  if (schedule) {
    const shiftHours = schedule.netWorkMinutes / 60

    // If worked 4+ hours, require at least 1 break
    if (shiftHours >= 4) {
      // Count breaks taken from entry
      let breaksTaken = 0
      if (entry) {
        if (entry.break1Start && entry.break1End) breaksTaken++
        if (entry.break2Start && entry.break2End) breaksTaken++
      }

      // No breaks taken after 4 hours = overdue
      if (breaksTaken === 0) return true

      // If worked 6.5+ hours, should have 2 breaks
      if (shiftHours >= 6.5 && breaksTaken < 2) return true
    }

    return false
  }

  // Check from entry data
  if (!entry) return false

  const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)

  // Count breaks taken
  let breaksTaken = 0
  if (entry.break1Start && entry.break1End) breaksTaken++
  if (entry.break2Start && entry.break2End) breaksTaken++

  // Check compliance
  if (shiftHours >= 4 && breaksTaken === 0) return true
  if (shiftHours >= 6.5 && breaksTaken < 2) return true

  return false
}

export default function AssignedBreakTimesheet({
  employees,
  assignedIds,
  breakEntries,
  shiftSchedules,
  date,
  onStartBreak,
  onSaveShiftSchedule,
}: AssignedBreakTimesheetProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null)

  const assignedEmployees = useMemo(() => {
    return employees.filter((e) => assignedIds.includes(e.id)).sort((a, b) => a.name.localeCompare(b.name))
  }, [employees, assignedIds])

  const dateString = new Date(date).toISOString().split("T")[0]

  if (assignedEmployees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No employees assigned for breaks</p>
            <p className="text-sm mt-1">Use the "Assign Employees for Breaks" button to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assigned Break Timesheet</span>
            <Badge variant="secondary">{assignedEmployees.length} employees</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assignedEmployees.map((emp) => {
              const entry = breakEntries.find(
                (e) => e.employeeId === emp.id && new Date(e.date).toISOString().split("T")[0] === dateString,
              )

              const schedule = shiftSchedules.find((s) => s.employeeId === emp.id && s.date === dateString)

              const hasWaiver = hasApprovedWaiver(emp.id, dateString)

              const { breaksTaken, requiredBreaks, status, shiftHours } = getBreakStatus(entry, schedule)

              const breakOverdue = !hasWaiver && isBreakOverdue(entry, schedule)

              const statusConfig = {
                complete: { color: "bg-green-50 border-green-200", icon: CheckCircle, iconColor: "text-green-600" },
                partial: { color: "bg-yellow-50 border-yellow-200", icon: AlertTriangle, iconColor: "text-yellow-600" },
                none: { color: "bg-gray-50 border-gray-200", icon: Clock, iconColor: "text-gray-400" },
              }[status]

              const StatusIcon = statusConfig.icon

              const hasShift = entry || schedule
              const shiftDisplay = entry
                ? `${entry.shiftStart} - ${entry.shiftEnd}`
                : schedule
                  ? `${schedule.startTime} - ${schedule.endTime}${schedule.therapyMinutes > 0 ? ` (${schedule.therapyMinutes}m therapy)` : ""}`
                  : null

              return (
                <div
                  key={emp.id}
                  className={`flex justify-between items-center p-4 border-2 rounded-lg ${statusConfig.color} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                    <div>
                      <div className={`font-semibold ${breakOverdue ? "text-red-600" : ""}`}>
                        {emp.name}
                        {hasWaiver && (
                          <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 text-xs">
                            Breaks Waived
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{emp.department}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {hasWaiver ? (
                        <div className="text-sm font-medium text-purple-600">All breaks waived</div>
                      ) : (
                        <div className="text-sm font-medium">
                          {breaksTaken}/{requiredBreaks} breaks
                        </div>
                      )}
                      {shiftDisplay && <div className="text-xs text-muted-foreground">{shiftDisplay}</div>}
                      {schedule && (
                        <div className="text-xs text-blue-600 font-medium">
                          {(schedule.netWorkMinutes / 60).toFixed(1)}h net
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!hasWaiver && hasShift && breaksTaken < requiredBreaks && (
                        <Button
                          size="sm"
                          onClick={() => onStartBreak(emp.id, breaksTaken === 0 ? "break1" : "break2")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Break {breaksTaken + 1}
                        </Button>
                      )}
                      {!hasShift && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEmployee({ id: emp.id, name: emp.name })}
                          className="text-xs hover:bg-slate-100"
                        >
                          No shift scheduled
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <ShiftScheduleModal
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          date={dateString}
          onSave={(schedule) => {
            onSaveShiftSchedule(schedule)
            setSelectedEmployee(null)
          }}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  )
}
