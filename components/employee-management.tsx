"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Users, Edit, Plus, Trash2, Mail, Phone } from "lucide-react"
import type { Employee } from "@/lib/types"
import { toast } from "sonner"

interface EmployeeManagementProps {
  employees: Employee[]
  onEmployeesUpdate: (employees: Employee[]) => void
}

export function EmployeeManagement({ employees, onEmployeesUpdate }: EmployeeManagementProps) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsAddingNew(false)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    const newEmployee: Employee = {
      id: "",
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      hireDate: new Date().toISOString().split("T")[0],
      isActive: true,
    }
    setEditingEmployee(newEmployee)
    setIsAddingNew(true)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!editingEmployee || !editingEmployee.name || !editingEmployee.department) {
      toast.error("Please fill in all required fields")
      return
    }

    const updatedEmployees = [...employees]

    if (isAddingNew) {
      const newEmployee = {
        ...editingEmployee,
        id: Date.now().toString(),
      }
      updatedEmployees.push(newEmployee)
      toast.success("Employee added successfully")
    } else {
      const index = updatedEmployees.findIndex((emp) => emp.id === editingEmployee.id)
      if (index !== -1) {
        updatedEmployees[index] = editingEmployee
        toast.success("Employee updated successfully")
      }
    }

    onEmployeesUpdate(updatedEmployees)
    setIsDialogOpen(false)
    setEditingEmployee(null)
  }

  const handleDelete = (employeeId: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeId)
    onEmployeesUpdate(updatedEmployees)
    toast.success("Employee deleted successfully")
  }

  const toggleEmployeeStatus = (employeeId: string) => {
    const updatedEmployees = employees.map((emp) => (emp.id === employeeId ? { ...emp, isActive: !emp.isActive } : emp))
    onEmployeesUpdate(updatedEmployees)
    toast.success("Employee status updated")
  }

  const updateEditingEmployee = (field: keyof Employee, value: string | boolean) => {
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [field]: value })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </CardTitle>
          <CardDescription>Manage employee information and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddDialog}>
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
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {employee.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={employee.isActive ? "default" : "secondary"}>
                            {employee.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={employee.isActive}
                            onCheckedChange={() => toggleEmployeeStatus(employee.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isAddingNew ? "Add Employee" : "Edit Employee"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Add a new employee to the system" : "Modify employee information"}
            </DialogDescription>
          </DialogHeader>

          {editingEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={editingEmployee.name}
                    onChange={(e) => updateEditingEmployee("name", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={editingEmployee.department}
                    onChange={(e) => updateEditingEmployee("department", e.target.value)}
                    placeholder="Department"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={editingEmployee.position}
                    onChange={(e) => updateEditingEmployee("position", e.target.value)}
                    placeholder="Job position"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hire-date">Hire Date</Label>
                  <Input
                    id="hire-date"
                    type="date"
                    value={editingEmployee.hireDate}
                    onChange={(e) => updateEditingEmployee("hireDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => updateEditingEmployee("email", e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingEmployee.phone}
                    onChange={(e) => updateEditingEmployee("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={editingEmployee.isActive}
                  onCheckedChange={(checked) => updateEditingEmployee("isActive", checked)}
                />
                <Label htmlFor="active">Active Employee</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{isAddingNew ? "Add Employee" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
