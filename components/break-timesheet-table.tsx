"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Edit, Trash2, Plus, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { toast } from "sonner"
import {
  employees,
  breakEntries as initialBreakEntries,
  getEmployeeName,
  hasMissingCoverage,
  getCoverageStatus,
} from "@/lib/data"
import type { BreakEntry } from "@/lib/types"

export default function BreakTimesheetTable() {
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>(initialBreakEntries)
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<BreakEntry>>({
    date: new Date().toISOString().split("T")[0],
    break1Start: "",
    break1End: "",
    break1Coverage: "",
    break2Start: "",
    break2End: "",
    break2Coverage: "",
    notes: "",
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("breakEntries")
    if (savedEntries) {
      setBreakEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save data to localStorage whenever breakEntries changes
  useEffect(() => {
    localStorage.setItem("breakEntries", JSON.stringify(breakEntries))
  }, [breakEntries])

  const handleEdit = (entry: BreakEntry) => {
    setEditingEntry({ ...entry })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingEntry) return

    setBreakEntries((prev) => prev.map((entry) => (entry.id === editingEntry.id ? editingEntry : entry)))
    setIsEditDialogOpen(false)
    setEditingEntry(null)
    toast.success("Break entry updated successfully")
  }

  const handleDelete = (id: string) => {
    setBreakEntries((prev) => prev.filter((entry) => entry.id !== id))
    toast.success("Break entry deleted successfully")
  }

  const handleAddEntry = () => {
    if (!newEntry.employeeId) {
      toast.error("Please select an employee")
      return
    }

    const entry: BreakEntry = {
      id: Date.now().toString(),
      employeeId: newEntry.employeeId!,
      date: newEntry.date!,
      break1Start: newEntry.break1Start || "",
      break1End: newEntry.break1End || "",
      break1Coverage: newEntry.break1Coverage || "",
      break2Start: newEntry.break2Start || "",
      break2End: newEntry.break2End || "",
      break2Coverage: newEntry.break2Coverage || "",
      notes: newEntry.notes || "",
    }

    setBreakEntries((prev) => [...prev, entry])
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      break1Start: "",
      break1End: "",
      break1Coverage: "",
      break2Start: "",
      break2End: "",
      break2Coverage: "",
      notes: "",
    })
    setIsAddDialogOpen(false)
    toast.success("Break entry added successfully")
  }

  const getAvailableEmployeesForCoverage = (excludeEmployeeId: string) => {
    return employees.filter((emp) => emp.id !== excludeEmployeeId && emp.isActive)
  }

  const renderCoverageCell = (coverage: string, hasBreak: boolean) => {
    if (!hasBreak) {
      return <span className="text-gray-400">-</span>
    }

    if (!coverage) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Missing</span>
        </div>
      )
    }

    return <span className="text-green-700 font-medium">{getEmployeeName(coverage)}</span>
  }

  const renderCoverageBadge = (entry: BreakEntry) => {
    const { break1Status, break2Status } = getCoverageStatus(entry)

    const hasMissing = break1Status === "missing" || break2Status === "missing"
    const hasAny = break1Status !== "none" || break2Status !== "none"

    if (!hasAny) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          N/A
        </Badge>
      )
    }

    if (hasMissing) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Missing Coverage
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Covered
      </Badge>
    )
  }

  const workingEmployees = employees.filter((emp) => emp.workingToday)
  const workingEntries = breakEntries.filter((entry) => {
    const employee = employees.find((emp) => emp.id === entry.employeeId)
    return employee?.workingToday
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Break Coverage Timesheet</CardTitle>
              <CardDescription>Manage employee break schedules and coverage assignments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Break Entry</DialogTitle>
                  <DialogDescription>Create a new break schedule entry for an employee</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Employee</Label>
                      <Select
                        value={newEntry.employeeId}
                        onValueChange={(value) => setNewEntry((prev) => ({ ...prev, employeeId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter((emp) => emp.isActive)
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
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
                        value={newEntry.date}
                        onChange={(e) => setNewEntry((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Break 1</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="break1Start">Start Time</Label>
                          <Input
                            id="break1Start"
                            type="time"
                            value={newEntry.break1Start}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, break1Start: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="break1End">End Time</Label>
                          <Input
                            id="break1End"
                            type="time"
                            value={newEntry.break1End}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, break1End: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="break1Coverage">Coverage</Label>
                        <Select
                          value={newEntry.break1Coverage}
                          onValueChange={(value) => setNewEntry((prev) => ({ ...prev, break1Coverage: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No coverage</SelectItem>
                            {newEntry.employeeId &&
                              getAvailableEmployeesForCoverage(newEntry.employeeId).map((employee) => (
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
                            value={newEntry.break2Start}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, break2Start: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="break2End">End Time</Label>
                          <Input
                            id="break2End"
                            type="time"
                            value={newEntry.break2End}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, break2End: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="break2Coverage">Coverage</Label>
                        <Select
                          value={newEntry.break2Coverage}
                          onValueChange={(value) => setNewEntry((prev) => ({ ...prev, break2Coverage: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No coverage</SelectItem>
                            {newEntry.employeeId &&
                              getAvailableEmployeesForCoverage(newEntry.employeeId).map((employee) => (
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
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEntry}>Add Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Employees</TabsTrigger>
              <TabsTrigger value="working">Working Today</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
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
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breakEntries.map((entry) => {
                      const employee = employees.find((emp) => emp.id === entry.employeeId)
                      const hasBreak1 = entry.break1Start && entry.break1End
                      const hasBreak2 = entry.break2Start && entry.break2End
                      const missingCoverage = hasMissingCoverage(entry)

                      return (
                        <TableRow key={entry.id} className={missingCoverage ? "bg-red-50 border-red-200" : ""}>
                          <TableCell className="font-medium">{employee?.name || "Unknown Employee"}</TableCell>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{hasBreak1 ? `${entry.break1Start} - ${entry.break1End}` : "-"}</TableCell>
                          <TableCell>{renderCoverageCell(entry.break1Coverage, hasBreak1)}</TableCell>
                          <TableCell>{hasBreak2 ? `${entry.break2Start} - ${entry.break2End}` : "-"}</TableCell>
                          <TableCell>{renderCoverageCell(entry.break2Coverage, hasBreak2)}</TableCell>
                          <TableCell className="max-w-xs truncate">{entry.notes || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(entry)} className="gap-1">
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                className="gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="working" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workingEmployees.map((employee) => {
                  const entry = workingEntries.find((e) => e.employeeId === employee.id)

                  return (
                    <Card key={employee.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{employee.name}</CardTitle>
                            <CardDescription>{employee.position}</CardDescription>
                          </div>
                          {entry && renderCoverageBadge(entry)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {entry ? (
                          <>
                            {entry.break1Start && entry.break1End && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Break 1:</span>
                                  <span>
                                    {entry.break1Start} - {entry.break1End}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Coverage:</span>
                                  {renderCoverageCell(entry.break1Coverage, true)}
                                </div>
                              </div>
                            )}

                            {entry.break2Start && entry.break2End && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Break 2:</span>
                                  <span>
                                    {entry.break2Start} - {entry.break2End}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Coverage:</span>
                                  {renderCoverageCell(entry.break2Coverage, true)}
                                </div>
                              </div>
                            )}

                            {entry.notes && (
                              <div className="text-sm text-gray-600 pt-2 border-t">
                                <span className="font-medium">Notes:</span> {entry.notes}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No break schedule set</div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Break Entry</DialogTitle>
            <DialogDescription>Update the break schedule and coverage assignments</DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-employee">Employee</Label>
                  <Input
                    id="edit-employee"
                    value={getEmployeeName(editingEntry.employeeId)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Break 1</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-break1Start">Start Time</Label>
                      <Input
                        id="edit-break1Start"
                        type="time"
                        value={editingEntry.break1Start}
                        onChange={(e) =>
                          setEditingEntry((prev) => (prev ? { ...prev, break1Start: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-break1End">End Time</Label>
                      <Input
                        id="edit-break1End"
                        type="time"
                        value={editingEntry.break1End}
                        onChange={(e) =>
                          setEditingEntry((prev) => (prev ? { ...prev, break1End: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-break1Coverage">Coverage</Label>
                    <Select
                      value={editingEntry.break1Coverage}
                      onValueChange={(value) =>
                        setEditingEntry((prev) => (prev ? { ...prev, break1Coverage: value } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No coverage</SelectItem>
                        {getAvailableEmployeesForCoverage(editingEntry.employeeId).map((employee) => (
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
                        value={editingEntry.break2Start}
                        onChange={(e) =>
                          setEditingEntry((prev) => (prev ? { ...prev, break2Start: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-break2End">End Time</Label>
                      <Input
                        id="edit-break2End"
                        type="time"
                        value={editingEntry.break2End}
                        onChange={(e) =>
                          setEditingEntry((prev) => (prev ? { ...prev, break2End: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-break2Coverage">Coverage</Label>
                    <Select
                      value={editingEntry.break2Coverage}
                      onValueChange={(value) =>
                        setEditingEntry((prev) => (prev ? { ...prev, break2Coverage: value } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No coverage</SelectItem>
                        {getAvailableEmployeesForCoverage(editingEntry.employeeId).map((employee) => (
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
                  value={editingEntry.notes}
                  onChange={(e) => setEditingEntry((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
