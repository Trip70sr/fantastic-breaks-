"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Plus, Edit, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"
import { getEmployeeName, hasMissingCoverage, getCoverageStatus } from "@/lib/data"
import { formatTime, generateId } from "@/lib/utils"
import type { Employee, BreakEntry } from "@/lib/types"

interface BreakTimesheetTableProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onUpdateBreakEntries: (entries: BreakEntry[]) => void
}

export default function BreakTimesheetTable({
  employees,
  breakEntries,
  onUpdateBreakEntries,
}: BreakTimesheetTableProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    break1Start: "",
    break1End: "",
    break1Coverage: "",
    break2Start: "",
    break2End: "",
    break2Coverage: "",
    notes: "",
  })

  const resetForm = () => {
    setFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      break1Start: "",
      break1End: "",
      break1Coverage: "",
      break2Start: "",
      break2End: "",
      break2Coverage: "",
      notes: "",
    })
  }

  const handleAdd = () => {
    if (!formData.employeeId) {
      toast.error("Please select an employee")
      return
    }

    const newEntry: BreakEntry = {
      id: generateId(),
      employeeId: formData.employeeId,
      date: formData.date,
      break1Start: formData.break1Start,
      break1End: formData.break1End,
      break1Coverage: formData.break1Coverage,
      break2Start: formData.break2Start,
      break2End: formData.break2End,
      break2Coverage: formData.break2Coverage,
      notes: formData.notes,
    }

    onUpdateBreakEntries([...breakEntries, newEntry])
    setShowAddDialog(false)
    resetForm()
    toast.success("Break entry added successfully")
  }

  const handleEdit = (entry: BreakEntry) => {
    setEditingEntry(entry)
    setFormData({
      employeeId: entry.employeeId,
      date: entry.date,
      break1Start: entry.break1Start,
      break1End: entry.break1End,
      break1Coverage: entry.break1Coverage,
      break2Start: entry.break2Start,
      break2End: entry.break2End,
      break2Coverage: entry.break2Coverage,
      notes: entry.notes,
    })
    setShowEditDialog(true)
  }

  const handleUpdate = () => {
    if (!editingEntry) return

    const updatedEntry: BreakEntry = {
      ...editingEntry,
      employeeId: formData.employeeId,
      date: formData.date,
      break1Start: formData.break1Start,
      break1End: formData.break1End,
      break1Coverage: formData.break1Coverage,
      break2Start: formData.break2Start,
      break2End: formData.break2End,
      break2Coverage: formData.break2Coverage,
      notes: formData.notes,
    }

    const updatedEntries = breakEntries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry))

    onUpdateBreakEntries(updatedEntries)
    setShowEditDialog(false)
    setEditingEntry(null)
    resetForm()
    toast.success("Break entry updated successfully")
  }

  const handleDelete = (entryId: string) => {
    const updatedEntries = breakEntries.filter((entry) => entry.id !== entryId)
    onUpdateBreakEntries(updatedEntries)
    toast.success("Break entry deleted successfully")
  }

  const getCoverageStatusBadge = (entry: BreakEntry) => {
    const { break1Status, break2Status } = getCoverageStatus(entry)
    const missingCount = [break1Status, break2Status].filter((status) => status === "missing").length

    if (missingCount === 0) {
      return <Badge className="bg-green-100 text-green-800">Fully Covered</Badge>
    } else {
      return <Badge variant="destructive">{missingCount} Missing</Badge>
    }
  }

  const getRowClassName = (entry: BreakEntry) => {
    return hasMissingCoverage(entry) ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" : ""
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Break Timesheet
            </CardTitle>
            <CardDescription>Manage employee break schedules and coverage assignments</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
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
                <TableHead>Break 1 Coverage</TableHead>
                <TableHead>Break 2</TableHead>
                <TableHead>Break 2 Coverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakEntries.map((entry) => (
                <TableRow key={entry.id} className={getRowClassName(entry)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {hasMissingCoverage(entry) && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {getEmployeeName(entry.employeeId)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {entry.break1Start && entry.break1End ? (
                      <span className="text-sm">
                        {formatTime(entry.break1Start)} - {formatTime(entry.break1End)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.break1Coverage ? (
                      <Badge variant="outline">{getEmployeeName(entry.break1Coverage)}</Badge>
                    ) : entry.break1Start && entry.break1End ? (
                      <Badge variant="destructive">Missing</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.break2Start && entry.break2End ? (
                      <span className="text-sm">
                        {formatTime(entry.break2Start)} - {formatTime(entry.break2End)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.break2Coverage ? (
                      <Badge variant="outline">{getEmployeeName(entry.break2Coverage)}</Badge>
                    ) : entry.break2Start && entry.break2End ? (
                      <Badge variant="destructive">Missing</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getCoverageStatusBadge(entry)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {breakEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No break entries found. Click "Add Entry" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Break Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
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
                      value={formData.break1Start}
                      onChange={(e) => setFormData({ ...formData, break1Start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break1End">End Time</Label>
                    <Input
                      id="break1End"
                      type="time"
                      value={formData.break1End}
                      onChange={(e) => setFormData({ ...formData, break1End: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break1Coverage">Coverage</Label>
                  <Select
                    value={formData.break1Coverage}
                    onValueChange={(value) => setFormData({ ...formData, break1Coverage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No coverage</SelectItem>
                      {employees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                      value={formData.break2Start}
                      onChange={(e) => setFormData({ ...formData, break2Start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break2End">End Time</Label>
                    <Input
                      id="break2End"
                      type="time"
                      value={formData.break2End}
                      onChange={(e) => setFormData({ ...formData, break2End: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break2Coverage">Coverage</Label>
                  <Select
                    value={formData.break2Coverage}
                    onValueChange={(value) => setFormData({ ...formData, break2Coverage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No coverage</SelectItem>
                      {employees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Break Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-employee">Employee</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Break 1</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-break1Start">Start Time</Label>
                    <Input
                      id="edit-break1Start"
                      type="time"
                      value={formData.break1Start}
                      onChange={(e) => setFormData({ ...formData, break1Start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-break1End">End Time</Label>
                    <Input
                      id="edit-break1End"
                      type="time"
                      value={formData.break1End}
                      onChange={(e) => setFormData({ ...formData, break1End: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-break1Coverage">Coverage</Label>
                  <Select
                    value={formData.break1Coverage}
                    onValueChange={(value) => setFormData({ ...formData, break1Coverage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No coverage</SelectItem>
                      {employees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Break 2</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-break2Start">Start Time</Label>
                    <Input
                      id="edit-break2Start"
                      type="time"
                      value={formData.break2Start}
                      onChange={(e) => setFormData({ ...formData, break2Start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-break2End">End Time</Label>
                    <Input
                      id="edit-break2End"
                      type="time"
                      value={formData.break2End}
                      onChange={(e) => setFormData({ ...formData, break2End: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-break2Coverage">Coverage</Label>
                  <Select
                    value={formData.break2Coverage}
                    onValueChange={(value) => setFormData({ ...formData, break2Coverage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No coverage</SelectItem>
                      {employees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
