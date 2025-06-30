"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { pageview, event, trackEvent, trackTiming } from "@/lib/gtag"

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname, searchParams])

  const trackUserAction = (action: string, category: string, label?: string) => {
    event({ action, category, label })
  }

  const trackFeatureUsage = (featureName: string, details?: Record<string, any>) => {
    trackEvent("feature_used", {
      feature_name: featureName,
      ...details,
    })
  }

  const trackEmployeeAction = (action: string, details?: Record<string, any>) => {
    trackEvent("employee_action", {
      action_type: action,
      ...details,
    })
  }

  const trackDataOperation = (operation: string, details?: Record<string, any>) => {
    trackEvent("data_operation", {
      operation_type: operation,
      ...details,
    })
  }

  const trackError = (error: string, context?: string) => {
    trackError(`${context ? `${context}: ` : ""}${error}`)
  }

  const trackPerformance = (metric: string, value: number) => {
    trackTiming(metric, value, "Performance")
  }

  return {
    trackUserAction,
    trackFeatureUsage,
    trackEmployeeAction,
    trackDataOperation,
    trackError,
    trackPerformance,
  }
}

// Legacy export for backward compatibility
export const usePageAnalytics = useAnalytics
