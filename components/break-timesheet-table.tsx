"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Employee, BreakEntry } from "@/lib/types"
import { formatTime, generateId } from "@/lib/utils"
import { Edit, Trash2, AlertCircle, Plus, Clock, Users } from "lucide-react"
import { format } from "date-fns"

interface BreakTimesheetTableProps {
  entries?: BreakEntry[]
  employees?: Employee[]
  onUpdateEntry?: (entry: BreakEntry) => void
  onDeleteEntry?: (id: string) => void
  onAddEntry?: (entry: BreakEntry) => void
  selectedDate?: Date
}

export default function BreakTimesheetTable({
  entries = [],
  employees = [],
  onUpdateEntry = () => {},
  onDeleteEntry = () => {},
  onAddEntry = () => {},
  selectedDate = new Date(),
}: BreakTimesheetTableProps) {
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  // New entry form state
  const [newEntry, setNewEntry] = useState<Partial<BreakEntry>>({
    employeeId: "",
    date: selectedDate.toISOString().split("T")[0],
    breakStart: "",
    breakEnd: "",
    lunchStart: "",
    lunchEnd: "",
    status: "scheduled",
  })

  const handleEditClick = (entry: BreakEntry) => {
    setEditingEntry({ ...entry })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingEntry) {
      onUpdateEntry(editingEntry)
      setIsEditDialogOpen(false)
      setEditingEntry(null)
    }
  }

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      onDeleteEntry(entryToDelete)
      setIsDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  const handleAddEntry = () => {
    if (newEntry.employeeId && newEntry.breakStart && newEntry.breakEnd) {
      const entry: BreakEntry = {
        id: generateId(),
        employeeId: newEntry.employeeId,
        date: newEntry.date || selectedDate.toISOString().split("T")[0],
        breakStart: newEntry.breakStart,
        breakEnd: newEntry.breakEnd,
        lunchStart: newEntry.lunchStart,
        lunchEnd: newEntry.lunchEnd,
        status: newEntry.status as "scheduled" | "in-progress" | "completed" | "missed",
      }
      onAddEntry(entry)
      setIsAddDialogOpen(false)
      setNewEntry({
        employeeId: "",
        date: selectedDate.toISOString().split("T")[0],
        breakStart: "",
        breakEnd: "",
        lunchStart: "",
        lunchEnd: "",
        status: "scheduled",
      })
    }
  }

  const getEmployeeName = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    return employee ? employee.name : "Unknown Employee"
  }

  const getEmployeeDepartment = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    return employee ? employee.department : "Unknown"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
      "in-progress": { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      missed: { color: "bg-red-100 text-red-800", label: "Missed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled

    return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-900">Break Schedule</h3>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Empty State */}
        <Card className="border-blue-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-blue-300 mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No Break Entries</h3>
            <p className="text-blue-600 text-center mb-4">
              No break entries found for {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>

        {/* Add Entry Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-900">Add Break Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-employee">Employee</Label>
                <Select
                  value={newEntry.employeeId || ""}
                  onValueChange={(value) => setNewEntry({ ...newEntry, employeeId: value })}
                >
                  <SelectTrigger id="add-employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-break-start">Break Start</Label>
                  <Input
                    id="add-break-start"
                    type="time"
                    value={newEntry.breakStart || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, breakStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-break-end">Break End</Label>
                  <Input
                    id="add-break-end"
                    type="time"
                    value={newEntry.breakEnd || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, breakEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-lunch-start">Lunch Start (Optional)</Label>
                  <Input
                    id="add-lunch-start"
                    type="time"
                    value={newEntry.lunchStart || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, lunchStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-lunch-end">Lunch End (Optional)</Label>
                  <Input
                    id="add-lunch-end"
                    type="time"
                    value={newEntry.lunchEnd || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, lunchEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-status">Status</Label>
                <Select
                  value={newEntry.status || "scheduled"}
                  onValueChange={(value) => setNewEntry({ ...newEntry, status: value as any })}
                >
                  <SelectTrigger id="add-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddEntry} className="bg-blue-600 hover:bg-blue-700">
                Add Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats and Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-blue-900">Break Schedule</h3>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Users className="h-4 w-4" />
            <span>{entries.length} entries</span>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Table */}
      <div className="border border-blue-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="text-blue-900 font-semibold">Employee</TableHead>
              <TableHead className="text-blue-900 font-semibold">Department</TableHead>
              <TableHead className="text-blue-900 font-semibold">Break Time</TableHead>
              <TableHead className="text-blue-900 font-semibold">Lunch Time</TableHead>
              <TableHead className="text-blue-900 font-semibold">Status</TableHead>
              <TableHead className="text-blue-900 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow
                key={entry.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-blue-25"} hover:bg-blue-50 transition-colors`}
              >
                <TableCell className="font-medium text-blue-900">{getEmployeeName(entry.employeeId)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {getEmployeeDepartment(entry.employeeId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {entry.breakStart && entry.breakEnd ? (
                    <div className="text-sm">
                      <div className="font-medium text-blue-900">
                        {formatTime(entry.breakStart)} - {formatTime(entry.breakEnd)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  {entry.lunchStart && entry.lunchEnd ? (
                    <div className="text-sm">
                      <div className="font-medium text-blue-900">
                        {formatTime(entry.lunchStart)} - {formatTime(entry.lunchEnd)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(entry)}
                      className="hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(entry.id)}
                      className="hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Edit Break Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-employee">Employee</Label>
                <Select
                  value={editingEntry.employeeId}
                  onValueChange={(value) => setEditingEntry({ ...editingEntry, employeeId: value })}
                >
                  <SelectTrigger id="edit-employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-break-start">Break Start</Label>
                  <Input
                    id="edit-break-start"
                    type="time"
                    value={editingEntry.breakStart}
                    onChange={(e) => setEditingEntry({ ...editingEntry, breakStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-break-end">Break End</Label>
                  <Input
                    id="edit-break-end"
                    type="time"
                    value={editingEntry.breakEnd}
                    onChange={(e) => setEditingEntry({ ...editingEntry, breakEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lunch-start">Lunch Start</Label>
                  <Input
                    id="edit-lunch-start"
                    type="time"
                    value={editingEntry.lunchStart || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, lunchStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lunch-end">Lunch End</Label>
                  <Input
                    id="edit-lunch-end"
                    type="time"
                    value={editingEntry.lunchEnd || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, lunchEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingEntry.status}
                  onValueChange={(value) => setEditingEntry({ ...editingEntry, status: value as any })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Add Break Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-employee">Employee</Label>
              <Select
                value={newEntry.employeeId || ""}
                onValueChange={(value) => setNewEntry({ ...newEntry, employeeId: value })}
              >
                <SelectTrigger id="add-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-break-start">Break Start</Label>
                <Input
                  id="add-break-start"
                  type="time"
                  value={newEntry.breakStart || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, breakStart: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-break-end">Break End</Label>
                <Input
                  id="add-break-end"
                  type="time"
                  value={newEntry.breakEnd || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, breakEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-lunch-start">Lunch Start (Optional)</Label>
                <Input
                  id="add-lunch-start"
                  type="time"
                  value={newEntry.lunchStart || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, lunchStart: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-lunch-end">Lunch End (Optional)</Label>
                <Input
                  id="add-lunch-end"
                  type="time"
                  value={newEntry.lunchEnd || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, lunchEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select
                value={newEntry.status || "scheduled"}
                onValueChange={(value) => setNewEntry({ ...newEntry, status: value as any })}
              >
                <SelectTrigger id="add-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddEntry} className="bg-blue-600 hover:bg-blue-700">
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">
              Are you sure you want to delete this break entry? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
