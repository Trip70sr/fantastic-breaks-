"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  pageview,
  event,
  trackEmployeeAction,
  trackBreakAction,
  trackDataAction,
  trackSharingAction,
  trackError,
} from "@/lib/gtag"

// Main analytics hook
export const useAnalytics = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return {
    trackEvent: event,
    trackEmployee: trackEmployeeAction,
    trackBreak: trackBreakAction,
    trackData: trackDataAction,
    trackSharing: trackSharingAction,
    trackError: trackError,
  }
}

// Page analytics hook (for backward compatibility)
export const usePageAnalytics = () => {
  return useAnalytics()
}

// Employee management analytics
export const useEmployeeAnalytics = () => {
  const { trackEmployee } = useAnalytics()

  const trackAddEmployee = (department?: string) => {
    trackEmployee("add", department)
  }

  const trackEditEmployee = (department?: string) => {
    trackEmployee("edit", department)
  }

  const trackDeleteEmployee = (department?: string) => {
    trackEmployee("delete", department)
  }

  return {
    trackAddEmployee,
    trackEditEmployee,
    trackDeleteEmployee,
  }
}

// Break management analytics
export const useBreakAnalytics = () => {
  const { trackBreak } = useAnalytics()

  const trackScheduleBreak = () => {
    trackBreak("schedule")
  }

  const trackModifyBreak = () => {
    trackBreak("modify")
  }

  const trackCancelBreak = () => {
    trackBreak("cancel")
  }

  return {
    trackScheduleBreak,
    trackModifyBreak,
    trackCancelBreak,
  }
}

// Data management analytics
export const useDataAnalytics = () => {
  const { trackData } = useAnalytics()

  const trackExportData = () => {
    trackData("export")
  }

  const trackBackupData = () => {
    trackData("backup")
  }

  const trackRestoreData = () => {
    trackData("restore")
  }

  return {
    trackExportData,
    trackBackupData,
    trackRestoreData,
  }
}
