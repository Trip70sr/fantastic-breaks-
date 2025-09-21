import type { Employee, BreakEntry, Department } from "./types"

// Initial employee data with coverage test scenarios
export const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "RBT" as Department,
    email: "sarah.johnson@company.com",
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Operations" as Department,
    email: "michael.chen@company.com",
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "BCBA" as Department,
    email: "emily.rodriguez@company.com",
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    name: "David Kim",
    department: "RBT" as Department,
    email: "david.kim@company.com",
    phone: "(555) 456-7890",
  },
  {
    id: "5",
    name: "Jessica Williams",
    department: "Floater" as Department,
    email: "jessica.williams@company.com",
    phone: "(555) 567-8901",
  },
  {
    id: "6",
    name: "Alex Thompson",
    department: "RBT" as Department,
    email: "alex.thompson@company.com",
    phone: "(555) 678-9012",
  },
]

// Initial break entries with coverage test scenarios
export const initialBreakEntries: BreakEntry[] = [
  // Sarah Johnson - Complete coverage
  {
    id: "1",
    employeeId: "1",
    date: new Date().toISOString(),
    shiftStart: "08:00",
    shiftEnd: "16:00",
    break1Start: "10:00",
    break1End: "10:15",
    break2Start: "14:00",
    break2End: "14:15",
    coverageEmployeeId: "6", // Alex Thompson
    coverage2EmployeeId: "5", // Jessica Williams
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Michael Chen - NO COVERAGE (should be red)
  {
    id: "2",
    employeeId: "2",
    date: new Date().toISOString(),
    shiftStart: "09:00",
    shiftEnd: "17:00",
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    coverageEmployeeId: "", // NO COVERAGE
    coverage2EmployeeId: "", // NO COVERAGE
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Emily Rodriguez - Complete coverage
  {
    id: "3",
    employeeId: "3",
    date: new Date().toISOString(),
    shiftStart: "07:30",
    shiftEnd: "15:30",
    break1Start: "09:30",
    break1End: "09:45",
    break2Start: "13:30",
    break2End: "13:45",
    coverageEmployeeId: "1", // Sarah Johnson
    coverage2EmployeeId: "4", // David Kim
    outsideTherapyStart: "11:00",
    outsideTherapyEnd: "12:00",
    outsideTherapyReason: "Client meeting",
  },
  // David Kim - Partial coverage (Break 2 missing - should be red)
  {
    id: "4",
    employeeId: "4",
    date: new Date().toISOString(),
    shiftStart: "08:30",
    shiftEnd: "16:30",
    break1Start: "09:30",
    break1End: "09:45",
    break2Start: "13:30",
    break2End: "13:45",
    coverageEmployeeId: "5", // Jessica Williams
    coverage2EmployeeId: "", // NO COVERAGE for break 2
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Jessica Williams - Missing coverage (should be red)
  {
    id: "5",
    employeeId: "5",
    date: new Date().toISOString(),
    shiftStart: "10:00",
    shiftEnd: "16:00",
    break1Start: "12:00",
    break1End: "12:15",
    break2Start: "",
    break2End: "",
    coverageEmployeeId: "", // NO COVERAGE
    coverage2EmployeeId: "",
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
  // Alex Thompson - Complete coverage
  {
    id: "6",
    employeeId: "6",
    date: new Date().toISOString(),
    shiftStart: "09:00",
    shiftEnd: "17:00",
    break1Start: "11:00",
    break1End: "11:15",
    break2Start: "15:00",
    break2End: "15:15",
    coverageEmployeeId: "2", // Michael Chen
    coverage2EmployeeId: "3", // Emily Rodriguez
    outsideTherapyStart: "",
    outsideTherapyEnd: "",
    outsideTherapyReason: "",
  },
]

// Export aliases for compatibility
export const employees = initialEmployees
export const breakEntries = initialBreakEntries
