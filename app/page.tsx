import BreakTimesheetTable from "@/components/break-timesheet-table"
import { EmployeeManagement } from "@/components/employee-management"
import { DataBackupRestore } from "@/components/data-backup-restore"
import { EmailSharing } from "@/components/email-sharing"
import { TestShareDemo } from "@/components/test-share-demo"
import { ManagementAccess } from "@/components/management-access"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Shield, Database, Mail, TestTube } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Employee Break Management System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Efficiently manage employee break schedules, coverage assignments, and ensure proper staffing coverage
            throughout the day.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Real-time Tracking
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              Coverage Management
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Secure Access
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="timesheet" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="timesheet" className="gap-2">
              <Clock className="h-4 w-4" />
              Timesheet
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="management" className="gap-2">
              <Shield className="h-4 w-4" />
              Management
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Database className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="sharing" className="gap-2">
              <Mail className="h-4 w-4" />
              Sharing
            </TabsTrigger>
            <TabsTrigger value="testing" className="gap-2">
              <TestTube className="h-4 w-4" />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timesheet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Break Coverage Timesheet
                </CardTitle>
                <CardDescription>
                  View and manage all employee break schedules and coverage assignments. Red highlighting indicates
                  missing coverage that needs attention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BreakTimesheetTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Management
                </CardTitle>
                <CardDescription>
                  Add, edit, and manage employee information including departments, positions, and work status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Management Access
                </CardTitle>
                <CardDescription>
                  Advanced management tools and analytics for supervisors and administrators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManagementAccess />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Backup & Restore
                </CardTitle>
                <CardDescription>
                  Export your data for backup purposes or import data from previous backups.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataBackupRestore />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Sharing
                </CardTitle>
                <CardDescription>
                  Share break schedules and coverage information via email with team members and managers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailSharing />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Testing & Demo
                </CardTitle>
                <CardDescription>
                  Test the sharing functionality and demo features for development and quality assurance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestShareDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
