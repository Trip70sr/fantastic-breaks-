"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Employee, BreakEntry, Department } from "@/lib/types"
import { Edit, Trash2, Plus, Users } from "lucide-react"
import { canManageEmployees } from "@/lib/admin-auth"

interface EmployeeManagementProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  breakEntries: BreakEntry[]
  onAddEmployee: (employee: Employee) => void
  onUpdateEmployee: (employee: Employee) => void
  onDeleteEmployee: (id: string) => void
  onAddBreakEntry: (entry: BreakEntry) => void
  onUpdateBreakEntry: (entry: BreakEntry) => void
}

export default function EmployeeManagement({
  isOpen,
  onClose,
  employees = [], // Add default empty array
  breakEntries = [], // Add default empty array
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onAddBreakEntry,
  onUpdateBreakEntry,
}: EmployeeManagementProps) {
  const [mounted, setMounted] = useState(false)
  const [canManage, setCanManage] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "RBT" as Department,
  })

  useEffect(() => {
    setMounted(true)
    // Only check permissions after mounting to avoid SSR issues
    if (typeof window !== "undefined") {
      setCanManage(canManageEmployees())
    }
  }, [])

  if (!mounted) {
    return null
  }

  const handleAddEmployee = () => {
    if (!canManage) {
      alert("You do not have permission to add employees. Only management can perform this action.")
      return
    }

    if (newEmployee.name.trim()) {
      onAddEmployee({
        id: Date.now().toString(),
        name: newEmployee.name.trim(),
        department: newEmployee.department,
        active: true,
        hourlyRate: 0,
      })
      setNewEmployee({ name: "", department: "RBT" })
      setIsAddEmployeeOpen(false)
    }
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({ ...employee })
    setIsEditEmployeeOpen(true)
  }

  const handleUpdateEmployee = () => {
    if (!canManage) {
      alert("You do not have permission to edit employees. Only management can perform this action.")
      return
    }

    if (editingEmployee && editingEmployee.name.trim()) {
      onUpdateEmployee(editingEmployee)
      setEditingEmployee(null)
      setIsEditEmployeeOpen(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!canManage) {
      alert("You do not have permission to delete employees. Only management can perform this action.")
      return
    }

    if (employeeToDelete) {
      onDeleteEmployee(employeeToDelete)
      setEmployeeToDelete(null)
      setIsDeleteConfirmOpen(false)
    }
  }

  const getEmployeeStats = (employeeId: string) => {
    const safeBreakEntries = breakEntries || []
    const employeeEntries = safeBreakEntries.filter((entry) => entry.employeeId === employeeId)
    const totalShifts = employeeEntries.length
    const shiftsWithBreaks = employeeEntries.filter((entry) => entry.break1Start && entry.break1End).length
    const coverageProvided = safeBreakEntries.filter(
      (entry) => entry.coverageEmployeeId === employeeId || entry.coverage2EmployeeId === employeeId,
    ).length

    return {
      totalShifts,
      shiftsWithBreaks,
      coverageProvided,
    }
  }

  if (!isOpen) return null

  const safeEmployees = employees || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Employees ({safeEmployees.length})</h3>
              <p className="text-sm text-gray-600">Manage your team members and their departments</p>
              {!canManage && (
                <p className="text-sm text-red-600 mt-1">
                  View-only mode. Only management can add/edit/delete employees.
                </p>
              )}
            </div>
            <Button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="flex items-center gap-2"
              disabled={!canManage}
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Total Shifts</TableHead>
                  <TableHead>Shifts with Breaks</TableHead>
                  <TableHead>Coverage Provided</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeEmployees.map((employee) => {
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEmployee(employee)}
                            disabled={!canManage}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(employee.id)}
                            disabled={!canManage}
                          >
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

          {safeEmployees.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No employees found. Add your first employee to get started.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Employee Name</Label>
              <Input
                id="employee-name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Enter employee name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-department">Department</Label>
              <Select
                value={newEmployee.department}
                onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value as Department })}
              >
                <SelectTrigger id="employee-department">
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddEmployee} disabled={!canManage}>
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-employee-name">Employee Name</Label>
                <Input
                  id="edit-employee-name"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  placeholder="Enter employee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-employee-department">Department</Label>
                <Select
                  value={editingEmployee.department}
                  onValueChange={(value) => setEditingEmployee({ ...editingEmployee, department: value as Department })}
                >
                  <SelectTrigger id="edit-employee-department">
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateEmployee} disabled={!canManage}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this employee? This will also remove all their break entries and coverage
            assignments. This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={!canManage}>
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
