"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Employee, BreakEntry, Department } from "@/lib/types"
import { Edit, Trash2, Plus, Users, Calendar, Clock } from "lucide-react"

interface EmployeeManagementProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  breakEntries: BreakEntry[]
  onAddEmployee: (employee: Omit<Employee, "id">) => void
  onUpdateEmployee: (employee: Employee) => void
  onDeleteEmployee: (id: string) => void
  onAddBreakEntry: (entry: Omit<BreakEntry, "id">) => void
  onUpdateBreakEntry: (entry: BreakEntry) => void
}

export default function EmployeeManagement({
  isOpen,
  onClose,
  employees,
  breakEntries,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onAddBreakEntry,
  onUpdateBreakEntry,
}: EmployeeManagementProps) {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState({ name: "", department: "" as Department })

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.department) {
      onAddEmployee(newEmployee)
      setNewEmployee({ name: "", department: "" as Department })
      setIsAddEmployeeOpen(false)
    }
  }

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee)
      setEditingEmployee(null)
    }
  }

  const getEmployeeStats = (employeeId: string) => {
    const employeeEntries = breakEntries.filter((entry) => entry.employeeId === employeeId)
    const totalShifts = employeeEntries.length
    const shiftsWithBreaks = employeeEntries.filter((entry) => entry.break1Start && entry.break1End).length
    const coverageProvided = breakEntries.filter(
      (entry) => entry.coverageEmployeeId === employeeId || entry.coverage2EmployeeId === employeeId,
    ).length

    return { totalShifts, shiftsWithBreaks, coverageProvided }
  }

  const departmentCounts = employees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    },
    {} as Record<Department, number>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RBT Staff</CardTitle>
                  <Badge variant="secondary">RBT</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departmentCounts.RBT || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">BCBA Staff</CardTitle>
                  <Badge variant="secondary">BCBA</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departmentCounts.BCBA || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Operations</CardTitle>
                  <Badge variant="secondary">OPS</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departmentCounts.Operations || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(departmentCounts).map(([dept, count]) => (
                      <div key={dept} className="flex justify-between items-center">
                        <span>{dept}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Total Break Entries: {breakEntries.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Entries Today:{" "}
                        {
                          breakEntries.filter(
                            (entry) => new Date(entry.date).toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Employee List</h3>
              <Button onClick={() => setIsAddEmployeeOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Shifts</TableHead>
                    <TableHead>Shifts w/ Breaks</TableHead>
                    <TableHead>Coverage Provided</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const stats = getEmployeeStats(employee.id)
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{employee.department}</Badge>
                        </TableCell>
                        <TableCell>{stats.totalShifts}</TableCell>
                        <TableCell>{stats.shiftsWithBreaks}</TableCell>
                        <TableCell>{stats.coverageProvided}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingEmployee(employee)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteEmployee(employee.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Break Coverage Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map((employee) => {
                      const stats = getEmployeeStats(employee.id)
                      const coverageRate =
                        stats.totalShifts > 0 ? (stats.shiftsWithBreaks / stats.totalShifts) * 100 : 0

                      return (
                        <div key={employee.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{employee.name}</span>
                            <span className="text-sm text-muted-foreground">{coverageRate.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${coverageRate}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coverage Provided</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {employees
                      .map((emp) => ({ ...emp, coverage: getEmployeeStats(emp.id).coverageProvided }))
                      .sort((a, b) => b.coverage - a.coverage)
                      .slice(0, 5)
                      .map((employee) => (
                        <div key={employee.id} className="flex justify-between items-center">
                          <span className="text-sm">{employee.name}</span>
                          <Badge variant="outline">{employee.coverage} times</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Employee Dialog */}
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="Enter employee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value as Department })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RBT">RBT</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="BCBA">BCBA</SelectItem>
                    <SelectItem value="Floater">Floater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            {editingEmployee && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={editingEmployee.department}
                    onValueChange={(value) =>
                      setEditingEmployee({ ...editingEmployee, department: value as Department })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RBT">RBT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="BCBA">BCBA</SelectItem>
                      <SelectItem value="Floater">Floater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEmployee}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
