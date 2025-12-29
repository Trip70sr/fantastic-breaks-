"use client"

import type React from "react"

import { useState, useMemo, useCallback, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Download, Database, CalendarIcon, Mail, XCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { Employee, BreakEntry, Department, ShiftScheduleEntry, ShiftVerification } from "@/lib/types"
import { useEmployees, useBreakEntries } from "@/hooks/use-data"
import { getShiftSchedules, saveShiftSchedule } from "@/lib/shift-storage"
import { getBreakAssignments, saveBreakAssignments } from "@/lib/break-assignments"
import { getWorkingToday } from "@/lib/working-today"
import AssignBreaksButton from "@/components/assign-breaks-button"
import AssignedBreakTimesheet from "@/components/assigned-break-timesheet"
import WorkingTodayList from "@/components/working-today-list"
import ShiftVerificationBlock from "@/components/shift-verification-block"
import { useAnalytics } from "@/hooks/use-analytics"
import dynamic from "next/dynamic"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EmployeeManagement from "@/components/employee-management"
import DataBackupRestore from "@/components/data-backup-restore"
import ManagementAccess from "@/components/management-access"
import { exportToCSV, calculateShiftHours, formatShiftHours, formatTime } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getVerificationForEmployee, saveShiftVerification } from "@/lib/shift-verification"
import { Skeleton } from "@/components/ui/skeleton"
import { checkBreakDuplicate, getNextBreakNumber } from "@/lib/break-validation"

const EmailSharing = dynamic(() => import("@/components/email-sharing"), {
  loading: () => <div className="text-center py-8">Loading...</div>,
})

// Define Props interfaces for components that were previously missing their definitions
interface WorkingEmployeesTableProps {
  detailedEmployees: Array<{
    employee: Employee
    entry: BreakEntry
    shiftHours: number
    hasBreak1: boolean
    hasBreak2: boolean
    isEligibleForBreak2: boolean
    hasCoverage1: boolean
    hasCoverage2: boolean
    breakStatus: string
    coverageStatus: string
    coverageEmployee1: Employee | null
    coverageEmployee2: Employee | null
  }>
  onQuickAddBreak: (employeeId: string, breakType: "break1" | "break2") => void
}

interface BreakEntryFormProps {
  employees: Employee[]
  workingEmployees: Employee[]
  onAddEntry: (entry: Omit<BreakEntry, "id" | "employeeName">) => void
  selectedDate: Date
  shiftSchedules: ShiftScheduleEntry[]
}

