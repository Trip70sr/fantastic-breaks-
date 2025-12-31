"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { getAssignmentForDate } from "@/lib/break-assignments"
import { loadEmployees, loadBreakEntries, saveBreakEntries } from "@/lib/data"
import { getUserSession } from "@/lib/employee-auth"
import { validateBreakEntry } from "@/lib/break-validation"
import type { Employee, BreakEntry } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function EmployeeBreakListView() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([])
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([])
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [isOnList, setIsOnList] = useState(false)

  // Schedule entry state
  const [shiftStart, setShiftStart] = useState("")
  const [shiftEnd, setShiftEnd] = useState("")
  const [scheduleSubmitted, setScheduleSubmitted] = useState(false)

  // Break entry state for managers
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [break1Start, setBreak1Start] = useState("")
  const [break1End, setBreak1End] = useState("")
  const [break2Start, setBreak2Start] = useState("")
  const [break2End, setBreak2End] = useState("")

  useEffect(() => {
    loadData()
  }, [selectedDate])

  const loadData = () => {
    const session = getUserSession()
    if (!session) return

    const assignment = getAssignmentForDate(selectedDate)
    const allEmployees = loadEmployees()
    const entries = loadBreakEntries()

    setBreakEntries(entries)

    if (assignment) {
      const assigned = allEmployees.filter((e) => assignment.employeeIds.includes(e.id))
      setAssignedEmployees(assigned)

      // Check if current user is on the list
      if (session.employeeId) {
        const onList = assignment.employeeIds.includes(session.employeeId)
        setIsOnList(onList)

        if (onList) {
          const emp = allEmployees.find((e) => e.id === session.employeeId)
          setCurrentEmployee(emp || null)

          // Check if schedule already submitted
          const existingEntry = entries.find((e) => e.employeeId === session.employeeId && e.date === selectedDate)
          if (existingEntry) {
            setShiftStart(existingEntry.shiftStart)
            setShiftEnd(existingEntry.shiftEnd)
            setScheduleSubmitted(true)
          }
        }
      }
    } else {
      setAssignedEmployees([])
      setIsOnList(false)
    }
  }

  const handleSubmitSchedule = () => {
    const session = getUserSession()
    if (!session?.employeeId || !shiftStart || !shiftEnd) return

    const existingEntry = breakEntries.find((e) => e.employeeId === session.employeeId && e.date === selectedDate)

    const entry: BreakEntry = {
      id: existingEntry?.id || `${session.employeeId}-${selectedDate}-${Date.now()}`,
      date: selectedDate,
      employeeId: session.employeeId,
      shiftStart,
      shiftEnd,
      break1Start: existingEntry?.break1Start,
      break1End: existingEntry?.break1End,
      break2Start: existingEntry?.break2Start,
      break2End: existingEntry?.break2End,
    }

    const updatedEntries = existingEntry
      ? breakEntries.map((e) => (e.id === entry.id ? entry : e))
      : [...breakEntries, entry]

    saveBreakEntries(updatedEntries)
    setBreakEntries(updatedEntries)
    setScheduleSubmitted(true)

    toast({
      title: "Schedule Submitted",
      description: "Your work hours have been recorded successfully.",
    })
  }

  const handleSubmitBreak = () => {
    const session = getUserSession()
    if (!session || !selectedEmployeeId) {
      toast({
        title: "Error",
        description: "Please select an employee.",
        variant: "destructive",
      })
      return
    }

    const existingEntry = breakEntries.find((e) => e.employeeId === selectedEmployeeId && e.date === selectedDate)

    if (!existingEntry?.shiftStart || !existingEntry?.shiftEnd) {
      toast({
        title: "No Schedule Found",
        description: "This employee has not entered their work hours yet.",
        variant: "destructive",
      })
      return
    }

    // Validate break entry
    const validation = validateBreakEntry(
      selectedEmployeeId,
      selectedDate,
      existingEntry.shiftStart,
      existingEntry.shiftEnd,
      break1Start || existingEntry.break1Start,
      break1End || existingEntry.break1End,
      break2Start,
      break2End,
      breakEntries,
    )

    if (!validation.isValid) {
      toast({
        title: "Invalid Break Entry",
        description: validation.message,
        variant: "destructive",
      })
      return
    }

    const entry: BreakEntry = {
      ...existingEntry,
      break1Start: break1Start || existingEntry.break1Start,
      break1End: break1End || existingEntry.break1End,
      coverageEmployeeId: session.employeeId,
      break2Start: break2Start || existingEntry.break2Start,
      break2End: break2End || existingEntry.break2End,
      coverage2EmployeeId: break2Start ? session.employeeId : existingEntry.coverage2EmployeeId,
    }

    const updatedEntries = breakEntries.map((e) => (e.id === entry.id ? entry : e))
    saveBreakEntries(updatedEntries)
    setBreakEntries(updatedEntries)

    // Clear form
    setSelectedEmployeeId("")
    setBreak1Start("")
    setBreak1End("")
    setBreak2Start("")
    setBreak2End("")

    toast({
      title: "Break Recorded",
      description: validation.message || "Break time has been recorded successfully.",
    })
  }

  const session = getUserSession()
  const isManager = session?.role === "manager"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Break List
          </CardTitle>
          <CardDescription>View and manage today's break assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="view-date">Select Date</Label>
            <Input
              id="view-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>

          {assignedEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No break list created for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">{assignedEmployees.length} employees on list</span>
                </div>
                {isOnList && <Badge variant="default">You're on this list</Badge>}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Schedule</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Breaks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedEmployees.map((emp) => {
                      const entry = breakEntries.find((e) => e.employeeId === emp.id && e.date === selectedDate)
                      const hasSchedule = entry?.shiftStart && entry?.shiftEnd
                      const hasBreak1 = entry?.break1Start && entry?.break1End
                      const hasBreak2 = entry?.break2Start && entry?.break2End

                      return (
                        <tr key={emp.id} className="border-t">
                          <td className="px-4 py-3">{emp.name}</td>
                          <td className="px-4 py-3">
                            {hasSchedule ? (
                              <span className="text-sm">
                                {entry.shiftStart} - {entry.shiftEnd}
                              </span>
                            ) : (
                              <Badge variant="outline">Not entered</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {hasBreak1 ? (
                                <Badge variant="default">Break 1 ✓</Badge>
                              ) : (
                                <Badge variant="outline">Break 1 pending</Badge>
                              )}
                              {hasBreak2 && <Badge variant="default">Break 2 ✓</Badge>}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Entry for Current Employee */}
      {isOnList && currentEmployee && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Work Schedule
            </CardTitle>
            <CardDescription>
              Enter your work hours for {format(new Date(selectedDate), "MMM dd, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift-start">Start Time</Label>
                <Input
                  id="shift-start"
                  type="time"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  disabled={scheduleSubmitted}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift-end">End Time</Label>
                <Input
                  id="shift-end"
                  type="time"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                  disabled={scheduleSubmitted}
                />
              </div>
            </div>
            <Button onClick={handleSubmitSchedule} disabled={scheduleSubmitted} className="w-full">
              {scheduleSubmitted ? "Schedule Submitted ✓" : "Submit Schedule"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Break Entry for Managers */}
      {isManager && assignedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Employee Breaks</CardTitle>
            <CardDescription>Record break times for employees on the list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-employee">Select Employee</Label>
              <select
                id="select-employee"
                className="w-full border rounded-md px-3 py-2"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="">-- Choose Employee --</option>
                {assignedEmployees.map((emp) => {
                  const entry = breakEntries.find((e) => e.employeeId === emp.id && e.date === selectedDate)
                  const hasSchedule = entry?.shiftStart && entry?.shiftEnd
                  return (
                    <option key={emp.id} value={emp.id} disabled={!hasSchedule}>
                      {emp.name} {!hasSchedule && "(No schedule)"}
                    </option>
                  )
                })}
              </select>
            </div>

            {selectedEmployeeId && (
              <>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold">First Break</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="break1-start">Start Time</Label>
                      <Input
                        id="break1-start"
                        type="time"
                        value={break1Start}
                        onChange={(e) => setBreak1Start(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break1-end">End Time</Label>
                      <Input
                        id="break1-end"
                        type="time"
                        value={break1End}
                        onChange={(e) => setBreak1End(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold">Second Break (if eligible)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="break2-start">Start Time</Label>
                      <Input
                        id="break2-start"
                        type="time"
                        value={break2Start}
                        onChange={(e) => setBreak2Start(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break2-end">End Time</Label>
                      <Input
                        id="break2-end"
                        type="time"
                        value={break2End}
                        onChange={(e) => setBreak2End(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubmitBreak} className="w-full">
                  Submit Break Entry
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
