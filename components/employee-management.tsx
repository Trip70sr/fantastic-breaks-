"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, UserPlus } from "lucide-react"
import type { Employee } from "@/lib/types"
import { toast } from "sonner"

interface EmployeeManagementProps {
  employees: Employee[]
  onEmployeesChange: (employees: Employee[]) => void
}

const departments = [
  "Sales",
  "Marketing",
  "Engineering",
  "HR",
  "Finance",
  "Operations",
  "Customer Service",
  "IT",
  "Legal",
  "Administration",
]

export function EmployeeManagement({ employees, onEmployeesChange }: EmployeeManagementProps) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    email: "",
    isActive: true,
  })

  const openDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee)
      setFormData({
        name: employee.name,
        department: employee.department,
        email: employee.email,
        isActive: employee.isActive,
      })
    } else {
      setEditingEmployee(null)
      setFormData({
        name: "",
        department: "",
        email: "",
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingEmployee(null)
    setFormData({
      name: "",
      department: "",
      email: "",
      isActive: true,
    })
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter employee name")
      return
    }
    if (!formData.department) {
      toast.error("Please select a department")
      return
    }
    if (!formData.email.trim()) {
      toast.error("Please enter email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Check for duplicate email (excluding current employee if editing)
    const duplicateEmail = employees.find(
      (emp) => emp.email.toLowerCase() === formData.email.toLowerCase() && emp.id !== editingEmployee?.id,
    )
    if (duplicateEmail) {
      toast.error("An employee with this email already exists")
      return
    }

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              ...formData,
            }
          : emp,
      )
      onEmployeesChange(updatedEmployees)
      toast.success("Employee updated successfully")
    } else {
      // Create new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      onEmployeesChange([...employees, newEmployee])
      toast.success("Employee added successfully")
    }

    closeDialog()
  }

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      const updatedEmployees = employees.filter((emp) => emp.id !== employee.id)
      onEmployeesChange(updatedEmployees)
      toast.success("Employee deleted successfully")
    }
  }

  const toggleEmployeeStatus = (employee: Employee) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employee.id ? { ...emp, isActive: !emp.isActive } : emp,
    )
    onEmployeesChange(updatedEmployees)
    toast.success(`Employee ${employee.isActive ? "deactivated" : "activated"} successfully`)
  }

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const inactiveEmployees = employees.filter((emp) => !emp.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Employee Directory</h3>
          <p className="text-sm text-muted-foreground">Manage your team members and their information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
              <DialogDescription>
                {editingEmployee ? "Update employee information." : "Add a new employee to your team."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingEmployee ? "Update" : "Add"} Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Employees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium">Active Employees ({activeEmployees.length})</h4>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openDialog(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleEmployeeStatus(employee)}>
                        <Switch checked={false} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {activeEmployees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No active employees found. Add your first employee to get started.
          </div>
        )}
      </div>

      {/* Inactive Employees */}
      {inactiveEmployees.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Inactive Employees ({inactiveEmployees.length})</h4>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveEmployees.map((employee) => (
                  <TableRow key={employee.id} className="opacity-60">
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Inactive</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openDialog(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleEmployeeStatus(employee)}>
                          <Switch checked={true} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(employee)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