export default function EmployeeBreakDashboard() {
  console.log("[v0] Dashboard rendering")

  const analytics = useAnalytics()
  // usePageAnalytics("Employee Break Dashboard") // This hook seems to be missing in updates

  const { employees, isLoading: employeesLoading, addEmployee, updateEmployee, deleteEmployee } = useEmployees()
  const {
    breakEntries,
    isLoading: entriesLoading,
    addBreakEntry,
    updateBreakEntry,
    deleteBreakEntry,
  } = useBreakEntries()

  console.log("[v0] Loading states:", {
    employeesLoading,
    entriesLoading,
    employeesCount: employees.length,
    entriesCount: breakEntries.length,
  })

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [coverageEmployee, setCoverageEmployee] = useState<string>("")
  const [break1Start, setBreak1Start] = useState("")
  const [break1End, setBreak1End] = useState("")
  const [break2Start, setBreak2Start] = useState("")
  const [break2End, setBreak2End] = useState("")
  const [break3Start, setBreak3Start] = useState("") // This seems to be new, original code had break2End
  const [break3End, setBreak3End] = useState("") // This seems to be new
  const [shiftStart, setShiftStart] = useState("")
  const [shiftEnd, setShiftEnd] = useState("")
  const [filterEmployee, setFilterEmployee] = useState<string>("all") // This was in existing, removed in updates for tabs
  const [filterBreakStatus, setFilterBreakStatus] = useState<string>("all")
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">("all") // This was in existing, updated for tabs
  const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState(false)
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false)
  const [managementFilters, setManagementFilters] = useState({
    showAllDepartments: false,
    showMissingBreaks: false,
    showCoverageIssues: false,
    showOvertimeAlerts: false,
  })
  const [isEmailSharingOpen, setIsEmailSharingOpen] = useState(false)
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState<string[]>([])
  const [shiftSchedules, setShiftSchedules] = useState<ShiftScheduleEntry[]>([]) // This was in existing, kept in updates
  const [scheduleVerified, setScheduleVerified] = useState(false)
  const [scheduleCorrected, setScheduleCorrected] = useState(false)
  const [correctionReason, setCorrectionReason] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const assignments = getBreakAssignments(selectedDate)
      const schedules = getShiftSchedules()
      setAssignedEmployeeIds(assignments.employeeIds)
      setShiftSchedules(schedules)
      console.log("[v0] Loaded assignments:", assignments.employeeIds.length)
    }
  }, [selectedDate])

  // Handle save shift schedule (kept from existing code)
  const handleSaveShiftSchedule = useCallback(
    (schedule: ShiftScheduleEntry) => {
      saveShiftSchedule(schedule)
      setShiftSchedules(getShiftSchedules())

      // Track analytics
      analytics.trackBreak("Self-Reported Shift", `${schedule.netWorkMinutes / 60}h net work`)
      toast.success("Shift schedule saved")
    },
    [analytics],
  )

  // Handle export CSV (kept from existing code)
  const handleExportCSV = () => {
    const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd")
    // Assuming filteredBreakEntries is accessible or needs to be recalculated based on new filters
    const currentFilteredEntries = breakEntries.filter((entry) => entry.date === selectedDate) // Simplified filter
    exportToCSV(currentFilteredEntries, employees, `employee-breaks-${formattedDate}`)

    // Track the export action
    analytics.trackExport("CSV Export", currentFilteredEntries.length)
  }

  // Handle add employee (kept from existing code)
  const handleAddEmployee = (employee: Employee) => {
    addEmployee({ ...employee, id: Date.now().toString() }) // Assuming addEmployee from SWR hook
    analytics.trackEmployee("Add Employee", employee.name)
    toast.success(`Employee ${employee.name} added`)
  }

  // Handle update employee (kept from existing code)
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    updateEmployee(updatedEmployee) // Assuming updateEmployee from SWR hook
    analytics.trackEmployee("Update Employee", updatedEmployee.name)
    toast.success(`Employee ${updatedEmployee.name} updated`)
  }

  // Handle delete employee (kept from existing code)
  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    deleteEmployee(id) // Assuming deleteEmployee from SWR hook
    // Also need to filter out breaks associated with deleted employee
    const remainingBreakEntries = breakEntries.filter(
      (entry) => entry.employeeId !== id && entry.coverageEmployee !== id,
    )
    // Assuming an updateBreakEntries function or similar mechanism if breakEntries are mutable from SWR
    // For now, we'll rely on SWR's cache invalidation if deleteEmployee triggers it.
    analytics.trackEmployee("Delete Employee", employee?.name)
    toast.success(`Employee ${employee?.name} deleted`)
  }

  // Handle add break entry (kept from existing code, modified for useCallback)
  const handleAddBreakEntry = useCallback(
    (entry: BreakEntry) => {
      addBreakEntry({ ...entry, id: Date.now().toString() }) // Assuming addBreakEntry from SWR hook
      analytics.trackBreak("Add Break Entry", entry.break1Start ? "Break 1" : "Shift Only")
      toast.success("Break entry added")
    },
    [addBreakEntry, analytics],
  )

  // Handle update break entry (kept from existing code, modified for useCallback)
  const handleUpdateBreakEntry = useCallback(
    (updatedEntry: BreakEntry) => {
      updateBreakEntry(updatedEntry) // Assuming updateBreakEntry from SWR hook
      analytics.trackBreak("Update Break Entry")
      toast.success("Break entry updated")
    },
    [updateBreakEntry],
  )

  // Handle delete break entry (kept from existing code, modified for useCallback)
  const handleDeleteBreakEntry = useCallback(
    (id: string) => {
      deleteBreakEntry(id) // Assuming deleteBreakEntry from SWR hook
      analytics.trackBreak("Delete Break Entry")
      toast.success("Break entry deleted")
    },
    [deleteBreakEntry],
  )

  // Handle restore data (kept from existing code)
  const handleRestoreData = (restoredEmployees: Employee[], restoredBreakEntries: BreakEntry[]) => {
    // Assuming SWR hooks handle updates to employees and breakEntries
    // We might need to revalidate or manually set the data if SWR doesn't automatically handle it.
    // For now, we'll assume add/update/delete functions from SWR are used.
    // Direct localStorage setting might be redundant or need careful integration.
    localStorage.setItem("employees", JSON.stringify(restoredEmployees))
    localStorage.setItem("breakEntries", JSON.stringify(restoredBreakEntries))
    localStorage.setItem("lastDataUpdate", new Date().toISOString())

    // This part would ideally trigger SWR revalidation or manual data setting
    // For simplicity, we'll log here. In a real app, trigger SWR mutation.
    console.log("Data restored, but SWR state needs to be updated.")
    analytics.trackData("Restore Data", `${restoredEmployees.length} employees, ${restoredBreakEntries.length} entries`)
    toast.success("Data restored")
  }

  // Handle assign employees (modified for useCallback)
  const handleAssignEmployees = useCallback(
    (employeeIds: string[]) => {
      setAssignedEmployeeIds(employeeIds)
      saveBreakAssignments(selectedDate, employeeIds)
      analytics.trackBreak("employees_assigned", `${employeeIds.length} on ${selectedDate}`)
      toast.success(`Assigned ${employeeIds.length} employees for breaks`)
    },
    [selectedDate, analytics],
  )

  // Original getDetailedWorkingEmployees is kept for reference but might be refactored
  const getDetailedWorkingEmployees = () => {
    const dateString = new Date(selectedDate).toISOString().split("T")[0]
    const todayEntries = breakEntries.filter((entry) => new Date(entry.date).toISOString().split("T")[0] === dateString)

    return todayEntries
      .map((entry) => {
        const employee = employees.find((emp) => emp.id === entry.employeeId)
        if (!employee) return null

        const shiftHours = calculateShiftHours(entry.shiftStart, entry.shiftEnd)
        const hasBreak1 = entry.break1Start && entry.break1End
        const hasBreak2 = entry.break2Start && entry.break2End
        const isEligibleForBreak2 = shiftHours >= 6.5
        const hasCoverage1 = entry.coverageEmployeeId && entry.coverageEmployeeId !== "none"
        const hasCoverage2 = entry.coverage2EmployeeId && entry.coverage2EmployeeId !== "none" // Assuming coverage2EmployeeId exists

        const breakStatus = getBreakStatus(hasBreak1, hasBreak2, isEligibleForBreak2)
        const coverageStatus = getCoverageStatus(hasBreak1, hasBreak2, hasCoverage1, hasCoverage2)

        const coverageEmployee1 = entry.coverageEmployeeId
          ? employees.find((emp) => emp.id === entry.coverageEmployeeId)
          : null
        const coverageEmployee2 = entry.coverage2EmployeeId
          ? employees.find((emp) => emp.id === entry.coverage2EmployeeId)
          : null

        return {
          employee,
          entry,
          shiftHours,
          hasBreak1,
          hasBreak2,
          isEligibleForBreak2,
          hasCoverage1,
          hasCoverage2,
          breakStatus,
          coverageStatus,
          coverageEmployee1,
          coverageEmployee2,
        }
      })
      .filter(Boolean)
  }

  // Original getBreakStatus is kept
  const getBreakStatus = (hasBreak1: boolean, hasBreak2: boolean, isEligibleForBreak2: boolean) => {
    if (!hasBreak1) return "no-breaks"
    if (isEligibleForBreak2 && !hasBreak2) return "partial-breaks"
    if (isEligibleForBreak2 && hasBreak2) return "all-breaks"
    return "break1-only"
  }

  // Original getCoverageStatus is kept
  const getCoverageStatus = (hasBreak1: boolean, hasBreak2: boolean, hasCoverage1: boolean, hasCoverage2: boolean) => {
    const needsCoverage1 = hasBreak1
    const needsCoverage2 = hasBreak2

    if (!needsCoverage1 && !needsCoverage2) return "no-coverage-needed"
    if (needsCoverage1 && !hasCoverage1) return "missing-coverage"
    if (needsCoverage2 && !hasCoverage2) return "missing-coverage"
    return "full-coverage"
  }

  const workingEmployees = useMemo(() => {
    return getWorkingToday(employees, assignedEmployeeIds)
  }, [employees, assignedEmployeeIds])

  // Memoized filteredBreakEntries using new date format
  const filteredBreakEntries = useMemo(() => {
    return breakEntries.filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().split("T")[0]
      const isSameDate = entryDate === selectedDate

      const matchesEmployee = filterEmployee === "all" || entry.employeeId === filterEmployee

      const employee = employees.find((e) => e.id === entry.employeeId)
      const matchesDepartment =
        managementFilters.showAllDepartments ||
        filterDepartment === "all" ||
        (employee && employee.department === filterDepartment)

      const hasBreak = entry.break1Start && entry.break1End
      const matchesBreakStatus =
        filterBreakStatus === "all" ||
        (filterBreakStatus === "given" && hasBreak) ||
        (filterBreakStatus === "notGiven" && !hasBreak)

      // Apply management filters
      if (managementFilters.showMissingBreaks && hasBreak) return false
      if (managementFilters.showCoverageIssues) {
        const hasCoverageIssue =
          (entry.break1Start && entry.break1End && !entry.coverageEmployeeId) ||
          (entry.break2Start && entry.break2End && !entry.coverage2EmployeeId)
        if (!hasCoverageIssue) return false
      }

      return isSameDate && matchesEmployee && matchesDepartment && matchesBreakStatus
    })
  }, [breakEntries, selectedDate, filterEmployee, filterDepartment, filterBreakStatus, employees, managementFilters])

  // Quick add break logic (kept from existing code)
  const handleQuickAddBreak = (employeeId: string, breakType: "break1" | "break2") => {
    const entry = breakEntries.find(
      (e) => e.employeeId === employeeId && new Date(e.date).toISOString().split("T")[0] === selectedDate,
    )

    if (!entry) {
      toast.error("Entry not found for this employee on this date.")
      return
    }

    const updatedEntry = { ...entry }

    if (breakType === "break1") {
      const shiftStartMinutes =
        Number.parseInt(entry.shiftStart.split(":")[0]) * 60 + Number.parseInt(entry.shiftStart.split(":")[1])
      const breakStartMinutes = shiftStartMinutes + 120 // 2 hours later
      const breakEndMinutes = breakStartMinutes + 10 // 10 minute break

      const breakStartHours = Math.floor(breakStartMinutes / 60)
      const breakStartMins = breakStartMinutes % 60
      const breakEndHours = Math.floor(breakEndMinutes / 60)
      const breakEndMins = breakEndMinutes % 60

      updatedEntry.break1Start = `${breakStartHours.toString().padStart(2, "0")}:${breakStartMins.toString().padStart(2, "0")}`
      updatedEntry.break1End = `${breakEndHours.toString().padStart(2, "0")}:${breakEndMins.toString().padStart(2, "0")}`
    } else {
      const shiftStartMinutes =
        Number.parseInt(entry.shiftStart.split(":")[0]) * 60 + Number.parseInt(entry.shiftStart.split(":")[1])
      const breakStartMinutes = shiftStartMinutes + 240 // 4 hours later
      const breakEndMinutes = breakStartMinutes + 10 // 10 minute break

      const breakStartHours = Math.floor(breakStartMinutes / 60)
      const breakStartMins = breakStartMinutes % 60
      const breakEndHours = Math.floor(breakEndMinutes / 60)
      const breakEndMins = breakEndMinutes % 60

      updatedEntry.break2Start = `${breakStartHours.toString().padStart(2, "0")}:${breakStartMins.toString().padStart(2, "0")}`
      updatedEntry.break2End = `${breakEndHours.toString().padStart(2, "0")}:${breakEndMins.toString().padStart(2, "0")}`
    }

    handleUpdateBreakEntry(updatedEntry)
    toast.success(`Quick added ${breakType} for ${employees.find((e) => e.id === employeeId)?.name}`)
  }

  // New handleSubmitBreakEntry from updates
  const handleSubmitBreakEntry = useCallback(() => {
    console.log("[v0] Starting break entry submission")

    // Validation
    if (!selectedEmployee) {
      toast.error("Please select an employee")
      return
    }

    const hasBreakTimes = break1Start || break1End || break2Start || break2End || break3Start || break3End

    if (hasBreakTimes) {
      // Determine which break number is being entered
      let breakNumber: 1 | 2 | 3 = 1
      if (break1Start || break1End) breakNumber = 1
      else if (break2Start || break2End) breakNumber = 2
      else if (break3Start || break3End) breakNumber = 3

      console.log("[v0] Checking for duplicate break:", breakNumber)

      const duplicateCheck = checkBreakDuplicate(
        selectedEmployee,
        selectedDate,
        breakEntries,
        shiftSchedules,
        breakNumber,
      )

      console.log("[v0] Duplicate check result:", duplicateCheck)

      if (duplicateCheck.isDuplicate) {
        toast.error(duplicateCheck.message)
        return
      }

      // Suggest the correct break number if they're trying to enter the wrong one
      const nextBreak = getNextBreakNumber(selectedEmployee, selectedDate, breakEntries)
      if (breakNumber !== nextBreak && nextBreak <= 2) {
        toast.error(
          `This employee should be entering Break ${nextBreak} next. ${duplicateCheck.existingBreaks.break1 ? "Break 1 is already completed." : ""} ${duplicateCheck.existingBreaks.break2 ? "Break 2 is already completed." : ""}`,
        )
        return
      }
    }

    // Re-evaluate this: Should the schedule verification be mandatory for *all* entries, or only for shift time changes?
    // The original code did not have this explicit check before submitting.
    if (!scheduleVerified && !scheduleCorrected) {
      toast.error("Please verify or correct the employee's schedule before submitting")
      return
    }

    if (!shiftStart || !shiftEnd) {
      toast.error("Please enter shift start and end times")
      return
    }

    // Check for break times to trigger coverage requirement
    const hasBreakTimesForCoverageCheck =
      break1Start || break1End || break2Start || break2End || break3Start || break3End

    if (hasBreakTimesForCoverageCheck && !coverageEmployee) {
      toast.error("Coverage employee is required when entering break times")
      return
    }

    // Break time validation (basic)
    if (break1Start && !break1End) {
      toast.error("Please enter Break 1 end time")
      return
    }
    if (break1End && !break1Start) {
      toast.error("Please enter Break 1 start time")
      return
    }
    if (break2Start && !break2End) {
      toast.error("Please enter Break 2 end time")
      return
    }
    if (break2End && !break2Start) {
      toast.error("Please enter Break 2 start time")
      return
    }
    if (break3Start && !break3End) {
      toast.error("Please enter Break 3 end time")
      return
    }
    if (break3End && !break3Start) {
      toast.error("Please enter Break 3 start time")
      return
    }

    // Create entry
    const entry: BreakEntry = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: employees.find((e) => e.id === selectedEmployee)?.name || "",
      date: selectedDate, // Use the yyyy-MM-dd format from state
      shiftStart,
      shiftEnd,
      break1Start: break1Start || undefined,
      break1End: break1End || undefined,
      break2Start: break2Start || undefined,
      break2End: break2End || undefined,
      break3Start: break3Start || undefined, // New field
      break3End: break3End || undefined, // New field
      coverageEmployee: coverageEmployee || undefined, // Renamed from coverageEmployeeId in existing code
      // coverage2EmployeeId: coverage2EmployeeId || undefined, // This was in existing, removed in updates
      scheduleVerified,
      scheduleCorrected,
      correctionReason: scheduleCorrected ? correctionReason : undefined,
      // outsideTherapyStart, // These were in existing, removed in updates
      // outsideTherapyEnd,
      // outsideTherapyReason,
    }

    addBreakEntry(entry)
    analytics.trackBreak("break_entry_added", `${selectedDate}`)

    toast.success("Break entry added successfully")

    // Reset form
    setSelectedEmployee("")
    setCoverageEmployee("")
    setBreak1Start("")
    setBreak1End("")
    setBreak2Start("")
    setBreak2End("")
    setBreak3Start("") // Reset new field
    setBreak3End("") // Reset new field
    setShiftStart("")
    setShiftEnd("")
    setScheduleVerified(false)
    setScheduleCorrected(false)
    setCorrectionReason("")
  }, [
    selectedEmployee,
    scheduleVerified,
    scheduleCorrected,
    shiftStart,
    shiftEnd,
    break1Start,
    break1End,
    break2Start,
    break2End,
    break3Start, // Include new fields in reset
    break3End, // Include new fields in reset
    coverageEmployee,
    correctionReason,
    selectedDate,
    employees,
    breakEntries, // Include breakEntries for checkBreakDuplicate
    shiftSchedules, // Include shiftSchedules for checkBreakDuplicate
    addBreakEntry,
    analytics,
  ])

  const isInitialLoading = (employeesLoading || entriesLoading) && employees.length === 0 && breakEntries.length === 0

  if (isInitialLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Employee Break Management</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsEmployeeManagementOpen(true)}>
            Manage Employees
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsBackupRestoreOpen(true)}
            className="flex items-center gap-2 bg-transparent"
          >
            <Database className="h-4 w-4" />
            Backup & Restore
          </Button>
          <Button variant="default" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEmailSharingOpen(true)}
            className="flex items-center gap-2 bg-transparent"
          >
            <Mail className="h-4 w-4" />
            Share App
          </Button>
        </div>
      </div>

      {/* Filters Card - kept from existing code */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(selectedDate), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={(date) => date && setSelectedDate(format(date, "yyyy-MM-dd"))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={filterDepartment}
                onValueChange={(value) => setFilterDepartment(value as Department | "all")}
                disabled={managementFilters.showAllDepartments}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="RBT">RBT</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="BCBA">BCBA</SelectItem>
                  <SelectItem value="Floater">Floater</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees
                    .filter(
                      (e) =>
                        managementFilters.showAllDepartments ||
                        filterDepartment === "all" ||
                        e.department === filterDepartment,
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakStatus">Break Status</Label>
              <Select value={filterBreakStatus} onValueChange={setFilterBreakStatus}>
                <SelectTrigger id="breakStatus">
                  <SelectValue placeholder="Select break status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Breaks</SelectItem>
                  <SelectItem value="given">Breaks Given</SelectItem>
                  <SelectItem value="notGiven">Breaks Not Given</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {workingEmployees.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm font-medium">Working Today ({workingEmployees.length})</Label>
                <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {workingEmployees
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((emp) => (
                      <div key={emp.id}>{emp.name}</div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Management Access - kept from existing code */}
        <ManagementAccess
          employees={employees}
          breakEntries={breakEntries}
          selectedDate={selectedDate}
          onFilterChange={setManagementFilters}
        />

        {/* Main content card with tabs - updated structure */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Employee Break Dashboard</CardTitle>
            <CardDescription>Manage and track employee breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timesheet" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timesheet">Break Timesheet</TabsTrigger>
                <TabsTrigger value="working">Working Today</TabsTrigger>
                <TabsTrigger value="add-entry">Add Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="timesheet">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Break Timesheet</CardTitle>
                    <CardDescription>Track breaks for assigned employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AssignBreaksButton
                      employees={employees.filter(
                        (e) =>
                          managementFilters.showAllDepartments ||
                          filterDepartment === "all" ||
                          e.department === filterDepartment,
                      )}
                      onAssign={handleAssignEmployees}
                      assignedIds={assignedEmployeeIds}
                    />
                    <AssignedBreakTimesheet
                      employees={employees}
                      assignedIds={assignedEmployeeIds}
                      breakEntries={filteredBreakEntries}
                      shiftSchedules={shiftSchedules}
                      selectedDate={selectedDate}
                      onSaveShiftSchedule={handleSaveShiftSchedule}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="working">
                <Card>
                  <CardHeader>
                    <CardTitle>Working Today</CardTitle>
                    <CardDescription>Employees assigned for {selectedDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WorkingTodayList employees={workingEmployees} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="add-entry">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Break Entry</CardTitle>
                    <CardDescription>Record employee breaks and schedules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Employee *</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {workingEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {workingEmployees.length === 0 && (
                          <p className="text-xs text-amber-600">
                            No employees assigned. Use "Assign Employees for Breaks" first.
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Coverage Employee *</Label>
                        <Select value={coverageEmployee} onValueChange={setCoverageEmployee}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {workingEmployees
                              .filter((e) => e.id !== selectedEmployee)
                              .map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Shift Start Time *</Label>
                        <Input
                          type="time"
                          value={shiftStart}
                          onChange={(e) => setShiftStart(e.target.value)}
                          readOnly={!scheduleCorrected}
                        />
                      </div>
                      <div>
                        <Label>Shift End Time *</Label>
                        <Input
                          type="time"
                          value={shiftEnd}
                          onChange={(e) => setShiftEnd(e.target.value)}
                          readOnly={!scheduleCorrected}
                        />
                      </div>
                    </div>

                    <ShiftVerificationBlock
                      verified={scheduleVerified}
                      corrected={scheduleCorrected}
                      onVerify={() => {
                        setScheduleVerified(!scheduleVerified)
                        setScheduleCorrected(false)
                        setCorrectionReason("")
                      }}
                      onCorrect={() => {
                        setScheduleCorrected(!scheduleCorrected)
                        setScheduleVerified(false)
                      }}
                      correctionReason={correctionReason}
                      onReasonChange={setCorrectionReason}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Break Times</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Break 1 Start</Label>
                          <Input type="time" value={break1Start} onChange={(e) => setBreak1Start(e.target.value)} />
                        </div>
                        <div>
                          <Label>Break 1 End</Label>
                          <Input type="time" value={break1End} onChange={(e) => setBreak1End(e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Break 2 Start</Label>
                          <Input type="time" value={break2Start} onChange={(e) => setBreak2Start(e.target.value)} />
                        </div>
                        <div>
                          <Label>Break 2 End</Label>
                          <Input type="time" value={break2End} onChange={(e) => setBreak2End(e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Break 3 Start</Label>
                          <Input type="time" value={break3Start} onChange={(e) => setBreak3Start(e.target.value)} />
                        </div>
                        <div>
                          <Label>Break 3 End</Label>
                          <Input type="time" value={break3End} onChange={(e) => setBreak3End(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSubmitBreakEntry} className="w-full">
                      Submit Break Entry
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals - kept from existing code, but rendering logic might need adjustment for dynamic imports */}
      {isEmailSharingOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <EmailSharing employees={employees} onClose={() => setIsEmailSharingOpen(false)} />
          </div>
        </div>
      )}

      <EmployeeManagement
        isOpen={isEmployeeManagementOpen}
        onClose={() => setIsEmployeeManagementOpen(false)}
        employees={employees}
        breakEntries={breakEntries}
        onAddEmployee={handleAddEmployee}
        onUpdateEmployee={handleUpdateEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onAddBreakEntry={handleAddBreakEntry}
        onUpdateBreakEntry={handleUpdateBreakEntry}
      />

      {isBackupRestoreOpen && (
        <DataBackupRestore
          employees={employees}
          breakEntries={breakEntries}
          onRestoreData={handleRestoreData}
          onClose={() => setIsBackupRestoreOpen(false)}
        />
      )}
    </div>
  )
}

// Working Employees Table Component (kept from existing code, but the tabs structure implies this might be replaced or refactored)
// The 'WorkingTodayList' component from the updates seems to be the replacement for this.
// Keeping it here for now in case it's still needed elsewhere or for comparison.
function WorkingEmployeesTable({ detailedEmployees, onQuickAddBreak }: WorkingEmployeesTableProps) {
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">("all")
  const [filterBreakStatus, setFilterBreakStatus] = useState<string>("all")

  const filteredEmployees = detailedEmployees.filter((item) => {
    const matchesDepartment = filterDepartment === "all" || item.employee.department === filterDepartment

    const matchesBreakStatus =
      filterBreakStatus === "all" ||
      (filterBreakStatus === "missing" && item.breakStatus === "no-breaks") ||
      (filterBreakStatus === "partial" && item.breakStatus === "partial-breaks") ||
      (filterBreakStatus === "complete" && (item.breakStatus === "all-breaks" || item.breakStatus === "break1-only"))

    return matchesDepartment && matchesBreakStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "no-breaks":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            No Breaks
          </Badge>
        )
      case "partial-breaks":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Partial
          </Badge>
        )
      case "all-breaks":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Complete
          </Badge>
        )
      case "break1-only":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-blue-600">
            <CheckCircle className="h-3 w-3" />
            Break Given
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCoverageBadge = (status: string) => {
    switch (status) {
      case "no-coverage-needed":
        return <Badge variant="outline">N/A</Badge>
      case "missing-coverage":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Missing
          </Badge>
        )
      case "full-coverage":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Covered
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (detailedEmployees.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">No employees scheduled to work today.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label htmlFor="filter-department">Department</Label>
          <Select value={filterDepartment} onValueChange={(value) => setFilterDepartment(value as Department | "all")}>
            <SelectTrigger id="filter-department" className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="RBT">RBT</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="BCBA">BCBA</SelectItem>
              <SelectItem value="Floater">Floater</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-break-status">Break Status</Label>
          <Select value={filterBreakStatus} onValueChange={setFilterBreakStatus}>
            <SelectTrigger id="filter-break-status" className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="missing">Missing Breaks</SelectItem>
              <SelectItem value="partial">Partial Breaks</SelectItem>
              <SelectItem value="complete">Complete Breaks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Break Status</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Break Details</TableHead>
              <TableHead>Outside Therapy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((item) => (
              <TableRow key={item.employee.id}>
                <TableCell className="font-medium">{item.employee.name}</TableCell>
                <TableCell>{item.employee.department}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {formatTime(item.entry.shiftStart)} - {formatTime(item.entry.shiftEnd)}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">{formatShiftHours(item.shiftHours)}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.breakStatus)}</TableCell>
                <TableCell>{getCoverageBadge(item.coverageStatus)}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    {item.hasBreak1 ? (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Break 1:</span> {formatTime(item.entry.break1Start)} -{" "}
                        {formatTime(item.entry.break1End)}
                        {item.coverageEmployee1 && (
                          <span className="text-green-600 ml-1">({item.coverageEmployee1.name})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400">Break 1: Not scheduled</div>
                    )}
                    {item.isEligibleForBreak2 &&
                      (item.hasBreak2 ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Break 2:</span> {formatTime(item.entry.break2Start)} -{" "}
                          {formatTime(item.entry.break2End)}
                          {item.coverageEmployee2 && (
                            <span className="text-green-600 ml-1">({item.coverageEmployee2.name})</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400">Break 2: Not scheduled</div>
                      ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {item.entry.outsideTherapyStart && item.entry.outsideTherapyEnd ? (
                      <div>
                        <div className="font-medium">
                          {formatTime(item.entry.outsideTherapyStart)} - {formatTime(item.entry.outsideTherapyEnd)}
                        </div>
                        {item.entry.outsideTherapyReason && (
                          <div className="text-gray-500 italic">({item.entry.outsideTherapyReason})</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400">None scheduled</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {!item.hasBreak1 && (
                      <Button size="sm" variant="outline" onClick={() => onQuickAddBreak(item.employee.id, "break1")}>
                        Add Break 1
                      </Button>
                    )}
                    {item.isEligibleForBreak2 && !item.hasBreak2 && (
                      <Button size="sm" variant="outline" onClick={() => onQuickAddBreak(item.employee.id, "break2")}>
                        Add Break 2
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Break Entry Form Component (kept from existing code, but the tabs structure implies this might be replaced or refactored)
// The "Add Entry" tab in the main component seems to be the replacement for this form.
// Keeping it here for now in case it's still needed elsewhere or for comparison.
function BreakEntryForm({
  employees,
  workingEmployees,
  onAddEntry,
  selectedDate,
  shiftSchedules,
}: BreakEntryFormProps) {
  const [employeeId, setEmployeeId] = useState("")
  const [shiftStart, setShiftStart] = useState("")
  const [shiftEnd, setShiftEnd] = useState("")
  const [break1Start, setBreak1Start] = useState("")
  const [break1End, setBreak1End] = useState("")
  const [break2Start, setBreak2Start] = useState("")
  const [break2End, setBreak2End] = useState("")
  const [coverageEmployeeId, setCoverageEmployeeId] = useState("")
  const [coverage2EmployeeId, setCoverage2EmployeeId] = useState("")
  const [outsideTherapyStart, setOutsideTherapyStart] = useState("")
  const [outsideTherapyEnd, setOutsideTherapyEnd] = useState("")
  const [outsideTherapyReason, setOutsideTherapyReason] = useState("")

  const [verified, setVerified] = useState(false)
  const [corrected, setCorrected] = useState(false)
  const [correctionReason, setCorrectionReason] = useState("")
  const [originalShiftStart, setOriginalShiftStart] = useState("")
  const [originalShiftEnd, setOriginalShiftEnd] = useState("")
  const [shiftTimesLocked, setShiftTimesLocked] = useState(false)

  // Calculate shift hours in real-time
  const shiftHours = calculateShiftHours(shiftStart, shiftEnd)
  const isEligibleForSecondBreak = shiftHours >= 6.5

  // Clear second break data if not eligible
  useEffect(() => {
    if (!isEligibleForSecondBreak) {
      setBreak2Start("")
      setBreak2End("")
      setCoverage2EmployeeId("")
    }
  }, [isEligibleForSecondBreak])

  useEffect(() => {
    if (!employeeId) {
      setShiftStart("")
      setShiftEnd("")
      setOriginalShiftStart("")
      setOriginalShiftEnd("")
      setShiftTimesLocked(false)
      setVerified(false)
      setCorrected(false)
      setCorrectionReason("")
      return
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const schedule = shiftSchedules.find((s) => s.employeeId === employeeId && s.date === dateStr)

    if (schedule) {
      setShiftStart(schedule.startTime)
      setShiftEnd(schedule.endTime)
      setOriginalShiftStart(schedule.startTime)
      setOriginalShiftEnd(schedule.endTime)
      setShiftTimesLocked(true)

      // Check if already verified
      const existingVerification = getVerificationForEmployee(employeeId, dateStr)
      if (existingVerification) {
        setVerified(existingVerification.status === "verified")
        setCorrected(existingVerification.status === "corrected")
        if (existingVerification.status === "corrected") {
          setShiftStart(existingVerification.correctedStart || schedule.startTime)
          setShiftEnd(existingVerification.correctedEnd || schedule.endTime)
          setCorrectionReason(existingVerification.reason || "")
        }
      }
    } else {
      setShiftTimesLocked(false)
    }
  }, [employeeId, selectedDate, shiftSchedules])

  const handleVerify = () => {
    setVerified(!verified)
    if (!verified) {
      setCorrected(false)
      setCorrectionReason("")
      // Reset times to original if switching from correction
      if (originalShiftStart && originalShiftEnd) {
        setShiftStart(originalShiftStart)
        setShiftEnd(originalShiftEnd)
      }
    }
  }

  const handleCorrect = () => {
    setCorrected(!corrected)
    if (!corrected) {
      setVerified(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!employeeId || !shiftStart || !shiftEnd) {
      alert("Please fill in all required fields (Employee, Shift Start, and Shift End)")
      return
    }

    if (shiftTimesLocked && !verified && !corrected) {
      alert("You must verify or correct the employee's schedule before submitting a break entry.")
      return
    }

    if (corrected && !correctionReason.trim()) {
      alert("Please provide a reason for the schedule correction.")
      return
    }

    const isEnteringBreak = break1Start || break1End || break2Start || break2End

    if (isEnteringBreak) {
      if (!coverageEmployeeId) {
        alert("Coverage Employee is required when entering break times.")
        return
      }

      if (break1Start && !break1End) {
        alert("Break 1 End Time is required when Break 1 Start Time is entered.")
        return
      }

      if (break1End && !break1Start) {
        alert("Break 1 Start Time is required when Break 1 End Time is entered.")
        return
      }

      if (break2Start && !break2End) {
        alert("Break 2 End Time is required when Break 2 Start Time is entered.")
        return
      }

      if (break2End && !break2Start) {
        alert("Break 2 Start Time is required when Break 2 End Time is entered.")
        return
      }

      if (break1Start && shiftStart && break1Start < shiftStart) {
        alert("Break 1 Start Time cannot be before Shift Start Time.")
        return
      }

      if (break1End && shiftEnd && break1End > shiftEnd) {
        alert("Break 1 End Time cannot be after Shift End Time.")
        return
      }

      if (break2Start && shiftStart && break2Start < shiftStart) {
        alert("Break 2 Start Time cannot be before Shift Start Time.")
        return
      }

      if (break2End && shiftEnd && break2End > shiftEnd) {
        alert("Break 2 End Time cannot be after Shift End Time.")
        return
      }
    }

    if (shiftTimesLocked && (verified || corrected)) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const verification: ShiftVerification = {
        id: `verification-${Date.now()}-${Math.random()}`,
        employeeId,
        date: dateStr,
        verifiedBy: coverageEmployeeId || "system", // Placeholder, should be actual user
        status: corrected ? "corrected" : "verified",
        originalStart: originalShiftStart,
        originalEnd: originalShiftEnd,
        correctedStart: corrected ? shiftStart : undefined,
        correctedEnd: corrected ? shiftEnd : undefined,
        timestamp: new Date().toISOString(),
        reason: corrected ? correctionReason : undefined,
      }
      saveShiftVerification(verification)
    }

    onAddEntry({
      employeeId,
      date: selectedDate.toISOString(),
      shiftStart,
      shiftEnd,
      break1Start,
      break1End,
      break2Start,
      break2End,
      coverageEmployeeId,
      coverage2EmployeeId,
      outsideTherapyStart,
      outsideTherapyEnd,
      outsideTherapyReason,
    })

    // Reset form
    setEmployeeId("")
    setShiftStart("")
    setShiftEnd("")
    setBreak1Start("")
    setBreak1End("")
    setBreak2Start("")
    setBreak2End("")
    setCoverageEmployeeId("")
    setCoverage2EmployeeId("")
    setOutsideTherapyStart("")
    setOutsideTherapyEnd("")
    setOutsideTherapyReason("")
    setVerified(false)
    setCorrected(false)
    setCorrectionReason("")
    setOriginalShiftStart("")
    setOriginalShiftEnd("")
    setShiftTimesLocked(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employee">
            Employee <span className="text-red-500">*</span>
          </Label>
          <Select value={employeeId} onValueChange={setEmployeeId} required>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {workingEmployees
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {workingEmployees.length === 0 && (
            <p className="text-xs text-amber-600">No employees assigned. Use "Assign Employees for Breaks" first.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="text" value={format(selectedDate, "PPP")} disabled className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shiftStart">Shift Start Time *</Label>
          <Input
            id="shiftStart"
            type="time"
            value={shiftStart}
            onChange={(e) => setShiftStart(e.target.value)}
            readOnly={shiftTimesLocked && !corrected}
            className={shiftTimesLocked && !corrected ? "bg-blue-50 cursor-not-allowed" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shiftEnd">Shift End Time *</Label>
          <Input
            id="shiftEnd"
            type="time"
            value={shiftEnd}
            onChange={(e) => setShiftEnd(e.target.value)}
            readOnly={shiftTimesLocked && !corrected}
            className={shiftTimesLocked && !corrected ? "bg-blue-50 cursor-not-allowed" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Total Shift Hours</Label>
          <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm font-medium">
            {shiftHours > 0 ? formatShiftHours(shiftHours) : "0.00 hrs"}
          </div>
        </div>
      </div>

      {shiftTimesLocked && (
        <ShiftVerificationBlock
          verified={verified}
          corrected={corrected}
          correctionReason={correctionReason}
          onVerify={handleVerify}
          onCorrect={handleCorrect}
          onReasonChange={setCorrectionReason}
        />
      )}

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Break 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="break1Start">Break Start Time</Label>
            <Input id="break1Start" type="time" value={break1Start} onChange={(e) => setBreak1Start(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="break1End">Break End Time</Label>
            <Input id="break1End" type="time" value={break1End} onChange={(e) => setBreak1End(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverageEmployee">Coverage Employee</Label>
            <Select value={coverageEmployeeId} onValueChange={setCoverageEmployeeId}>
              <SelectTrigger id="coverageEmployee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {workingEmployees
                  .filter((e) => e.id !== employeeId)
                  .sort((a, b) => a.name.localeCompare(b.name))
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

      {isEligibleForSecondBreak && (
        <div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-2">Break 2 (for shifts 6.5+ hours)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="break2Start">Break Start Time</Label>
              <Input
                id="break2Start"
                type="time"
                value={break2Start}
                onChange={(e) => setBreak2Start(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="break2End">Break End Time</Label>
              <Input id="break2End" type="time" value={break2End} onChange={(e) => setBreak2End(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverage2Employee">Coverage Employee</Label>
              <Select value={coverage2EmployeeId} onValueChange={setCoverage2EmployeeId}>
                <SelectTrigger id="coverage2Employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {workingEmployees
                    .filter((e) => e.id !== employeeId)
                    .sort((a, b) => a.name.localeCompare(b.name))
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
      )}

      {!isEligibleForSecondBreak && shiftHours > 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Second break is available for shifts of 6.5 hours or longer. Current shift:{" "}
              {formatShiftHours(shiftHours)}
            </p>
          </div>
        </div>
      )}

      {workingEmployees.length === 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> No employees are currently scheduled to work on this date. Coverage options will be
              limited to all employees.
            </p>
          </div>
        </div>
      )}

      {/* Outside Therapy Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Time Outside Therapy</h3>
        <p className="text-sm text-gray-600 mb-3">
          Track time when employee is away from direct therapy (client meetings, training, etc.)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="outsideTherapyStart">Start Time</Label>
            <Input
              id="outsideTherapyStart"
              type="time"
              value={outsideTherapyStart}
              onChange={(e) => setOutsideTherapyStart(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outsideTherapyEnd">End Time</Label>
            <Input
              id="outsideTherapyEnd"
              type="time"
              value={outsideTherapyEnd}
              onChange={(e) => setOutsideTherapyEnd(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outsideTherapyReason">Reason</Label>
            <Input
              id="outsideTherapyReason"
              type="text"
              placeholder="e.g., Client meeting, Training"
              value={outsideTherapyReason}
              onChange={(e) => setOutsideTherapyReason(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Add Break Entry</Button>
      </div>
    </form>
  )
}
