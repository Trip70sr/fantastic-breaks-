"use client"

import { useEffect, useCallback } from "react"
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
  // Track page views
  const trackPage = useCallback((pageName: string) => {
    if (isGAEnabled) {
      trackPageView(pageName)
    }
  }, [])

  // Track employee-related actions
  const trackEmployee = useCallback((action: string, employeeName?: string) => {
    if (isGAEnabled) {
      trackEmployeeAction(action, employeeName)
    }
  }, [])

  // Track break-related actions
  const trackBreak = useCallback((action: string, breakType?: string) => {
    if (isGAEnabled) {
      trackBreakAction(action, breakType)
    }
  }, [])

  // Track data management actions
  const trackData = useCallback((action: string, dataType?: string) => {
    if (isGAEnabled) {
      trackDataAction(action, dataType)
    }
  }, [])

  // Track sharing actions
  const trackShare = useCallback((action: string, shareType?: string) => {
    if (isGAEnabled) {
      trackShareAction(action, shareType)
    }
  }, [])

  // Track export actions
  const trackExport = useCallback((exportType: string, recordCount?: number) => {
    if (isGAEnabled) {
      trackExportAction(exportType, recordCount)
    }
  }, [])

  // Track feature usage with timing
  const trackFeatureUsage = useCallback((feature: string, startTime?: number) => {
    if (isGAEnabled && startTime) {
      const duration = Date.now() - startTime
      trackUserEngagement(feature, duration)
    }
  }, [])

  // Track errors
  const trackAppError = useCallback((error: Error, location: string) => {
    if (isGAEnabled) {
      trackError(error.message, location)
    }
  }, [])

  return {
    trackPage,
    trackEmployee,
    trackBreak,
    trackData,
    trackShare,
    trackExport,
    trackFeatureUsage,
    trackAppError,
    isEnabled: isGAEnabled,
  }
}

// Hook for tracking component mount/unmount and user engagement
export function usePageAnalytics(pageName: string) {
  const { trackPage, trackFeatureUsage } = useAnalytics()

  useEffect(() => {
    const startTime = Date.now()
    trackPage(pageName)

    return () => {
      // Track time spent on page when component unmounts
      trackFeatureUsage(pageName, startTime)
    }
  }, [pageName, trackPage, trackFeatureUsage])
}
