"use client"

import { useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import * as gtag from "@/lib/gtag"

// Main analytics hook
export function useAnalytics() {
  const trackEmployee = useCallback((action: string, label?: string) => {
    gtag.trackEngagement(`employee_${action.toLowerCase().replace(" ", "_")}`, label)
  }, [])

  const trackBreak = useCallback((action: string, label?: string) => {
    gtag.trackEngagement(`break_${action.toLowerCase().replace(" ", "_")}`, label)
  }, [])

  const trackData = useCallback((action: string, label?: string) => {
    gtag.trackEngagement(`data_${action.toLowerCase().replace(" ", "_")}`, label)
  }, [])

  const trackExport = useCallback((format: string, count?: number) => {
    gtag.trackEngagement("export", format, count)
  }, [])

  const trackShare = useCallback((method: string) => {
    gtag.trackEngagement("share", method)
  }, [])

  return {
    trackEmployee,
    trackBreak,
    trackData,
    trackExport,
    trackShare,
  }
}

// Page analytics hook (for backward compatibility)
export function usePageAnalytics(pageName: string) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      gtag.pageview(url)
      gtag.trackEngagement("page_view", pageName)
    }
  }, [pathname, searchParams, pageName])
}

// Data management analytics
export function useDataAnalytics() {
  const trackBackup = useCallback(() => {
    gtag.trackEngagement("data_backup")
  }, [])

  const trackRestore = useCallback(() => {
    gtag.trackEngagement("data_restore")
  }, [])

  const trackImport = useCallback((format: string) => {
    gtag.trackEngagement("data_import", format)
  }, [])

  return {
    trackBackup,
    trackRestore,
    trackImport,
  }
}

// Sharing analytics
export function useSharingAnalytics() {
  const trackEmailSent = useCallback(() => {
    gtag.trackEngagement("share_email_sent")
  }, [])

  const trackLinkCreated = useCallback(() => {
    gtag.trackEngagement("share_link_created")
  }, [])

  const trackAccessGranted = useCallback(() => {
    gtag.trackEngagement("share_access_granted")
  }, [])

  const trackSharedView = useCallback(() => {
    gtag.trackEngagement("share_shared_view")
  }, [])

  return {
    trackEmailSent,
    trackLinkCreated,
    trackAccessGranted,
    trackSharedView,
  }
}

// Performance tracking
export function usePerformanceTracking() {
  const trackLoadTime = useCallback((componentName: string, loadTime: number) => {
    gtag.trackTiming(`${componentName}_load`, loadTime, "Component Performance")
  }, [])

  const trackUserAction = useCallback((actionName: string, duration: number) => {
    gtag.trackTiming(`${actionName}_duration`, duration, "User Actions")
  }, [])

  return {
    trackLoadTime,
    trackUserAction,
  }
}

// Feature engagement tracking
export function useEngagementTracking() {
  const trackFeatureUsage = useCallback((featureName: string, duration?: number) => {
    gtag.trackEngagement(featureName, duration)
  }, [])

  const trackUserFlow = useCallback((flowName: string, stepNumber: number) => {
    gtag.trackEngagement(`${flowName}_step_${stepNumber}`, "User Flow")
  }, [])

  return {
    trackFeatureUsage,
    trackUserFlow,
  }
}

// Search and filter analytics
export function useSearchAnalytics() {
  const trackSearchQuery = useCallback((searchType: string, resultsCount: number) => {
    gtag.trackSearch(searchType, resultsCount)
  }, [])

  const trackFilterUsage = useCallback((filterType: string, filterValue: string) => {
    gtag.trackEngagement(`filter_${filterType}`, `Filter Usage: ${filterValue}`)
  }, [])

  return {
    trackSearchQuery,
    trackFilterUsage,
  }
}

// Error tracking hook
export function useErrorTracking() {
  const trackApplicationError = useCallback((error: Error, context?: string) => {
    gtag.trackError(error.message, context, false)
  }, [])

  const trackFatalError = useCallback((error: Error, context?: string) => {
    gtag.trackError(error.message, context, true)
  }, [])

  return {
    trackApplicationError,
    trackFatalError,
  }
}
