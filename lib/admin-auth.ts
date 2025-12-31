"use client"

import type { AdminCredentials } from "./types"

const ADMIN_CREDENTIALS_KEY = "admin_credentials"
const ADMIN_SESSION_KEY = "admin_session"
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export type AdminRole = "manager" | "hr_admin" | "admin" | "director"

export interface AdminPermissions {
  viewReports: boolean
  editEmployees: boolean
  configureSettings: boolean
  accessAuditTrail: boolean
  manageUsers: boolean
  exportData: boolean
}

export function initializeAdminAccount(): void {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem(ADMIN_CREDENTIALS_KEY)
  if (!existing) {
    // Create default admin account
    const defaultAdmin: AdminCredentials = {
      username: "admin",
      passwordHash: simpleHash("admin123"),
      role: "admin",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify([defaultAdmin]))
  }
}

export function authenticateAdmin(username: string, password: string): boolean {
  if (typeof window === "undefined") return false

  const credentialsData = localStorage.getItem(ADMIN_CREDENTIALS_KEY)
  if (!credentialsData) return false

  const credentials: AdminCredentials[] = JSON.parse(credentialsData)
  const admin = credentials.find((c) => c.username === username && c.passwordHash === simpleHash(password))

  if (admin) {
    // Create session
    const session = {
      username: admin.username,
      role: admin.role,
      loginTime: Date.now(),
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))

    // Update last login
    const updatedCredentials = credentials.map((c) =>
      c.username === username ? { ...c, lastLogin: new Date().toISOString() } : c,
    )
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updatedCredentials))

    return true
  }

  return false
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!sessionData) return false

  const session = JSON.parse(sessionData)
  const now = Date.now()

  // Check if session has expired
  if (now - session.loginTime > SESSION_TIMEOUT) {
    logoutAdmin()
    return false
  }

  return true
}

export function getAdminSession(): { username: string; role: string } | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!sessionData) return null

  return JSON.parse(sessionData)
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function getPermissions(role: AdminRole): AdminPermissions {
  switch (role) {
    case "manager":
      return {
        viewReports: true,
        editEmployees: false,
        configureSettings: false,
        accessAuditTrail: false,
        manageUsers: false,
        exportData: true,
      }
    case "hr_admin":
      return {
        viewReports: true,
        editEmployees: true,
        configureSettings: true,
        accessAuditTrail: true,
        manageUsers: false,
        exportData: true,
      }
    case "director":
      return {
        viewReports: true,
        editEmployees: true,
        configureSettings: true,
        accessAuditTrail: true,
        manageUsers: false,
        exportData: true,
      }
    case "admin":
      return {
        viewReports: true,
        editEmployees: true,
        configureSettings: true,
        accessAuditTrail: true,
        manageUsers: true,
        exportData: true,
      }
    default:
      console.warn("[v0] Unknown role:", role)
      return {
        viewReports: false,
        editEmployees: false,
        configureSettings: false,
        accessAuditTrail: false,
        manageUsers: false,
        exportData: false,
      }
  }
}

export function hasPermission(permission: keyof AdminPermissions): boolean {
  const session = getAdminSession()
  if (!session) return false

  const permissions = getPermissions(session.role as AdminRole)
  return permissions[permission]
}

export function changeAdminPassword(username: string, oldPassword: string, newPassword: string): boolean {
  if (typeof window === "undefined") return false

  const credentialsData = localStorage.getItem(ADMIN_CREDENTIALS_KEY)
  if (!credentialsData) return false

  const credentials: AdminCredentials[] = JSON.parse(credentialsData)
  const adminIndex = credentials.findIndex((c) => c.username === username && c.passwordHash === simpleHash(oldPassword))

  if (adminIndex !== -1) {
    credentials[adminIndex].passwordHash = simpleHash(newPassword)
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials))
    return true
  }

  return false
}

export function isDirector(): boolean {
  const session = getAdminSession()
  return session?.role === "director" || session?.role === "admin"
}

export function canManageEmployees(): boolean {
  const session = getAdminSession()
  if (!session) {
    console.log("[v0] canManageEmployees: No session found")
    return false
  }

  const role = session.role as AdminRole
  console.log("[v0] canManageEmployees: Checking role", role)

  const permissions = getPermissions(role)
  if (!permissions) {
    console.warn("[v0] canManageEmployees: No permissions found for role", role)
    return false
  }

  console.log("[v0] canManageEmployees: editEmployees =", permissions.editEmployees)
  return permissions.editEmployees
}

export function isManagementRole(): boolean {
  const session = getAdminSession()
  if (!session) return false

  const managementRoles: AdminRole[] = ["manager", "hr_admin", "admin", "director"]
  return managementRoles.includes(session.role as AdminRole)
}
