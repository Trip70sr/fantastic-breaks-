"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  trackPageView,
  trackEvent,
  trackEmployeeAction,
  trackBreakAction,
  trackDataAction,
  trackSharingAction,
  trackError,
  trackEngagement,
  isAnalyticsEnabled,
} from "@/lib/gtag"

// Main analytics hook
export const useAnalytics = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (isAnalyticsEnabled()) {
      trackPageView(window.location.href)
    }
  }, [pathname])

  return {
    trackEvent,
    trackEmployeeAction,
    trackBreakAction,
    trackDataAction,
    trackSharingAction,
    trackError,
    trackEngagement,
    isEnabled: isAnalyticsEnabled(),
  }
}

// Page analytics hook (for backward compatibility)
export const usePageAnalytics = () => {
  return useAnalytics()
}

// Employee management analytics
export const useEmployeeAnalytics = () => {
  const { trackEmployeeAction, trackError } = useAnalytics()

  return {
    trackAdd: (department?: string) => trackEmployeeAction("add", department),
    trackEdit: (department?: string) => trackEmployeeAction("edit", department),
    trackDelete: (department?: string) => trackEmployeeAction("delete", department),
    trackError: (error: string) => trackError(error, "employee_management"),
  }
}

// Break management analytics
export const useBreakAnalytics = () => {
  const { trackBreakAction, trackError } = useAnalytics()

  return {
    trackSchedule: () => trackBreakAction("schedule"),
    trackModify: () => trackBreakAction("modify"),
    trackDelete: () => trackBreakAction("delete"),
    trackError: (error: string) => trackError(error, "break_management"),
  }
}

// Data management analytics
export const useDataAnalytics = () => {
  const { trackDataAction, trackError } = useAnalytics()

  return {
    trackExport: (format: string) => trackDataAction("export", format),
    trackBackup: () => trackDataAction("backup"),
    trackRestore: () => trackDataAction("restore"),
    trackError: (error: string) => trackError(error, "data_management"),
  }
}

// Sharing analytics
export const useSharingAnalytics = () => {
  const { trackSharingAction, trackError } = useAnalytics()

  return {
    trackEmailSent: () => trackSharingAction("email_sent"),
    trackLinkGenerated: () => trackSharingAction("link_generated"),
    trackError: (error: string) => trackError(error, "app_sharing"),
  }
}
