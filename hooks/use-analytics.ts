"use client"

import { useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import {
  trackEmployeeAction,
  trackBreakAction,
  trackDataAction,
  trackShareAction,
  trackExportAction,
  trackPageView,
  trackUserEngagement,
  trackError,
  isGAEnabled,
} from "@/lib/gtag"

export function useAnalytics() {
  const pathname = usePathname()

  // Track page views
  useEffect(() => {
    if (!isGAEnabled) return

    const consent = localStorage.getItem("analytics-consent")
    if (consent !== "true") return

    // Map pathname to readable page names
    const pageMap: Record<string, string> = {
      "/": "Dashboard",
      "/shared": "Shared Access",
      "/management": "Management Dashboard",
    }

    const pageName = pageMap[pathname] || pathname
    trackPageView(pageName)
  }, [pathname])

  // Analytics tracking functions
  const analytics = {
    // Employee management tracking
    trackAddEmployee: useCallback((employeeName: string) => {
      trackEmployeeAction("Add Employee", employeeName)
    }, []),

    trackEditEmployee: useCallback((employeeName: string) => {
      trackEmployeeAction("Edit Employee", employeeName)
    }, []),

    trackDeleteEmployee: useCallback((employeeName: string) => {
      trackEmployeeAction("Delete Employee", employeeName)
    }, []),

    trackBulkEmployeeImport: useCallback((count: number) => {
      trackEmployeeAction("Bulk Import", `${count} employees`)
    }, []),

    // Break management tracking
    trackScheduleBreak: useCallback((breakType: string) => {
      trackBreakAction("Schedule Break", breakType)
    }, []),

    trackModifyBreak: useCallback((breakType: string) => {
      trackBreakAction("Modify Break", breakType)
    }, []),

    trackDeleteBreak: useCallback((breakType: string) => {
      trackBreakAction("Delete Break", breakType)
    }, []),

    trackAssignCoverage: useCallback(() => {
      trackBreakAction("Assign Coverage")
    }, []),

    // Data management tracking
    trackDataExport: useCallback((exportType: string, recordCount: number) => {
      trackExportAction(exportType, recordCount)
    }, []),

    trackDataBackup: useCallback(() => {
      trackDataAction("Backup Data")
    }, []),

    trackDataRestore: useCallback(() => {
      trackDataAction("Restore Data")
    }, []),

    trackDataImport: useCallback((importType: string) => {
      trackDataAction("Import Data", importType)
    }, []),

    // Sharing and collaboration tracking
    trackShareApp: useCallback((shareMethod: string) => {
      trackShareAction("Share App", shareMethod)
    }, []),

    trackAccessSharedApp: useCallback(() => {
      trackShareAction("Access Shared App")
    }, []),

    trackGenerateShareLink: useCallback(() => {
      trackShareAction("Generate Share Link")
    }, []),

    // User engagement tracking
    trackFeatureUsage: useCallback((feature: string, duration?: number) => {
      trackUserEngagement(feature, duration)
    }, []),

    trackDashboardView: useCallback((viewType: string) => {
      trackUserEngagement("Dashboard View", undefined)
    }, []),

    trackFilterUsage: useCallback((filterType: string) => {
      trackUserEngagement("Filter Usage", undefined)
    }, []),

    trackSearchUsage: useCallback((searchTerm: string) => {
      trackUserEngagement("Search Usage", undefined)
    }, []),

    // Error tracking
    trackError: useCallback((error: string, location: string) => {
      trackError(error, location)
    }, []),

    trackFormError: useCallback((formName: string, errorMessage: string) => {
      trackError(`Form Error: ${errorMessage}`, formName)
    }, []),

    trackApiError: useCallback((endpoint: string, errorCode: string) => {
      trackError(`API Error: ${errorCode}`, endpoint)
    }, []),

    // Privacy and consent tracking
    trackConsentGiven: useCallback(() => {
      trackUserEngagement("Analytics Consent Given")
    }, []),

    trackConsentDeclined: useCallback(() => {
      trackUserEngagement("Analytics Consent Declined")
    }, []),

    trackPrivacyPolicyView: useCallback(() => {
      trackUserEngagement("Privacy Policy Viewed")
    }, []),

    // Performance tracking
    trackLoadTime: useCallback((componentName: string, loadTime: number) => {
      trackUserEngagement("Component Load Time", loadTime)
    }, []),

    trackUserSession: useCallback((sessionDuration: number) => {
      trackUserEngagement("Session Duration", sessionDuration)
    }, []),
  }

  return analytics
}

// Hook for tracking component mount/unmount times
export function useComponentTracking(componentName: string) {
  const analytics = useAnalytics()

  useEffect(() => {
    const startTime = Date.now()

    return () => {
      const endTime = Date.now()
      const duration = endTime - startTime
      analytics.trackLoadTime(componentName, duration)
    }
  }, [componentName, analytics])
}

// Hook for tracking user session duration
export function useSessionTracking() {
  const analytics = useAnalytics()

  useEffect(() => {
    const sessionStart = Date.now()

    const handleBeforeUnload = () => {
      const sessionEnd = Date.now()
      const sessionDuration = Math.round((sessionEnd - sessionStart) / 1000) // in seconds
      analytics.trackUserSession(sessionDuration)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      handleBeforeUnload() // Track session on component unmount
    }
  }, [analytics])
}

/**
 * Alias hook for backwards-compatibility.
 * Components that only need automatic page-view tracking can
 * keep importing usePageAnalytics() without refactoring.
 */
export function usePageAnalytics() {
  // The call below already tracks page-views via its own useEffect.
  // We don’t need the returned helpers, so we intentionally ignore them.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = useAnalytics()
}
