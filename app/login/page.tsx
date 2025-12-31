"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticateEmployee, initializeEmployeeAccounts } from "@/lib/employee-auth"
import { authenticateAdmin, initializeAdminAccount } from "@/lib/admin-auth"
import { Shield, Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [employeeUsername, setEmployeeUsername] = useState("")
  const [employeePassword, setEmployeePassword] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize accounts on component mount
  useState(() => {
    initializeEmployeeAccounts()
    initializeAdminAccount()
  })

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const session = authenticateEmployee(employeeUsername, employeePassword)
      if (session) {
        // Redirect based on role
        if (session.role === "manager") {
          router.push("/employee-dashboard")
        } else {
          router.push("/employee-dashboard")
        }
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = authenticateAdmin(adminUsername, adminPassword)
      if (success) {
        router.push("/admin")
      } else {
        setError("Invalid admin credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Employee Break Protocol</h1>
          <p className="text-lg text-blue-700">Sign in to continue</p>
        </div>

        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee">
              <Users className="w-4 h-4 mr-2" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>Sign in to manage your work hours and break schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmployeeLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-username">Username</Label>
                    <Input
                      id="employee-username"
                      type="text"
                      placeholder="Enter your username"
                      value={employeeUsername}
                      onChange={(e) => setEmployeeUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <Input
                      id="employee-password"
                      type="password"
                      placeholder="Enter your password"
                      value={employeePassword}
                      onChange={(e) => setEmployeePassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">Demo: sarah.johnson / employee123</div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Login</CardTitle>
                <CardDescription>Access administrative features and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">Demo: admin / admin123</div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
