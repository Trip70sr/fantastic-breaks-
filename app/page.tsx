"use client"

import { useState, useEffect } from "react"
import { EmployeeBreakDashboard } from "@/components/employee-break-dashboard"
import { initialEmployees, initialBreakEntries } from "@/lib/data"
import type { Employee, BreakEntry } from "@/lib/types"

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([])

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedEmployees = localStorage.getItem("employees")
    const savedBreakEntries = localStorage.getItem("breakEntries")

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      setEmployees(initialEmployees)
      localStorage.setItem("employees", JSON.stringify(initialEmployees))
    }

    if (savedBreakEntries) {
      setBreakEntries(JSON.parse(savedBreakEntries))
    } else {
      setBreakEntries(initialBreakEntries)
      localStorage.setItem("breakEntries", JSON.stringify(initialBreakEntries))
    }
  }, [])

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees)
    localStorage.setItem("employees", JSON.stringify(newEmployees))
  }

  const updateBreakEntries = (newBreakEntries: BreakEntry[]) => {
    setBreakEntries(newBreakEntries)
    localStorage.setItem("breakEntries", JSON.stringify(newBreakEntries))
  }

  return (
    <main className="min-h-screen bg-background">
      <EmployeeBreakDashboard
        employees={employees}
        breakEntries={breakEntries}
        onEmployeesChange={updateEmployees}
        onBreakEntriesChange={updateBreakEntries}
      />
    </main>
  )
}
