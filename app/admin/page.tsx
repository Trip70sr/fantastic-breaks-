"use client"

import AdminAnalyticsLayout from "@/components/admin-analytics-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingDown, FileText, Bell } from "lucide-react"

export default function AdminPage() {
  return (
    <AdminAnalyticsLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Admin Analytics Dashboard</h2>
          <p className="text-blue-700">Access compliance analytics, revenue loss tracking, and automated reporting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <Shield className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Compliance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Monitor Colorado break law compliance and violation patterns</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <TrendingDown className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle className="text-lg">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track lost revenue from excessive breaks and unauthorized time off</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Generate daily and monthly compliance and revenue reports</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Bell className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Configure email alerts for excessive break violations</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The admin analytics portal provides advanced features for tracking break compliance and calculating
              revenue impact. Features include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Colorado state break law compliance monitoring</li>
              <li>Automatic violation detection for excessive breaks</li>
              <li>Revenue loss calculations based on unauthorized break time</li>
              <li>Daily and monthly reporting with exportable data</li>
              <li>Configurable email notifications for violations</li>
              <li>Threshold-based alerting system</li>
            </ul>
            <p className="text-sm text-blue-600 font-medium mt-4">
              Next: Complete setup of compliance engine and revenue tracking systems
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminAnalyticsLayout>
  )
}
