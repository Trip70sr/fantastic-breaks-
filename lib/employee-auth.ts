"use client"

import type { EmployeeCredentials, UserSession } from "./types"

const EMPLOYEE_CREDENTIALS_KEY = "employee_credentials"
const USER_SESSION_KEY = "user_session"
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

export function initializeEmployeeAccounts(): void {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem(EMPLOYEE_CREDENTIALS_KEY)
  if (!existing) {
    // Create default employee accounts
    const defaultEmployees: EmployeeCredentials[] = [
      {
        employeeId: "1",
        username: "sarah.johnson",
        passwordHash: simpleHash("employee123"),
        role: "employee",
        createdAt: new Date().toISOString(),
      },
      {
        employeeId: "2",
        username: "michael.chen",
        passwordHash: simpleHash("employee123"),
        role: "manager",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(EMPLOYEE_CREDENTIALS_KEY, JSON.stringify(defaultEmployees))
  }
}

export function authenticateEmployee(username: string, password: string): UserSession | null {
  if (typeof window === "undefined") return null

  const credentialsData = localStorage.getItem(EMPLOYEE_CREDENTIALS_KEY)
  if (!credentialsData) return null

  const credentials: EmployeeCredentials[] = JSON.parse(credentialsData)
  const employee = credentials.find((c) => c.username === username && c.passwordHash === simpleHash(password))

  if (employee) {
    const session: UserSession = {
      userId: employee.employeeId,
      username: employee.username,
      role: employee.role,
      employeeId: employee.employeeId,
      loginTime: Date.now(),
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session))

    // Update last login
    const updatedCredentials = credentials.map((c) =>
      c.username === username ? { ...c, lastLogin: new Date().toISOString() } : c,
    )
    localStorage.setItem(EMPLOYEE_CREDENTIALS_KEY, JSON.stringify(updatedCredentials))

    return session
  }

  return null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const sessionData = localStorage.getItem(USER_SESSION_KEY)
  if (!sessionData) return false

  const session: UserSession = JSON.parse(sessionData)
  const now = Date.now()

  // Check if session has expired
  if (now - session.loginTime > SESSION_TIMEOUT) {
    logout()
    return false
  }

  return true
}

export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem(USER_SESSION_KEY)
  if (!sessionData) return null

  const session: UserSession = JSON.parse(sessionData)

  // Check if session has expired
  const now = Date.now()
  if (now - session.loginTime > SESSION_TIMEOUT) {
    logout()
    return null
  }

  return session
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_SESSION_KEY)
}

export function createEmployeeAccount(
  employeeId: string,
  username: string,
  password: string,
  role: "employee" | "manager",
): boolean {
  if (typeof window === "undefined") return false

  const credentialsData = localStorage.getItem(EMPLOYEE_CREDENTIALS_KEY)
  const credentials: EmployeeCredentials[] = credentialsData ? JSON.parse(credentialsData) : []

  // Check if username already exists
  if (credentials.some((c) => c.username === username)) {
    return false
  }

  const newEmployee: EmployeeCredentials = {
    employeeId,
    username,
    passwordHash: simpleHash(password),
    role,
    createdAt: new Date().toISOString(),
  }

  credentials.push(newEmployee)
  localStorage.setItem(EMPLOYEE_CREDENTIALS_KEY, JSON.stringify(credentials))
  return true
}

export function isManager(): boolean {
  const session = getUserSession()
  return session?.role === "manager" || isAdminRole()
}

export function isAdminRole(): boolean {
  const session = getUserSession()
  return session?.role === "hr_admin" || session?.role === "admin" || session?.role === "director"
}

export function canAddEmployees(): boolean {
  return isAdminRole()
}

export function canManageBreaks(): boolean {
  const session = getUserSession()
  return session?.role === "manager" || isAdminRole()
}
