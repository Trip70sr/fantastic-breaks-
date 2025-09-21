import type { Employee, BreakEntry } from "./types"

export const employees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    position: "Sales Associate",
    department: "Sales",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    hireDate: "2023-01-15",
    isActive: true,
    workingToday: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "Customer Service Rep",
    department: "Customer Service",
    email: "sarah.johnson@company.com",
    phone: "(555) 234-5678",
    hireDate: "2023-02-20",
    isActive: true,
    workingToday: true,
  },
  {
    id: "3",
    name: "Michael Chen",
    position: "Inventory Specialist",
    department: "Operations",
    email: "michael.chen@company.com",
    phone: "(555) 345-6789",
    hireDate: "2023-03-10",
    isActive: true,
    workingToday: true,
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "Marketing Coordinator",
    department: "Marketing",
    email: "emily.davis@company.com",
    phone: "(555) 456-7890",
    hireDate: "2023-04-05",
    isActive: true,
    workingToday: false,
  },
  {
    id: "5",
    name: "David Kim",
    position: "IT Support",
    department: "IT",
    email: "david.kim@company.com",
    phone: "(555) 567-8901",
    hireDate: "2023-05-12",
    isActive: true,
    workingToday: true,
  },
  {
    id: "6",
    name: "Jessica Williams",
    position: "HR Specialist",
    department: "Human Resources",
    email: "jessica.williams@company.com",
    phone: "(555) 678-9012",
    hireDate: "2023-06-18",
    isActive: true,
    workingToday: true,
  },
  {
    id: "7",
    name: "Robert Brown",
    position: "Warehouse Manager",
    department: "Operations",
    email: "robert.brown@company.com",
    phone: "(555) 789-0123",
    hireDate: "2022-11-30",
    isActive: true,
    workingToday: false,
  },
  {
    id: "8",
    name: "Lisa Anderson",
    position: "Accountant",
    department: "Finance",
    email: "lisa.anderson@company.com",
    phone: "(555) 890-1234",
    hireDate: "2023-07-25",
    isActive: true,
    workingToday: true,
  },
]

export const breakEntries: BreakEntry[] = [
  // John Smith - Complete coverage
  {
    id: "1",
    employeeId: "1",
    date: new Date().toISOString().split("T")[0],
    break1Start: "10:00",
    break1End: "10:15",
    break1Coverage: "2", // Sarah Johnson
    break2Start: "14:00",
    break2End: "14:15",
    break2Coverage: "6", // Jessica Williams
    notes: "Regular schedule",
  },
  // Sarah Johnson - Complete coverage
  {
    id: "2",
    employeeId: "2",
    date: new Date().toISOString().split("T")[0],
    break1Start: "10:30",
    break1End: "10:45",
    break1Coverage: "1", // John Smith
    break2Start: "14:30",
    break2End: "14:45",
    break2Coverage: "8", // Lisa Anderson
    notes: "Standard breaks",
  },
  // Michael Chen - NO COVERAGE (should trigger alerts)
  {
    id: "3",
    employeeId: "3",
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:00",
    break1End: "11:15",
    break1Coverage: "", // NO COVERAGE - should show red alert
    break2Start: "15:00",
    break2End: "15:15",
    break2Coverage: "", // NO COVERAGE - should show red alert
    notes: "Coverage needed",
  },
  // David Kim - Partial coverage (Break 2 missing)
  {
    id: "4",
    employeeId: "5",
    date: new Date().toISOString().split("T")[0],
    break1Start: "09:30",
    break1End: "09:45",
    break1Coverage: "6", // Jessica Williams
    break2Start: "13:30",
    break2End: "13:45",
    break2Coverage: "", // NO COVERAGE - should show red alert
    notes: "Need coverage for break 2",
  },
  // Jessica Williams - NO COVERAGE for break 1
  {
    id: "5",
    employeeId: "6",
    date: new Date().toISOString().split("T")[0],
    break1Start: "12:00",
    break1End: "12:15",
    break1Coverage: "", // NO COVERAGE - should show red alert
    break2Start: "",
    break2End: "",
    break2Coverage: "",
    notes: "Only one break today",
  },
  // Lisa Anderson - Complete coverage
  {
    id: "6",
    employeeId: "8",
    date: new Date().toISOString().split("T")[0],
    break1Start: "11:30",
    break1End: "11:45",
    break1Coverage: "2", // Sarah Johnson
    break2Start: "15:30",
    break2End: "15:45",
    break2Coverage: "1", // John Smith
    notes: "All covered",
  },
]

// Helper function to get employee name by ID
export const getEmployeeName = (employeeId: string): string => {
  const employee = employees.find((emp) => emp.id === employeeId)
  return employee ? employee.name : "Unknown"
}

// Helper function to check if an employee has missing coverage
export const hasMissingCoverage = (entry: BreakEntry): boolean => {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const missingBreak1Coverage = hasBreak1 && !entry.break1Coverage
  const missingBreak2Coverage = hasBreak2 && !entry.break2Coverage

  return missingBreak1Coverage || missingBreak2Coverage
}

// Helper function to get coverage status for display
export const getCoverageStatus = (entry: BreakEntry) => {
  const hasBreak1 = entry.break1Start && entry.break1End
  const hasBreak2 = entry.break2Start && entry.break2End

  const break1Status = hasBreak1 ? (entry.break1Coverage ? "covered" : "missing") : "none"

  const break2Status = hasBreak2 ? (entry.break2Coverage ? "covered" : "missing") : "none"

  return { break1Status, break2Status }
}
