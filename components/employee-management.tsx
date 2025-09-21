"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import { generateId } from "@/lib/utils"
import type { Employee, Department } from "@/lib/types"

interface EmployeeManagementProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  onUpdateEmployees: (employees: Employee[]) => void
}

export default function EmployeeManagement({ isOpen, onClose, employees, onUpdateEmployees }: EmployeeManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    department: "" as Department,
    isActive: true,
    workingToday: false,
  })

  const departments: Department[] = ["RBT", "Operations", "BCBA", "Floater"]

  const resetForm = () => {
    setFormData({
      name: "",
      department: "" as Department,
      isActive: true,
      workingToday: false,
    })
  }

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.department) {
      toast.error("Please fill in all required fields")
      return
    }

    const newEmployee: Employee = {
      id: generateId(),
      name: formData.name.trim(),
      department: formData.department,
      position: "", // Not used in current implementation
      email: "", // Not used in current implementation
      phone: "", // Not used in current implementation
      hireDate: "", // Not used in current implementation
      status: "active", // Not used in current implementation
      isActive: formData.isActive,
      workingToday: formData.workingToday,
    }

    onUpdateEmployees([...employees, newEmployee])
    setShowAddDialog(false)
    resetForm()
    toast.success("Employee added successfully")
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      department: employee.department,
      isActive: employee.isActive || true,
      workingToday: employee.workingToday || false,
    })
    setShowEditDialog(true)
  }

  const handleUpdate = () => {
    if (!editingEmployee) return

    if (!formData.name.trim() || !formData.department) {
      toast.error("Please fill in all required fields")
      return
    }

    const updatedEmployee: Employee = {
      ...editingEmployee,
      name: formData.name.trim(),
      department: formData.department,
      isActive: formData.isActive,
      workingToday: formData.workingToday,
    }

    const updatedEmployees = employees.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp))

    onUpdateEmployees(updatedEmployees)
    setShowEditDialog(false)
    setEditingEmployee(null)
    resetForm()
    toast.success("Employee updated successfully")
  }

  const handleDelete = (employeeId: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeId)
    onUpdateEmployees(updatedEmployees)
    toast.success("Employee deleted successfully")
  }

  const getDepartmentStats = () => {
    return departments.map((dept) => ({
      department: dept,
      total: employees.filter((emp) => emp.department === dept).length,
      active: employees.filter((emp) => emp.department === dept && emp.isActive).length,
      workingToday: employees.filter((emp) => emp.department === dept && emp.workingToday).length,
    }))
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Department Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {getDepartmentStats().map((stat) => (
              <Card key={stat.department}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{stat.department}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.active} active • {stat.workingToday} working today
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Employee Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Employees ({employees.length})</h3>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Working Today</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.isActive ? "default" : "secondary"}>
                          {employee.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.workingToday ? "default" : "outline"}>
                          {employee.workingToday ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(employee.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No employees found. Click "Add Employee" to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

        {/* Add Employee Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Employee name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value: Department) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="workingToday"
                  checked={formData.workingToday}
                  onCheckedChange={(checked) => setFormData({ ...formData, workingToday: checked })}
                />
                <Label htmlFor="workingToday">Working Today</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Employee name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value: Department) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-workingToday"
                  checked={formData.workingToday}
                  onCheckedChange={(checked) => setFormData({ ...formData, workingToday: checked })}
                />
                <Label htmlFor="edit-workingToday">Working Today</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
