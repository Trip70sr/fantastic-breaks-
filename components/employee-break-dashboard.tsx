"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, AlertTriangle, Plus, Edit, Trash2, Users, Calendar } from "lucide-react"
import { toast } from "sonner"
import { employees, breakEntries, getCoverageStatus, hasMissingCoverage, getEmployeeName } from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

export default function EmployeeBreakDashboard() {
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees)
  const [entries, setEntries] = useState<BreakEntry[]>(breakEntries)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [newEntry, setNewEntry] = useState<Partial<BreakEntry>>({
    date: new Date().toISOString().split("T")[0],
    employeeId: "", // Updated default value to be a non-empty string
  })

  const workingEmployees = employeeList.filter((emp) => emp.isWorking)
  const todayEntries = entries.filter((entry) => entry.date === new Date().toISOString().split("T")[0])

  const handleAddEntry = () => {
    if (!newEntry.employeeId) {
      toast.error("Please select an employee")
      return
    }

    const entry: BreakEntry = {
      id: Math.max(...entries.map((e) => e.id), 0) + 1,
      employeeId: Number.parseInt(newEntry.employeeId),
      date: newEntry.date || new Date().toISOString().split("T")[0],
      break1Start: newEntry.break1Start,
      break1End: newEntry.break1End,
      break1Coverage: newEntry.break1Coverage,
      break2Start: newEntry.break2Start,
      break2End: newEntry.break2End,
      break2Coverage: newEntry.break2Coverage,
      notes: newEntry.notes,
    }

    setEntries([...entries, entry])
    setNewEntry({ date: new Date().toISOString().split("T")[0], employeeId: "" }) // Updated default value to be a non-empty string
    setIsAddDialogOpen(false)
    toast.success("Break entry added successfully")
  }

  const handleEditEntry = () => {
    if (!editingEntry) return

    setEntries(entries.map((entry) => (entry.id === editingEntry.id ? editingEntry : entry)))
    setEditingEntry(null)
    setIsEditDialogOpen(false)
    toast.success("Break entry updated successfully")
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id))
    toast.success("Break entry deleted successfully")
  }

  const getCoverageStatusBadge = (entry: BreakEntry, breakNumber: 1 | 2) => {
    const status = getCoverageStatus(entry, breakNumber)

    switch (status) {
      case "covered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Covered
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Missing Coverage
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-500">
            N/A
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
          <p className="text-muted-foreground">Manage break schedules and coverage assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Break Entry</DialogTitle>
              <DialogDescription>Create a new break schedule entry for an employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Employee
                </Label>
                <Select onValueChange={(value) => setNewEntry({ ...newEntry, employeeId: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {workingEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Break 1</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="time"
                    placeholder="Start"
                    value={newEntry.break1Start || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, break1Start: e.target.value })}
                  />
                  <Input
                    type="time"
                    placeholder="End"
                    value={newEntry.break1End || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, break1End: e.target.value })}
                  />
                  <Select
                    value={newEntry.break1Coverage?.toString() || ""} // Updated default value to be a non-empty string
                    onValueChange={(value) =>
                      setNewEntry({ ...newEntry, break1Coverage: value ? Number.parseInt(value) : undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Coverage</SelectItem>
                      {workingEmployees
                        .filter((emp) => emp.id !== newEntry.employeeId)
                        .map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Break 2</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="time"
                    placeholder="Start"
                    value={newEntry.break2Start || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, break2Start: e.target.value })}
                  />
                  <Input
                    type="time"
                    placeholder="End"
                    value={newEntry.break2End || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, break2End: e.target.value })}
                  />
                  <Select
                    value={newEntry.break2Coverage?.toString() || ""} // Updated default value to be a non-empty string
                    onValueChange={(value) =>
                      setNewEntry({ ...newEntry, break2Coverage: value ? Number.parseInt(value) : undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Coverage</SelectItem>
                      {workingEmployees
                        .filter((emp) => emp.id !== newEntry.employeeId)
                        .map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEntry}>Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeList.length}</div>
            <p className="text-xs text-muted-foreground">{workingEmployees.length} working today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEntries.length}</div>
            <p className="text-xs text-muted-foreground">Break schedules for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Coverage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayEntries.filter(hasMissingCoverage).length}</div>
            <p className="text-xs text-muted-foreground">Entries need coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {todayEntries.length > 0
                ? Math.round(
                    ((todayEntries.length - todayEntries.filter(hasMissingCoverage).length) / todayEntries.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Breaks fully covered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Employees</TabsTrigger>
          <TabsTrigger value="working">Working Today</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Break Schedule Overview</CardTitle>
              <CardDescription>Complete break schedule with coverage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Break 1</TableHead>
                    <TableHead>Break 1 Coverage</TableHead>
                    <TableHead>Break 2</TableHead>
                    <TableHead>Break 2 Coverage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayEntries.map((entry) => {
                    const employee = employeeList.find((emp) => emp.id === entry.employeeId)
                    const hasAlert = hasMissingCoverage(entry)

                    return (
                      <TableRow key={entry.id} className={hasAlert ? "bg-red-50 border-red-200" : ""}>
                        <TableCell className="font-medium">
                          {employee?.name}
                          {hasAlert && <AlertCircle className="inline w-4 h-4 ml-2 text-red-500" />}
                        </TableCell>
                        <TableCell>{employee?.department}</TableCell>
                        <TableCell>
                          {entry.break1Start && entry.break1End ? `${entry.break1Start} - ${entry.break1End}` : "-"}
                        </TableCell>
                        <TableCell>
                          {entry.break1Start && entry.break1End ? (
                            entry.break1Coverage ? (
                              <span className="text-green-600">{getEmployeeName(entry.break1Coverage)}</span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Missing
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.break2Start && entry.break2End ? `${entry.break2Start} - ${entry.break2End}` : "-"}
                        </TableCell>
                        <TableCell>
                          {entry.break2Start && entry.break2End ? (
                            entry.break2Coverage ? (
                              <span className="text-green-600">{getEmployeeName(entry.break2Coverage)}</span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Missing
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingEntry(entry)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workingEmployees.map((employee) => {
              const entry = todayEntries.find((e) => e.employeeId === employee.id)

              return (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>
                      {employee.position} - {employee.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry ? (
                      <>
                        {entry.break1Start && entry.break1End && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Break 1: {entry.break1Start} - {entry.break1End}
                            </span>
                            {getCoverageStatusBadge(entry, 1)}
                          </div>
                        )}
                        {entry.break2Start && entry.break2End && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Break 2: {entry.break2Start} - {entry.break2End}
                            </span>
                            {getCoverageStatusBadge(entry, 2)}
                          </div>
                        )}
                        {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No breaks scheduled</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Break Entry</DialogTitle>
            <DialogDescription>Update the break schedule entry.</DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Break 1</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="time"
                    value={editingEntry.break1Start || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, break1Start: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={editingEntry.break1End || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, break1End: e.target.value })}
                  />
                  <Select
                    value={editingEntry.break1Coverage?.toString() || ""} // Updated default value to be a non-empty string
                    onValueChange={(value) =>
                      setEditingEntry({ ...editingEntry, break1Coverage: value ? Number.parseInt(value) : undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Coverage</SelectItem>
                      {workingEmployees
                        .filter((emp) => emp.id !== editingEntry.employeeId)
                        .map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Break 2</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="time"
                    value={editingEntry.break2Start || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, break2Start: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={editingEntry.break2End || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, break2End: e.target.value })}
                  />
                  <Select
                    value={editingEntry.break2Coverage?.toString() || ""} // Updated default value to be a non-empty string
                    onValueChange={(value) =>
                      setEditingEntry({ ...editingEntry, break2Coverage: value ? Number.parseInt(value) : undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Coverage</SelectItem>
                      {workingEmployees
                        .filter((emp) => emp.id !== editingEntry.employeeId)
                        .map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editingEntry.notes || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditEntry}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
