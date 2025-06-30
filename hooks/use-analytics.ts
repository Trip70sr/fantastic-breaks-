"use client"

import { useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import {
  pageview,
  event,
  trackEmployeeAction,
  trackBreakAction,
  trackDataAction,
  trackSharingAction,
  trackUIAction,
  trackError,
  trackTiming,
  trackEngagement,
  trackSearch,
  isAnalyticsEnabled,
} from "@/lib/gtag"

// Main analytics hook
export const useAnalytics = () => {
  const pathname = usePathname()

  // Track page views automatically
  useEffect(() => {
    if (pathname && isAnalyticsEnabled()) {
      pageview(pathname)
    }
  }, [pathname])

  // Memoized tracking functions
  const trackEvent = useCallback(event, [])
  const trackEmployee = useCallback(trackEmployeeAction, [])
  const trackBreak = useCallback(trackBreakAction, [])
  const trackData = useCallback(trackDataAction, [])
  const trackSharing = useCallback(trackSharingAction, [])
  const trackUI = useCallback(trackUIAction, [])
  const trackAppError = useCallback(trackError, [])
  const trackPerformance = useCallback(trackTiming, [])
  const trackFeatureUsage = useCallback(trackEngagement, [])
  const trackSearchAction = useCallback(trackSearch, [])

  return {
    // Core tracking functions
    trackEvent,
    trackEmployee,
    trackBreak,
    trackData,
    trackSharing,
    trackUI,
    trackError: trackAppError,
    trackTiming: trackPerformance,
    trackEngagement: trackFeatureUsage,
    trackSearch: trackSearchAction,

    // Utility
    isEnabled: isAnalyticsEnabled(),
  }
}

// Page analytics hook (for backward compatibility)
export const usePageAnalytics = () => {
  return useAnalytics()
}

// Specialized hooks for different parts of the app

// Employee management analytics
export const useEmployeeAnalytics = () => {
  const { trackEmployee, trackError } = useAnalytics()

  return {
    trackAddEmployee: useCallback(() => trackEmployee("add"), [trackEmployee]),
    trackEditEmployee: useCallback(() => trackEmployee("edit"), [trackEmployee]),
    trackDeleteEmployee: useCallback(() => trackEmployee("delete"), [trackEmployee]),
    trackBulkImport: useCallback((count: number) => trackEmployee("import", count), [trackEmployee]),
    trackError: useCallback((error: string) => trackError(error, "Employee Management"), [trackError]),
  }
}

// Break management analytics
export const useBreakAnalytics = () => {
  const { trackBreak, trackError } = useAnalytics()

  return {
    trackScheduleBreak: useCallback(() => trackBreak("schedule"), [trackBreak]),
    trackModifyBreak: useCallback(() => trackBreak("modify"), [trackBreak]),
    trackCancelBreak: useCallback(() => trackBreak("cancel"), [trackBreak]),
    trackAssignCoverage: useCallback(() => trackBreak("assign_coverage"), [trackBreak]),
    trackError: useCallback((error: string) => trackError(error, "Break Management"), [trackError]),
  }
}

// Data management analytics
export const useDataAnalytics = () => {
  const { trackData, trackError } = useAnalytics()

  return {
    trackExportData: useCallback((format: string) => trackData("export", format), [trackData]),
    trackBackupData: useCallback(() => trackData("backup"), [trackData]),
    trackRestoreData: useCallback(() => trackData("restore"), [trackData]),
    trackImportData: useCallback((format: string) => trackData("import", format), [trackData]),
    trackError: useCallback((error: string) => trackError(error, "Data Management"), [trackError]),
  }
}

// Sharing analytics
export const useSharingAnalytics = () => {
  const { trackSharing, trackError } = useAnalytics()

  return {
    trackEmailSent: useCallback(() => trackSharing("email_sent"), [trackSharing]),
    trackLinkCreated: useCallback(() => trackSharing("link_created"), [trackSharing]),
    trackAccessGranted: useCallback(() => trackSharing("access_granted"), [trackSharing]),
    trackSharedView: useCallback(() => trackSharing("shared_view"), [trackSharing]),
    trackError: useCallback((error: string) => trackError(error, "Sharing"), [trackError]),
  }
}

// Performance tracking hook
export const usePerformanceTracking = () => {
  const { trackTiming } = useAnalytics()

  const trackComponentLoad = useCallback(
    (componentName: string, loadTime: number) => {
      trackTiming(`${componentName}_load`, loadTime, "Component Performance")
    },
    [trackTiming],
  )

  const trackDataLoad = useCallback(
    (dataType: string, loadTime: number) => {
      trackTiming(`${dataType}_data_load`, loadTime, "Data Loading")
    },
    [trackTiming],
  )

  const trackUserAction = useCallback(
    (actionName: string, duration: number) => {
      trackTiming(`${actionName}_duration`, duration, "User Actions")
    },
    [trackTiming],
  )

  return {
    trackComponentLoad,
    trackDataLoad,
    trackUserAction,
  }
}

// Search and filtering analytics
export const useSearchAnalytics = () => {
  const { trackSearch } = useAnalytics()

  return {
    trackEmployeeSearch: useCallback(
      (resultsCount: number) => {
        trackSearch("employee_search", resultsCount)
      },
      [trackSearch],
    ),

    trackBreakFilter: useCallback(
      (filterType: string, resultsCount: number) => {
        trackSearch(`break_filter_${filterType}`, resultsCount)
      },
      [trackSearch],
    ),

    trackDateRangeFilter: useCallback(
      (resultsCount: number) => {
        trackSearch("date_range_filter", resultsCount)
      },
      [trackSearch],
    ),
  }
}
