"use client"

import { useState, useEffect } from "react"
import AdminAnalyticsLayout from "@/components/admin-analytics-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ComplianceMonitor from "@/components/compliance-monitor"
import RevenueDashboard from "@/components/revenue-dashboard"
import AdminReports from "@/components/admin-reports"
import NotificationSettings from "@/components/notification-settings"
import NotificationHistory from "@/components/notification-history"
import { loadBreakEntries, loadEmployees } from "@/lib/data"
import { loadViolations } from "@/lib/compliance-storage"

export default function AdminPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [breakEntries, setBreakEntries] = useState<any[]>([])
  const [violations, setViolations] = useState<any[]>([])

  useEffect(() => {
    setEmployees(loadEmployees())
    setBreakEntries(loadBreakEntries())
    setViolations(loadViolations())
  }, [])

  return (
    <AdminAnalyticsLayout>
      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

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
  )
}
