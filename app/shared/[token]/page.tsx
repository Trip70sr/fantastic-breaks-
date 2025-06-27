"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import { Shield, AlertCircle, CheckCircle, Clock, Users } from "lucide-react"

interface ShareAccess {
  isValid: boolean
  permissions: "view" | "edit" | "admin"
  email: string
  expiresAt: Date
  isExpired: boolean
  accessCount: number
}

export default function SharedAccessPage() {
  const params = useParams()
  const token = params.token as string
  const [shareAccess, setShareAccess] = useState<ShareAccess | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccepted, setHasAccepted] = useState(false)

  useEffect(() => {
    validateShareToken()
  }, [token])

  // Update the validateShareToken function to handle test tokens
  const validateShareToken = async () => {
    setIsLoading(true)

    // Simulate API call to validate token
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if this is a test token
    const isTestToken = token.startsWith("test_")

    if (isTestToken) {
      // Mock validation for test tokens
      const mockAccess: ShareAccess = {
        isValid: true,
        permissions: "edit", // You can change this to test different permission levels
        email: "test-user@company.com",
        expiresAt: new Date(Date.now() + 86400000 * 25), // 25 days from now
        isExpired: false,
        accessCount: 1,
      }
      setShareAccess(mockAccess)
    } else {
      // Handle real tokens (would validate against database)
      const mockAccess: ShareAccess = {
        isValid: false,
        permissions: "view",
        email: "",
        expiresAt: new Date(),
        isExpired: true,
        accessCount: 0,
      }
      setShareAccess(mockAccess)
    }

    setIsLoading(false)
  }

  const acceptAccess = () => {
    setHasAccepted(true)
    // In a real implementation, this would:
    // 1. Log the access acceptance
    // 2. Increment access count
    // 3. Set up user session with appropriate permissions
  }

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin Access</Badge>
      case "edit":
        return <Badge className="bg-blue-100 text-blue-800">Edit Access</Badge>
      case "view":
        return <Badge className="bg-gray-100 text-gray-800">View Only</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Clock className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Validating Access</h2>
            <p className="text-gray-600 text-center">Please wait while we verify your access link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!shareAccess || !shareAccess.isValid || shareAccess.isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center mb-4">
              {shareAccess?.isExpired
                ? "This access link has expired."
                : "This access link is invalid or has been revoked."}
            </p>
            <p className="text-sm text-gray-500 text-center">
              Please contact the person who shared this link with you for a new access link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              Employee Break Management System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                You have been granted access to the Employee Break Management System.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Access Details</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Permission Level:</span>
                    {getPermissionBadge(shareAccess.permissions)}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Access Expires:</span>
                    <span>{shareAccess.expiresAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Previous Access Count:</span>
                    <span>{shareAccess.accessCount} times</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What You Can Do</h3>
                <div className="bg-green-50 p-4 rounded-md">
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    {shareAccess.permissions === "view" && (
                      <>
                        <li>View employee schedules and break assignments</li>
                        <li>Export data to CSV</li>
                        <li>View management analytics (read-only)</li>
                      </>
                    )}
                    {shareAccess.permissions === "edit" && (
                      <>
                        <li>View and edit employee schedules</li>
                        <li>Add, edit, and delete employee information</li>
                        <li>Modify break schedules and coverage assignments</li>
                        <li>Create and update work schedules</li>
                        <li>Export data and generate reports</li>
                      </>
                    )}
                    {shareAccess.permissions === "admin" && (
                      <>
                        <li>Full access to all system features</li>
                        <li>Access management controls and analytics</li>
                        <li>Backup and restore data</li>
                        <li>Manage notification settings</li>
                        <li>View detailed system reports</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Important Notes</h3>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>You cannot modify the application code or structure</li>
                    <li>You cannot share this access with others</li>
                    <li>Your access is logged and monitored</li>
                    <li>This link will expire on {shareAccess.expiresAt.toLocaleDateString()}</li>
                    <li>Keep this link secure and do not share it</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={acceptAccess} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Access Employee Break System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the full application with restricted permissions
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Employee Break Protocol</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white/20 text-white">Shared Access</Badge>
              {getPermissionBadge(shareAccess.permissions)}
            </div>
          </div>
          <div className="text-white text-sm">
            <div>Access expires: {shareAccess.expiresAt.toLocaleDateString()}</div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <EmployeeBreakDashboard />
      </main>
      <footer className="bg-gray-100 py-4 px-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Trip-tech.art - Shared Access Mode
        </div>
      </footer>
    </div>
  )
}
