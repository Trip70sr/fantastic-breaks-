"use client"

/**
 * Google Analytics helper for the Employee Break Protocol App
 */

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export function ensureGtag(): void {
  if (typeof window === "undefined") return

  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== "function") {
    window.gtag = function stubGtag(...args: any[]) {
      window.dataLayer.push(args)
    }
  }
}

export const isAnalyticsEnabled = (): boolean => {
  if (!GA_TRACKING_ID) return false
  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics-consent")
  return consent === "accepted"
}

export function initGA(): void {
  ensureGtag()

  if (!GA_TRACKING_ID || typeof window === "undefined") return

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })

  window.gtag("config", GA_TRACKING_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
    cookie_flags: "SameSite=Strict;Secure",
  })

  if (isAnalyticsEnabled()) {
    grantAnalyticsConsent()
  }
}

export function grantAnalyticsConsent(): void {
  ensureGtag()

  if (!GA_TRACKING_ID || typeof window === "undefined") return

  window.gtag("consent", "update", { analytics_storage: "granted" })
}

export const pageview = (url: string): void => {
  if (!isAnalyticsEnabled()) return
  ensureGtag()

  window.gtag("config", GA_TRACKING_ID, { page_path: url })
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}): void => {
  if (!isAnalyticsEnabled()) return
  ensureGtag()

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export const trackEmployeeAction = (action: "add" | "edit" | "delete" | "import", count?: number): void =>
  event({
    action: `employee_${action}`,
    category: "Employee Management",
    label: count ? `count_${count}` : undefined,
    value: count,
  })

export const trackBreakAction = (action: "schedule" | "modify" | "cancel" | "assign_coverage"): void =>
  event({
    action: `break_${action}`,
    category: "Break Management",
  })

export const trackDataAction = (action: "export" | "backup" | "restore" | "import", format?: string): void =>
  event({
    action: `data_${action}`,
    category: "Data Management",
    label: format,
  })

export const trackSharingAction = (action: "email_sent" | "link_created" | "access_granted" | "shared_view"): void =>
  event({
    action,
    category: "Sharing & Collaboration",
  })

export const trackUIAction = (action: string, component: string): void =>
  event({
    action,
    category: "UI Interaction",
    label: component,
  })

export const trackTiming = (name: string, value: number, category = "Performance"): void =>
  event({
    action: "timing_complete",
    category,
    label: name,
    value: Math.round(value),
  })

export const trackEngagement = (feature: string, durationMs?: number): void =>
  event({
    action: "user_engagement",
    category: "Feature Usage",
    label: feature,
    value: durationMs ? Math.round(durationMs / 1000) : undefined,
  })

export const trackSearch = (searchType: string, resultsCount?: number): void =>
  event({
    action: "search",
    category: "Search & Filter",
    label: searchType,
    value: resultsCount,
  })

export const trackError = (message: string, context?: string, fatal = false): void => {
  if (!isAnalyticsEnabled()) return
  ensureGtag()

  window.gtag("event", "exception", {
    description: `${context ? `${context}: ` : ""}${message}`,
    fatal,
  })
}
