"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"
import { isAdminAuthenticated, logoutAdmin, getAdminSession, initializeAdminAccount } from "@/lib/admin-auth"
import AdminLogin from "@/components/admin-login"

interface AdminAnalyticsLayoutProps {
  children: React.ReactNode
}

export default function AdminAnalyticsLayout({ children }: AdminAnalyticsLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminInfo, setAdminInfo] = useState<{ username: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAdminAccount()
    const authenticated = isAdminAuthenticated()
    setIsAuthenticated(authenticated)

    if (authenticated) {
      setAdminInfo(getAdminSession())
    }

    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setAdminInfo(getAdminSession())
  }

  const handleLogout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
    setAdminInfo(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-aquamarine-50">
        <div className="spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50">
      <header className="bg-white border-b border-blue-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-blue-900">Admin Analytics Portal</h1>
                <p className="text-xs text-blue-600">Compliance & Revenue Tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {adminInfo && (
                <div className="text-sm text-right">
                  <div className="font-medium text-blue-900">{adminInfo.username}</div>
                  <div className="text-xs text-blue-600">{adminInfo.role.replace("_", " ")}</div>
                </div>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
