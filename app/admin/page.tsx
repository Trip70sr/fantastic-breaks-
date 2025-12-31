"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { isAdminAuthenticated, logoutAdmin, getAdminSession } from "@/lib/admin-auth"
import AdminAnalyticsLayout from "@/components/admin-analytics-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ComplianceMonitor from "@/components/compliance-monitor"
import RevenueDashboard from "@/components/revenue-dashboard"
import AdminReports from "@/components/admin-reports"
import NotificationSettings from "@/components/notification-settings"
import NotificationHistory from "@/components/notification-history"
import EmployeeManagement from "@/components/employee-management"
import { loadBreakEntries, loadEmployees, saveEmployees, saveBreakEntries } from "@/lib/data"
import { loadViolations } from "@/lib/compliance-storage"
import type { Employee, BreakEntry } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [breakEntries, setBreakEntries] = useState<BreakEntry[]>([])
  const [violations, setViolations] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/login")
      return
    }

    setSession(getAdminSession())
    setEmployees(loadEmployees())
    setBreakEntries(loadBreakEntries())
    setViolations(loadViolations())
  }, [router])

  const handleLogout = () => {
    logoutAdmin()
    router.push("/login")
  }

  const handleRefreshData = () => {
    setEmployees(loadEmployees())
    setBreakEntries(loadBreakEntries())
    setViolations(loadViolations())
  }

  const handleAddEmployee = (employee: Employee) => {
    const updatedEmployees = [...employees, employee]
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
  }

  const handleUpdateEmployee = (employee: Employee) => {
    const updatedEmployees = employees.map((e) => (e.id === employee.id ? employee : e))
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
  }

  const handleDeleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((e) => e.id !== id)
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)

    // Also remove break entries for this employee
    const updatedEntries = breakEntries.filter((e) => e.employeeId !== id)
    setBreakEntries(updatedEntries)
    saveBreakEntries(updatedEntries)
  }

  const handleAddBreakEntry = (entry: BreakEntry) => {
    const updatedEntries = [...breakEntries, entry]
    setBreakEntries(updatedEntries)
    saveBreakEntries(updatedEntries)
  }

  const handleUpdateBreakEntry = (entry: BreakEntry) => {
    const updatedEntries = breakEntries.map((e) => (e.id === entry.id ? entry : e))
    setBreakEntries(updatedEntries)
    saveBreakEntries(updatedEntries)
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-blue-700">
              Welcome, {session.username} ({session.role})
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <AdminAnalyticsLayout>
          <Tabs defaultValue="employees" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="employees">
              <EmployeeManagement
                isOpen={true}
                onClose={() => {}}
                employees={employees}
                breakEntries={breakEntries}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onAddBreakEntry={handleAddBreakEntry}
                onUpdateBreakEntry={handleUpdateBreakEntry}
              />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceMonitor employees={employees} breakEntries={breakEntries} />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueDashboard violations={violations} employees={employees} />
            </TabsContent>

            <TabsContent value="reports">
              <AdminReports violations={violations} employees={employees} breakEntries={breakEntries} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="history">
              <NotificationHistory />
            </TabsContent>
          </Tabs>
        </AdminAnalyticsLayout>
      </div>
    </div>
  )
}
