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
import { loadBreakEntries, loadEmployees } from "@/lib/data"
import { loadViolations } from "@/lib/compliance-storage"

export default function AdminPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [breakEntries, setBreakEntries] = useState<any[]>([])
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
              <EmployeeManagement isOpen={true} onClose={() => {}} onUpdate={handleRefreshData} />
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
