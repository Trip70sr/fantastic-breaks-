export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Check if analytics is enabled and user has consented
export const isAnalyticsEnabled = (): boolean => {
  if (!GA_TRACKING_ID) return false
  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics-consent")
  return consent === "accepted"
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (!GA_TRACKING_ID || !isAnalyticsEnabled()) return

  // Load gtag script
  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  // Set default consent state (denied)
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })

  // Configure gtag
  window.gtag("js", new Date())
  window.gtag("config", GA_TRACKING_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_flags: "SameSite=Strict;Secure",
  })

  // Update consent if user has accepted
  if (isAnalyticsEnabled()) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

// Track page views
export const trackPageView = (url: string): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("config", GA_TRACKING_ID, {
    page_location: url,
    anonymize_ip: true,
  })
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    anonymize_ip: true,
  })
}

// Track employee management actions
export const trackEmployeeAction = (action: "add" | "edit" | "delete", department?: string): void => {
  trackEvent(action, "employee_management", department)
}

// Track break management actions
export const trackBreakAction = (action: "schedule" | "modify" | "delete"): void => {
  trackEvent(action, "break_management")
}

// Track data operations
export const trackDataAction = (action: "export" | "backup" | "restore", format?: string): void => {
  trackEvent(action, "data_management", format)
}

// Track app sharing
export const trackSharingAction = (action: "email_sent" | "link_generated"): void => {
  trackEvent(action, "app_sharing")
}

// Track errors (anonymized)
export const trackError = (error: string, component?: string): void => {
  trackEvent("error", "application_error", component, 1)
}

// Track user engagement
export const trackEngagement = (feature: string, duration?: number): void => {
  trackEvent("engagement", "feature_usage", feature, duration)
}
