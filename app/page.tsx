"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, AlertTriangle, Edit, Trash2, Plus, Users, Clock, Shield } from "lucide-react"
import { toast } from "sonner"
import {
  initialEmployees,
  initialBreakEntries,
  getCoverageStatus,
  hasMissingCoverage,
  getEmployeeName,
} from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

export default function EmployeeBreakApp() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>(initialBreakEntries)
  const [editingEntry, setEditingEntry] = useState<BreakEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees")
    const savedBreakEntries = localStorage.getItem("breakEntries")

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
    if (savedBreakEntries) {
      setBreakEntries(JSON.parse(savedBreakEntries))
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem("breakEntries", JSON.stringify(breakEntries))
  }, [breakEntries])

  const handleSaveEntry = (entry: BreakEntry) => {
    if (entry.id) {
      setBreakEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))
      toast.success("Break entry updated successfully")
    } else {
      const newEntry = { ...entry, id: Date.now() }
      setBreakEntries((prev) => [...prev, newEntry])
      toast.success("Break entry added successfully")
    }
    setIsDialogOpen(false)
    setEditingEntry(null)
  }

  const handleDeleteEntry = (id: number) => {
    setBreakEntries((prev) => prev.filter((e) => e.id !== id))
    toast.success("Break entry deleted successfully")
  }

  const workingEmployees = employees.filter((emp) => emp.isWorking)
  const todayEntries = breakEntries.filter((entry) => entry.date === new Date().toISOString().split("T")[0])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Break Management</h1>
          <p className="text-muted-foreground">Manage employee breaks and coverage assignments</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {workingEmployees.length} Working Today
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{workingEmployees.length} working today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEntries.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Issues</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayEntries.filter(hasMissingCoverage).length}</div>
            <p className="text-xs text-muted-foreground">Entries missing coverage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Employees</TabsTrigger>
          <TabsTrigger value="working">Working Today</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Break Schedule Overview</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() =>
                    setEditingEntry({
                      id: 0,
                      employeeId: 0,
                      date: new Date().toISOString().split("T")[0],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <BreakEntryDialog
                entry={editingEntry}
                employees={employees}
                onSave={handleSaveEntry}
                onClose={() => {
                  setIsDialogOpen(false)
                  setEditingEntry(null)
                }}
              />
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
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
                    const employee = employees.find((emp) => emp.id === entry.employeeId)
                    const break1Status = getCoverageStatus(entry, 1)
                    const break2Status = getCoverageStatus(entry, 2)
                    const hasIssues = hasMissingCoverage(entry)

                    return (
                      <TableRow key={entry.id} className={hasIssues ? "bg-red-50 border-red-200" : ""}>
                        <TableCell className="font-medium">{employee?.name || "Unknown"}</TableCell>
                        <TableCell>{employee?.department || "Unknown"}</TableCell>
                        <TableCell>
                          {entry.break1Start && entry.break1End ? `${entry.break1Start}-${entry.break1End}` : "-"}
                        </TableCell>
                        <TableCell>
                          {break1Status === "covered" && (
                            <span className="text-green-600 font-medium">{getEmployeeName(entry.break1Coverage!)}</span>
                          )}
                          {break1Status === "missing" && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Missing
                            </div>
                          )}
                          {break1Status === "none" && <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {entry.break2Start && entry.break2End ? `${entry.break2Start}-${entry.break2End}` : "-"}
                        </TableCell>
                        <TableCell>
                          {break2Status === "covered" && (
                            <span className="text-green-600 font-medium">{getEmployeeName(entry.break2Coverage!)}</span>
                          )}
                          {break2Status === "missing" && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Missing
                            </div>
                          )}
                          {break2Status === "none" && <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingEntry(entry)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                              <Trash2 className="h-4 w-4" />
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
          <h2 className="text-xl font-semibold">Working Today</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workingEmployees.map((employee) => {
              const entry = todayEntries.find((e) => e.employeeId === employee.id)
              const break1Status = entry ? getCoverageStatus(entry, 1) : "none"
              const break2Status = entry ? getCoverageStatus(entry, 2) : "none"

              return (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>
                      {employee.department} • {employee.shift}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry ? (
                      <>
                        {entry.break1Start && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Break 1: {entry.break1Start}-{entry.break1End}
                            </span>
                            <Badge
                              variant={
                                break1Status === "covered"
                                  ? "default"
                                  : break1Status === "missing"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {break1Status === "covered" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {break1Status === "missing" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {break1Status === "covered"
                                ? "Covered"
                                : break1Status === "missing"
                                  ? "Missing Coverage"
                                  : "N/A"}
                            </Badge>
                          </div>
                        )}
                        {entry.break2Start && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Break 2: {entry.break2Start}-{entry.break2End}
                            </span>
                            <Badge
                              variant={
                                break2Status === "covered"
                                  ? "default"
                                  : break2Status === "missing"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {break2Status === "covered" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {break2Status === "missing" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {break2Status === "covered"
                                ? "Covered"
                                : break2Status === "missing"
                                  ? "Missing Coverage"
                                  : "N/A"}
                            </Badge>
                          </div>
                        )}
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
    </div>
  )
}

function BreakEntryDialog({
  entry,
  employees,
  onSave,
  onClose,
}: {
  entry: BreakEntry | null
  employees: Employee[]
  onSave: (entry: BreakEntry) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState<BreakEntry>(
    entry || {
      id: 0,
      employeeId: 0,
      date: new Date().toISOString().split("T")[0],
    },
  )

  useEffect(() => {
    if (entry) {
      setFormData(entry)
    }
  }, [entry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.employeeId) {
      toast.error("Please select an employee")
      return
    }
    onSave(formData)
  }

  const availableCoverageEmployees = employees.filter((emp) => emp.id !== formData.employeeId && emp.isWorking)

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{entry?.id ? "Edit Break Entry" : "Add Break Entry"}</DialogTitle>
        <DialogDescription>Manage employee break times and coverage assignments.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employee">Employee</Label>
          <Select
            value={formData.employeeId.toString()}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeId: Number.parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
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
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="break1Start">Break 1 Start</Label>
            <Input
              id="break1Start"
              type="time"
              value={formData.break1Start || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, break1Start: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break1End">Break 1 End</Label>
            <Input
              id="break1End"
              type="time"
              value={formData.break1End || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, break1End: e.target.value }))}
            />
          </div>
        </div>

        {formData.break1Start && formData.break1End && (
          <div className="space-y-2">
            <Label htmlFor="break1Coverage">Break 1 Coverage</Label>
            <Select
              value={formData.break1Coverage?.toString() || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  break1Coverage: value !== "none" ? Number.parseInt(value) : undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coverage employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No coverage</SelectItem>
                {availableCoverageEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="break2Start">Break 2 Start</Label>
            <Input
              id="break2Start"
              type="time"
              value={formData.break2Start || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, break2Start: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break2End">Break 2 End</Label>
            <Input
              id="break2End"
              type="time"
              value={formData.break2End || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, break2End: e.target.value }))}
            />
          </div>
        </div>

        {formData.break2Start && formData.break2End && (
          <div className="space-y-2">
            <Label htmlFor="break2Coverage">Break 2 Coverage</Label>
            <Select
              value={formData.break2Coverage?.toString() || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  break2Coverage: value !== "none" ? Number.parseInt(value) : undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coverage employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No coverage</SelectItem>
                {availableCoverageEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes..."
            value={formData.notes || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{entry?.id ? "Update" : "Add"} Entry</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
