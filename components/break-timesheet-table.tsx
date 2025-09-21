"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2, AlertCircle, Clock, User } from "lucide-react"
import type { Employee, BreakEntry, CoverageAlert } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { toast } from "sonner"

interface BreakTimesheetTableProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onBreakEntryUpdate: (entries: BreakEntry[]) => void
  coverageAlerts: CoverageAlert[]
}

export function BreakTimesheetTable({
  employees,
  breakEntries,
  onBreakEntryUpdate,
  coverageAlerts,
}: BreakTimesheetTableProps) {
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<BreakEntry>>({})

  const activeEmployees = employees.filter((emp) => emp.isActive)

  const hasAlert = (entryId: string) => {
    return coverageAlerts.some((alert) => alert.id.startsWith(entryId))
  }

  const getAlertForEntry = (entryId: string) => {
    return coverageAlerts.filter((alert) => alert.id.startsWith(entryId))
  }

  const handleAdd = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      date: new Date().toISOString().split("T")[0],
      break1Start: "",
      break1End: "",
      break1Coverage: "",
      break2Start: "",
      break2End: "",
      break2Coverage: "",
      notes: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (entry: BreakEntry) => {
    setEditingEntry(entry)
    setFormData({ ...entry })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const updatedEntries = breakEntries.filter((entry) => entry.id !== id)
    onBreakEntryUpdate(updatedEntries)
    toast.success("Break entry deleted successfully")
  }

  const handleSave = () => {
    if (!formData.employeeId || !formData.date) {
      toast.error("Please fill in required fields")
      return
    }

    const selectedEmployee = employees.find((emp) => emp.id === formData.employeeId)
    if (!selectedEmployee) {
      toast.error("Please select a valid employee")
      return
    }

    const now = new Date().toISOString()

    if (editingEntry) {
      // Update existing entry
      const updatedEntries = breakEntries.map((entry) =>
        entry.id === editingEntry.id
          ? ({
              ...formData,
              id: editingEntry.id,
              employeeName: selectedEmployee.name,
              createdAt: entry.createdAt,
              updatedAt: now,
            } as BreakEntry)
          : entry,
      )
      onBreakEntryUpdate(updatedEntries)
      toast.success("Break entry updated successfully")
    } else {
      // Add new entry
      const newEntry: BreakEntry = {
        ...formData,
        id: Date.now().toString(),
        employeeName: selectedEmployee.name,
        createdAt: now,
        updatedAt: now,
      } as BreakEntry

      onBreakEntryUpdate([...breakEntries, newEntry])
      toast.success("Break entry added successfully")
    }

    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setEditingEntry(null)
    setFormData({})
  }

  const handleCancel = () => {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setEditingEntry(null)
    setFormData({})
  }

  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId)
    setFormData({
      ...formData,
      employeeId,
      employeeName: selectedEmployee?.name || "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Break Schedule</CardTitle>
            <CardDescription>Manage employee break times and coverage assignments</CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Break Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Break 1</TableHead>
                <TableHead>Coverage 1</TableHead>
                <TableHead>Break 2</TableHead>
                <TableHead>Coverage 2</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No break entries found. Click "Add Break Entry" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                breakEntries.map((entry) => {
                  const alerts = getAlertForEntry(entry.id)
                  const hasAlerts = alerts.length > 0

                  return (
                    <TableRow key={entry.id} className={hasAlerts ? "coverage-alert" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {entry.employeeName}
                          {hasAlerts && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {entry.break1Start && entry.break1End ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.break1Start)} - {formatTime(entry.break1End)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not scheduled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.break1Coverage ? (
                          <Badge variant="secondary">{entry.break1Coverage}</Badge>
                        ) : entry.break1Start && entry.break1End ? (
                          <Badge variant="destructive">No Coverage</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.break2Start && entry.break2End ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.break2Start)} - {formatTime(entry.break2End)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not scheduled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.break2Coverage ? (
                          <Badge variant="secondary">{entry.break2Coverage}</Badge>
                        ) : entry.break2Start && entry.break2End ? (
                          <Badge variant="destructive">No Coverage</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {entry.notes || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Break Entry</DialogTitle>
              <DialogDescription>Create a new break schedule entry for an employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee *</Label>
                  <Select value={formData.employeeId || ""} onValueChange={handleEmployeeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Break 1</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="break1Start">Start Time</Label>
                      <Input
                        id="break1Start"
                        type="time"
                        value={formData.break1Start || ""}
                        onChange={(e) => setFormData({ ...formData, break1Start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break1End">End Time</Label>
                      <Input
                        id="break1End"
                        type="time"
                        value={formData.break1End || ""}
                        onChange={(e) => setFormData({ ...formData, break1End: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break1Coverage">Coverage</Label>
                    <Input
                      id="break1Coverage"
                      placeholder="Who will cover this break?"
                      value={formData.break1Coverage || ""}
                      onChange={(e) => setFormData({ ...formData, break1Coverage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Break 2</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="break2Start">Start Time</Label>
                      <Input
                        id="break2Start"
                        type="time"
                        value={formData.break2Start || ""}
                        onChange={(e) => setFormData({ ...formData, break2Start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break2End">End Time</Label>
                      <Input
                        id="break2End"
                        type="time"
                        value={formData.break2End || ""}
                        onChange={(e) => setFormData({ ...formData, break2End: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break2Coverage">Coverage</Label>
                    <Input
                      id="break2Coverage"
                      placeholder="Who will cover this break?"
                      value={formData.break2Coverage || ""}
                      onChange={(e) => setFormData({ ...formData, break2Coverage: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or comments..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Break Entry</DialogTitle>
              <DialogDescription>Update the break schedule entry for {editingEntry?.employeeName}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee *</Label>
                  <Select value={formData.employeeId || ""} onValueChange={handleEmployeeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Break 1</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="break1Start">Start Time</Label>
                      <Input
                        id="break1Start"
                        type="time"
                        value={formData.break1Start || ""}
                        onChange={(e) => setFormData({ ...formData, break1Start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break1End">End Time</Label>
                      <Input
                        id="break1End"
                        type="time"
                        value={formData.break1End || ""}
                        onChange={(e) => setFormData({ ...formData, break1End: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break1Coverage">Coverage</Label>
                    <Input
                      id="break1Coverage"
                      placeholder="Who will cover this break?"
                      value={formData.break1Coverage || ""}
                      onChange={(e) => setFormData({ ...formData, break1Coverage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Break 2</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="break2Start">Start Time</Label>
                      <Input
                        id="break2Start"
                        type="time"
                        value={formData.break2Start || ""}
                        onChange={(e) => setFormData({ ...formData, break2Start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break2End">End Time</Label>
                      <Input
                        id="break2End"
                        type="time"
                        value={formData.break2End || ""}
                        onChange={(e) => setFormData({ ...formData, break2End: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break2Coverage">Coverage</Label>
                    <Input
                      id="break2Coverage"
                      placeholder="Who will cover this break?"
                      value={formData.break2Coverage || ""}
                      onChange={(e) => setFormData({ ...formData, break2Coverage: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or comments..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Update Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
