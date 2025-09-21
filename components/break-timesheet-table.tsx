"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Edit, Plus, Trash2, Clock, User } from "lucide-react"
import type { Employee, BreakEntry, CoverageAlert } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { toast } from "sonner"

interface BreakTimesheetTableProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onBreakEntriesUpdate: (entries: BreakEntry[]) => void
  coverageAlerts: CoverageAlert[]
}

export function BreakTimesheetTable({
  employees,
  breakEntries,
  onBreakEntriesUpdate,
  coverageAlerts,
}: BreakTimesheetTableProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const filteredEntries = breakEntries.filter((entry) => entry.date === selectedDate)

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    return employee ? employee.name : "Unknown Employee"
  }

  const hasAlert = (employeeId: string, breakNumber: 1 | 2) => {
    return coverageAlerts.some(
      (alert) => alert.employeeId === employeeId && alert.breakNumber === breakNumber && alert.date === selectedDate,
    )
  }

  const openEditDialog = (entry: BreakEntry) => {
    setEditingEntry(entry)
    setIsAddingNew(false)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    const newEntry: BreakEntry = {
      id: "",
      employeeId: "",
      date: selectedDate,
      break1Start: "",
      break1End: "",
      break1Coverage: "",
      break2Start: "",
      break2End: "",
      break2Coverage: "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingEntry(newEntry)
    setIsAddingNew(true)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!editingEntry || !editingEntry.employeeId) {
      toast.error("Please select an employee")
      return
    }

    const updatedEntries = [...breakEntries]

    if (isAddingNew) {
      const newEntry = {
        ...editingEntry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updatedEntries.push(newEntry)
      toast.success("Break entry added successfully")
    } else {
      const index = updatedEntries.findIndex((entry) => entry.id === editingEntry.id)
      if (index !== -1) {
        updatedEntries[index] = {
          ...editingEntry,
          updatedAt: new Date().toISOString(),
        }
        toast.success("Break entry updated successfully")
      }
    }

    onBreakEntriesUpdate(updatedEntries)
    setIsDialogOpen(false)
    setEditingEntry(null)
  }

  const handleDelete = (entryId: string) => {
    const updatedEntries = breakEntries.filter((entry) => entry.id !== entryId)
    onBreakEntriesUpdate(updatedEntries)
    toast.success("Break entry deleted successfully")
  }

  const updateEditingEntry = (field: keyof BreakEntry, value: string) => {
    if (editingEntry) {
      setEditingEntry({ ...editingEntry, [field]: value })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Break Schedule
          </CardTitle>
          <CardDescription>Manage employee break times and coverage assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="date-select">Date:</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Break Entry
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Break 1</TableHead>
                  <TableHead>Coverage 1</TableHead>
                  <TableHead>Break 2</TableHead>
                  <TableHead>Coverage 2</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No break entries found for {selectedDate}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className={
                        hasAlert(entry.employeeId, 1) || hasAlert(entry.employeeId, 2)
                          ? "bg-destructive/5 border-destructive/20"
                          : ""
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {getEmployeeName(entry.employeeId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entry.break1Start && entry.break1End ? (
                            <span>
                              {formatTime(entry.break1Start)} - {formatTime(entry.break1End)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not scheduled</span>
                          )}
                          {hasAlert(entry.employeeId, 1) && <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.break1Coverage ? (
                          <Badge variant="outline">{entry.break1Coverage}</Badge>
                        ) : entry.break1Start && entry.break1End ? (
                          <Badge variant="destructive">No coverage</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entry.break2Start && entry.break2End ? (
                            <span>
                              {formatTime(entry.break2Start)} - {formatTime(entry.break2End)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not scheduled</span>
                          )}
                          {hasAlert(entry.employeeId, 2) && <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.break2Coverage ? (
                          <Badge variant="outline">{entry.break2Coverage}</Badge>
                        ) : entry.break2Start && entry.break2End ? (
                          <Badge variant="destructive">No coverage</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.notes ? (
                          <span className="text-sm">{entry.notes.substring(0, 30)}...</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(entry)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
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
            <DialogTitle>{isAddingNew ? "Add Break Entry" : "Edit Break Entry"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Create a new break schedule entry" : "Modify the break schedule entry"}
            </DialogDescription>
          </DialogHeader>

          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={editingEntry.employeeId}
                  onValueChange={(value) => updateEditingEntry("employeeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Break 1</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="break1-start">Start Time</Label>
                    <Input
                      id="break1-start"
                      type="time"
                      value={editingEntry.break1Start}
                      onChange={(e) => updateEditingEntry("break1Start", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="break1-end">End Time</Label>
                    <Input
                      id="break1-end"
                      type="time"
                      value={editingEntry.break1End}
                      onChange={(e) => updateEditingEntry("break1End", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="break1-coverage">Coverage</Label>
                    <Input
                      id="break1-coverage"
                      placeholder="Who will cover this break?"
                      value={editingEntry.break1Coverage}
                      onChange={(e) => updateEditingEntry("break1Coverage", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Break 2</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="break2-start">Start Time</Label>
                    <Input
                      id="break2-start"
                      type="time"
                      value={editingEntry.break2Start}
                      onChange={(e) => updateEditingEntry("break2Start", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="break2-end">End Time</Label>
                    <Input
                      id="break2-end"
                      type="time"
                      value={editingEntry.break2End}
                      onChange={(e) => updateEditingEntry("break2End", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="break2-coverage">Coverage</Label>
                    <Input
                      id="break2-coverage"
                      placeholder="Who will cover this break?"
                      value={editingEntry.break2Coverage}
                      onChange={(e) => updateEditingEntry("break2Coverage", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or comments"
                  value={editingEntry.notes}
                  onChange={(e) => updateEditingEntry("notes", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{isAddingNew ? "Add Entry" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
