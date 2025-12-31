"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Users, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { setAssignmentForDate, getAssignmentForDate } from "@/lib/break-assignments"
import { getAdminSession } from "@/lib/admin-auth"
import type { Employee, BreakAssignment } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface DailyBreakListCreatorProps {
  employees: Employee[]
  onUpdate?: () => void
}

export default function DailyBreakListCreator({ employees, onUpdate }: DailyBreakListCreatorProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [existingAssignment, setExistingAssignment] = useState<BreakAssignment | null>(null)

  useEffect(() => {
    // Load existing assignment for selected date
    const assignment = getAssignmentForDate(selectedDate)
    setExistingAssignment(assignment)
    if (assignment) {
      setSelectedEmployees(assignment.employeeIds)
    } else {
      setSelectedEmployees([])
    }
  }, [selectedDate])

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  const handleSelectAll = () => {
    const activeEmployees = employees.filter((e) => e.active)
    setSelectedEmployees(activeEmployees.map((e) => e.id))
  }

  const handleClearAll = () => {
    setSelectedEmployees([])
  }

  const handleCreateBreakList = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "No Employees Selected",
        description: "Please select at least one employee for the break list.",
        variant: "destructive",
      })
      return
    }

    const session = getAdminSession()
    const assignedBy = session?.username || "admin"

    setAssignmentForDate(selectedDate, selectedEmployees, assignedBy)

    toast({
      title: "Break List Created",
      description: `Successfully created break list for ${selectedEmployees.length} employee${
        selectedEmployees.length !== 1 ? "s" : ""
      } on ${format(new Date(selectedDate), "MMM dd, yyyy")}`,
    })

    if (onUpdate) {
      onUpdate()
    }

    // Reload the assignment
    const newAssignment = getAssignmentForDate(selectedDate)
    setExistingAssignment(newAssignment)
  }

  const activeEmployees = employees.filter((e) => e.active)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Create Daily Break List
        </CardTitle>
        <CardDescription>Select employees who will be working and need break assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="break-date">Select Date</Label>
            <Input
              id="break-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>
          {existingAssignment && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              List exists for this date
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSelectAll} variant="outline" size="sm">
            Select All
          </Button>
          <Button onClick={handleClearAll} variant="outline" size="sm">
            Clear All
          </Button>
        </div>

        <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {activeEmployees.length === 0 ? (
              <p className="text-center text-gray-500">No active employees found</p>
            ) : (
              activeEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={`employee-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={() => handleToggleEmployee(employee.id)}
                  />
                  <Label htmlFor={`employee-${employee.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="font-semibold text-blue-900">{selectedEmployees.length} employees selected</div>
            <div className="text-sm text-blue-600">
              {existingAssignment ? "Updating existing break list" : "Creating new break list"}
            </div>
          </div>
          <Button onClick={handleCreateBreakList} size="lg">
            {existingAssignment ? "Update List" : "Create List"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
