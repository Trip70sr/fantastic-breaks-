"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Play } from "lucide-react"
import type { Employee, BreakEntry } from "@/lib/types"

interface AssignedBreakTimesheetProps {
  employees: Employee[]
  assignedIds: string[]
  breakEntries: BreakEntry[]
  date: string
  onStartBreak: (employeeId: string, breakType: "break1" | "break2") => void
}

function getBreakStatus(entry: BreakEntry | undefined): {
  breaksTaken: number
  requiredBreaks: number
  status: "complete" | "partial" | "none"
} {
  if (!entry) return { breaksTaken: 0, requiredBreaks: 0, status: "none" }

  const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)
  const requiredBreaks = shiftHours >= 6.5 ? 2 : shiftHours >= 3.5 ? 1 : 0

  let breaksTaken = 0
  if (entry.break1Start && entry.break1End) breaksTaken++
  if (entry.break2Start && entry.break2End) breaksTaken++

  const status = breaksTaken === 0 ? "none" : breaksTaken >= requiredBreaks ? "complete" : "partial"

  return { breaksTaken, requiredBreaks, status }
}

function calculateShiftHours(start: string, end: string): number {
  const [startHour, startMin] = start.split(":").map(Number)
  const [endHour, endMin] = end.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  return (endMinutes - startMinutes) / 60
}

export default function AssignedBreakTimesheet({
  employees,
  assignedIds,
  breakEntries,
  date,
  onStartBreak,
}: AssignedBreakTimesheetProps) {
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

            const { breaksTaken, requiredBreaks, status } = getBreakStatus(entry)

            const statusConfig = {
              complete: { color: "bg-green-50 border-green-200", icon: CheckCircle, iconColor: "text-green-600" },
              partial: { color: "bg-yellow-50 border-yellow-200", icon: AlertTriangle, iconColor: "text-yellow-600" },
              none: { color: "bg-gray-50 border-gray-200", icon: Clock, iconColor: "text-gray-400" },
            }[status]

            const StatusIcon = statusConfig.icon

            return (
              <div
                key={emp.id}
                className={`flex justify-between items-center p-4 border-2 rounded-lg ${statusConfig.color} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                  <div>
                    <div className="font-semibold">{emp.name}</div>
                    <div className="text-sm text-muted-foreground">{emp.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {breaksTaken}/{requiredBreaks} breaks
                    </div>
                    {entry && (
                      <div className="text-xs text-muted-foreground">
                        {entry.shiftStart} - {entry.shiftEnd}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {entry && breaksTaken < requiredBreaks && (
                      <Button
                        size="sm"
                        onClick={() => onStartBreak(emp.id, breaksTaken === 0 ? "break1" : "break2")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Break {breaksTaken + 1}
                      </Button>
                    )}
                    {!entry && (
                      <Badge variant="outline" className="text-xs">
                        No shift scheduled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
