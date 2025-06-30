export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export const isGAEnabled = GA_TRACKING_ID.length > 0

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!isGAEnabled) return

  window.gtag("config", GA_TRACKING_ID, {
    page_location: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
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
}) => {
  if (!isGAEnabled) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Custom tracking functions for Employee Break Protocol App
export const trackEmployeeAction = (action: string, label?: string) => {
  event({
    action,
    category: "Employee Management",
    label,
  })
}

export const trackBreakAction = (action: string, label?: string) => {
  event({
    action,
    category: "Break Management",
    label,
  })
}

export const trackDataAction = (action: string, label?: string) => {
  event({
    action,
    category: "Data Management",
    label,
  })
}

export const trackShareAction = (action: string, label?: string) => {
  event({
    action,
    category: "App Sharing",
    label,
  })
}

export const trackExportAction = (exportType: string, recordCount: number) => {
  event({
    action: "Export Data",
    category: "Data Management",
    label: exportType,
    value: recordCount,
  })
}

export const trackPageView = (pageName: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "page_view", {
    page_title: pageName,
    page_location: window.location.href,
  })
}

export const trackUserEngagement = (feature: string, duration?: number) => {
  event({
    action: "User Engagement",
    category: "Feature Usage",
    label: feature,
    value: duration,
  })
}

export const trackError = (error: string, location: string) => {
  event({
    action: "Error Occurred",
    category: "Application Errors",
    label: `${location}: ${error}`,
  })
}

export const grantConsent = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

export const denyConsent = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    })
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (!isGAEnabled || typeof window === "undefined") return

  // Load gtag script
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag("js", new Date())
  window.gtag("config", GA_TRACKING_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

// Track events with enhanced privacy
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!isGAEnabled) return

  window.gtag("event", eventName, {
    ...parameters,
    // Ensure no personal data is tracked
    anonymize_ip: true,
  })
}

// Check if analytics is enabled and user has consented
export const isAnalyticsEnabled = () => {
  if (!isGAEnabled) return false

  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics-consent")
  return consent === "accepted"
}
