"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, X } from "lucide-react"
import type { Employee } from "@/lib/types"

interface AssignBreaksButtonProps {
  employees: Employee[]
  assignedIds: string[]
  onAssign: (ids: string[]) => void
  date: string
}

export default function AssignBreaksButton({ employees, assignedIds, onAssign, date }: AssignBreaksButtonProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(assignedIds)

  const employeesByDept = useMemo(() => {
    const grouped = new Map<string, Employee[]>()
    employees.forEach((emp) => {
      if (!grouped.has(emp.department)) {
        grouped.set(emp.department, [])
      }
      grouped.get(emp.department)!.push(emp)
    })
    return grouped
  }, [employees])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]))
  }

  const toggleDepartment = (dept: string) => {
    const deptEmployees = employeesByDept.get(dept) || []
    const deptIds = deptEmployees.map((e) => e.id)
    const allSelected = deptIds.every((id) => selected.includes(id))

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !deptIds.includes(id)))
    } else {
      setSelected((prev) => [...new Set([...prev, ...deptIds])])
    }
  }

  const apply = () => {
    onAssign(selected)
    setOpen(false)
  }

  const cancel = () => {
    setSelected(assignedIds)
    setOpen(false)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserCheck className="h-4 w-4 mr-2" />
          Assign Employees for Breaks
        </Button>
        {assignedIds.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {assignedIds.length} assigned
          </Badge>
        )}
      </div>

      {open && (
        <Card className="mt-3 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Select Employees for Break Monitoring</CardTitle>
              <CardDescription>
                Choose which employees should be tracked for breaks on {new Date(date).toLocaleDateString()}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={cancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-auto border rounded-lg p-3">
              {Array.from(employeesByDept.entries()).map(([dept, deptEmployees]) => {
                const deptIds = deptEmployees.map((e) => e.id)
                const allSelected = deptIds.every((id) => selected.includes(id))
                const someSelected = deptIds.some((id) => selected.includes(id))

                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleDepartment(dept)}
                        className={someSelected && !allSelected ? "opacity-50" : ""}
                      />
                      <span className="font-semibold text-sm">{dept}</span>
                      <Badge variant="outline" className="ml-auto">
                        {deptEmployees.filter((e) => selected.includes(e.id)).length}/{deptEmployees.length}
                      </Badge>
                    </div>
                    <div className="ml-6 space-y-1">
                      {deptEmployees.map((emp) => (
                        <label
                          key={emp.id}
                          className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer"
                        >
                          <Checkbox checked={selected.includes(emp.id)} onCheckedChange={() => toggle(emp.id)} />
                          <span className="text-sm">{emp.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {selected.length} of {employees.length} employees selected
              </span>
              <div className="flex gap-2">
                <Button onClick={cancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={apply} className="bg-aquamarine-500 hover:bg-aquamarine-600">
                  Apply Assignment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
