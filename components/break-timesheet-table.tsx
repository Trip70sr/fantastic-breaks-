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
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Edit, Plus, Calendar } from "lucide-react"
import type { Employee, BreakEntry } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { toast } from "sonner"

interface BreakTimesheetTableProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onBreakEntriesChange: (breakEntries: BreakEntry[]) => void
  selectedDate: string
  onDateChange: (date: string) => void
}

export function BreakTimesheetTable({
  employees,
  breakEntries,
  onBreakEntriesChange,
  selectedDate,
  onDateChange,
}: BreakTimesheetTableProps) {
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    break1Start: "",
    break1End: "",
    break1Coverage: "",
    break2Start: "",
    break2End: "",
    break2Coverage: "",
    notes: "",
  })

  const activeEmployees = employees.filter((emp) => emp.isActive)
  const dateBreakEntries = breakEntries.filter((entry) => entry.date === selectedDate)

  const getBreakEntryForEmployee = (employeeId: string) => {
    return dateBreakEntries.find((entry) => entry.employeeId === employeeId)
  }

  const hasNoCoverage = (entry: BreakEntry) => {
    const break1NoCoverage = entry.break1Start && entry.break1End && !entry.break1Coverage
    const break2NoCoverage = entry.break2Start && entry.break2End && !entry.break2Coverage
    return break1NoCoverage || break2NoCoverage
  }

  const openDialog = (employee?: Employee, entry?: BreakEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setFormData({
        employeeId: entry.employeeId,
        break1Start: entry.break1Start,
        break1End: entry.break1End,
        break1Coverage: entry.break1Coverage || "No coverage", // Updated line
        break2Start: entry.break2Start,
        break2End: entry.break2End,
        break2Coverage: entry.break2Coverage || "No coverage", // Updated line
        notes: entry.notes,
      })
    } else if (employee) {
      setEditingEntry(null)
      setFormData({
        employeeId: employee.id,
        break1Start: "",
        break1End: "",
        break1Coverage: "No coverage", // Updated line
        break2Start: "",
        break2End: "",
        break2Coverage: "No coverage", // Updated line
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingEntry(null)
    setFormData({
      employeeId: "",
      break1Start: "",
      break1End: "",
      break1Coverage: "No coverage", // Updated line
      break2Start: "",
      break2End: "",
      break2Coverage: "No coverage", // Updated line
      notes: "",
    })
  }

  const handleSave = () => {
    if (!formData.employeeId) {
      toast.error("Please select an employee")
      return
    }

    const now = new Date().toISOString()

    if (editingEntry) {
      // Update existing entry
      const updatedEntries = breakEntries.map((entry) =>
        entry.id === editingEntry.id
          ? {
              ...entry,
              ...formData,
              updatedAt: now,
            }
          : entry,
      )
      onBreakEntriesChange(updatedEntries)
      toast.success("Break schedule updated successfully")
    } else {
      // Create new entry
      const newEntry: BreakEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        ...formData,
        createdAt: now,
        updatedAt: now,
      }
      onBreakEntriesChange([...breakEntries, newEntry])
      toast.success("Break schedule added successfully")
    }

    closeDialog()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Label htmlFor="date">Select Date:</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-auto"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Break Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Break Schedule" : "Add Break Schedule"}</DialogTitle>
              <DialogDescription>
                {editingEntry
                  ? "Update the break schedule for this employee."
                  : "Create a new break schedule for an employee."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Employee
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.employeeId}
                    onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                    disabled={!!editingEntry}
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
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Break 1</h4>
                <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Select coverage person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No coverage">No coverage</SelectItem> // Updated line
                      {activeEmployees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.name}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Break 2</h4>
                <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Select coverage person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No coverage">No coverage</SelectItem> // Updated line
                      {activeEmployees
                        .filter((emp) => emp.id !== formData.employeeId)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.name}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingEntry ? "Update" : "Add"} Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Break 1</TableHead>
              <TableHead>Break 1 Coverage</TableHead>
              <TableHead>Break 2</TableHead>
              <TableHead>Break 2 Coverage</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeEmployees.map((employee) => {
              const entry = getBreakEntryForEmployee(employee.id)
              const noCoverage = entry && hasNoCoverage(entry)

              return (
                <TableRow key={employee.id} className={noCoverage ? "bg-red-50 dark:bg-red-950/20" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {employee.name}
                      {noCoverage && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    {entry?.break1Start && entry?.break1End ? (
                      <Badge variant="outline">
                        {formatTime(entry.break1Start)} - {formatTime(entry.break1End)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry?.break1Start && entry?.break1End ? (
                      entry.break1Coverage ? (
                        <Badge variant="secondary">{entry.break1Coverage}</Badge>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-sm">No coverage</span>
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry?.break2Start && entry?.break2End ? (
                      <Badge variant="outline">
                        {formatTime(entry.break2Start)} - {formatTime(entry.break2End)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry?.break2Start && entry?.break2End ? (
                      entry.break2Coverage ? (
                        <Badge variant="secondary">{entry.break2Coverage}</Badge>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-sm">No coverage</span>
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry?.notes ? (
                      <span className="text-sm">{entry.notes}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDialog(employee, entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {activeEmployees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No active employees found. Add employees in the Employee Management tab.
        </div>
      )}
    </div>
  )
}
