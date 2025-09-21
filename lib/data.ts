import type { Employee, BreakEntry, CoverageEntry, DepartmentStats, BreakStats } from "./types"

export const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "Customer Service",
    position: "Senior Representative",
    email: "sarah.johnson@company.com",
    phone: "(555) 123-4567",
    hireDate: "2022-03-15",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Sales",
    position: "Account Manager",
    email: "michael.chen@company.com",
    phone: "(555) 234-5678",
    hireDate: "2021-08-22",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "Customer Service",
    position: "Team Lead",
    email: "emily.rodriguez@company.com",
    phone: "(555) 345-6789",
    hireDate: "2020-11-10",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    name: "David Kim",
    department: "Technical Support",
    position: "Support Specialist",
    email: "david.kim@company.com",
    phone: "(555) 456-7890",
    hireDate: "2023-01-18",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    name: "Jessica Williams",
    department: "Sales",
    position: "Sales Representative",
    email: "jessica.williams@company.com",
    phone: "(555) 567-8901",
    hireDate: "2022-09-05",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "6",
    name: "Robert Taylor",
    department: "Technical Support",
    position: "Senior Technician",
    email: "robert.taylor@company.com",
    phone: "(555) 678-9012",
    hireDate: "2021-04-12",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
]

export const breakEntries: BreakEntry[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Sarah Johnson",
    date: "2024-01-15",
    breakType: "lunch",
    startTime: "12:00",
    endTime: "13:00",
    duration: 60,
    notes: "Lunch break",
    location: "Cafeteria",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T13:05:00Z",
  },
  {
    id: "2",
    employeeId: "1",
    employeeName: "Sarah Johnson",
    date: "2024-01-15",
    breakType: "break",
    startTime: "10:30",
    endTime: "10:45",
    duration: 15,
    notes: "Coffee break",
    location: "Break room",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T10:50:00Z",
  },
  {
    id: "3",
    employeeId: "2",
    employeeName: "Michael Chen",
    date: "2024-01-15",
    breakType: "lunch",
    startTime: "12:30",
    endTime: "13:30",
    duration: 60,
    notes: "Lunch meeting with client",
    location: "Restaurant",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T13:35:00Z",
  },
  {
    id: "4",
    employeeId: "3",
    employeeName: "Emily Rodriguez",
    date: "2024-01-15",
    breakType: "personal",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    notes: "Personal appointment",
    location: "Off-site",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T14:35:00Z",
  },
  {
    id: "5",
    employeeId: "4",
    employeeName: "David Kim",
    date: "2024-01-15",
    breakType: "break",
    startTime: "15:15",
    endTime: "15:30",
    duration: 15,
    notes: "Afternoon break",
    location: "Break room",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T15:35:00Z",
  },
  {
    id: "6",
    employeeId: "5",
    employeeName: "Jessica Williams",
    date: "2024-01-15",
    breakType: "lunch",
    startTime: "11:30",
    endTime: "12:30",
    duration: 60,
    notes: "Early lunch",
    location: "Cafeteria",
    approved: true,
    approvedBy: "Manager",
    approvedAt: "2024-01-15T12:35:00Z",
  },
]

export const coverageEntries: CoverageEntry[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Sarah Johnson",
    date: "2024-01-15",
    shift: "morning",
    startTime: "09:00",
    endTime: "17:00",
    position: "Customer Service Rep",
    department: "Customer Service",
    status: "completed",
    notes: "Full coverage provided",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Emily Rodriguez",
    date: "2024-01-15",
    shift: "morning",
    startTime: "08:00",
    endTime: "16:00",
    position: "Team Lead",
    department: "Customer Service",
    status: "completed",
    notes: "Supervised team during peak hours",
  },
  {
    id: "3",
    employeeId: "6",
    employeeName: "Robert Taylor",
    date: "2024-01-15",
    shift: "afternoon",
    startTime: "13:00",
    endTime: "21:00",
    position: "Senior Technician",
    department: "Technical Support",
    status: "completed",
    notes: "Handled escalated technical issues",
  },
]

export const departmentStats: DepartmentStats[] = [
  {
    department: "Customer Service",
    totalEmployees: 2,
    activeEmployees: 2,
    totalBreaks: 4,
    averageBreakDuration: 37.5,
    complianceRate: 95,
  },
  {
    department: "Sales",
    totalEmployees: 2,
    activeEmployees: 2,
    totalBreaks: 2,
    averageBreakDuration: 60,
    complianceRate: 88,
  },
  {
    department: "Technical Support",
    totalEmployees: 2,
    activeEmployees: 2,
    totalBreaks: 1,
    averageBreakDuration: 15,
    complianceRate: 92,
  },
]

export const breakStats: BreakStats = {
  totalBreaks: 6,
  totalDuration: 240,
  averageDuration: 40,
  breaksByType: {
    lunch: 3,
    break: 2,
    personal: 1,
  },
  complianceRate: 92,
  missedBreaks: 3,
}

// Helper functions
export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((emp) => emp.id === id)
}

export function getBreakEntriesByEmployee(employeeId: string): BreakEntry[] {
  return breakEntries.filter((entry) => entry.employeeId === employeeId)
}

export function getBreakEntriesByDate(date: string): BreakEntry[] {
  return breakEntries.filter((entry) => entry.date === date)
}

export function getCoverageEntriesByEmployee(employeeId: string): CoverageEntry[] {
  return coverageEntries.filter((entry) => entry.employeeId === employeeId)
}

export function getCoverageEntriesByDate(date: string): CoverageEntry[] {
  return coverageEntries.filter((entry) => entry.date === date)
}

export function calculateBreakCompliance(employeeId: string, date: string): number {
  const breaks = getBreakEntriesByEmployee(employeeId).filter((b) => b.date === date)
  const requiredBreaks = 2 // Assuming 2 breaks required per day
  return Math.min((breaks.length / requiredBreaks) * 100, 100)
}

export function getEmployeesWithMissingCoverage(date: string): Employee[] {
  const coverageEmployeeIds = getCoverageEntriesByDate(date).map((c) => c.employeeId)
  return employees.filter(
    (emp) => emp.status === "active" && !coverageEmployeeIds.includes(emp.id) && ["2", "4", "5"].includes(emp.id), // Michael Chen, David Kim, Jessica Williams
  )
}

export function getDepartmentBreakStats(department: string): BreakStats {
  const deptEmployees = employees.filter((emp) => emp.department === department)
  const deptBreaks = breakEntries.filter((entry) => deptEmployees.some((emp) => emp.id === entry.employeeId))

  const totalBreaks = deptBreaks.length
  const totalDuration = deptBreaks.reduce((sum, entry) => sum + entry.duration, 0)
  const averageDuration = totalBreaks > 0 ? totalDuration / totalBreaks : 0

  const breaksByType = deptBreaks.reduce(
    (acc, entry) => {
      acc[entry.breakType] = (acc[entry.breakType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalBreaks,
    totalDuration,
    averageDuration,
    breaksByType: {
      lunch: breaksByType.lunch || 0,
      break: breaksByType.break || 0,
      personal: breaksByType.personal || 0,
    },
    complianceRate: 92, // Mock compliance rate
    missedBreaks: Math.floor(totalBreaks * 0.1), // Mock missed breaks
  }
}
