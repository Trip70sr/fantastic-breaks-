export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// ---------------------------------------------------------------------------
// Make sure window.gtag always exists so early calls don't crash
// ---------------------------------------------------------------------------
export const ensureGtag = () => {
  if (typeof window === "undefined") return

  // Create dataLayer if it doesn't exist
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – dataLayer is added by GA
  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      // Push arguments to dataLayer so GA can replay the queue later
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.dataLayer.push(args)
    }
  }
}

// Check if analytics is enabled
export const isAnalyticsEnabled = (): boolean => {
  if (!GA_TRACKING_ID) return false
  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics-consent")
  return consent === "accepted"
}

// Initialize Google Analytics
export const initGA = () => {
  ensureGtag()
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    // Set default consent state (denied until user accepts)
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })

    // Configure Google Analytics with privacy settings
    window.gtag("config", GA_TRACKING_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: "SameSite=Strict;Secure",
      send_page_view: false, // We'll send page views manually
    })

    // Check if user has already consented
    const consent = localStorage.getItem("analytics-consent")
    if (consent === "accepted") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
  }
}

// Grant consent for analytics
export const grantAnalyticsConsent = () => {
  ensureGtag()
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

// Track page views
export const pageview = (url: string) => {
  ensureGtag()
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

// Track custom events
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
  ensureGtag()
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Specific tracking functions for the Employee Break App

// Track employee management actions (anonymized)
export const trackEmployeeAction = (action: "add" | "edit" | "delete" | "import", count?: number) => {
  ensureGtag()
  event({
    action: `employee_${action}`,
    category: "Employee Management",
    label: count ? `count_${count}` : undefined,
    value: count,
  })
}

// Track break scheduling actions
export const trackBreakAction = (action: "schedule" | "modify" | "cancel" | "assign_coverage") => {
  ensureGtag()
  event({
    action: `break_${action}`,
    category: "Break Management",
  })
}

// Track data operations
export const trackDataAction = (action: "export" | "backup" | "restore" | "import", format?: string) => {
  ensureGtag()
  event({
    action: `data_${action}`,
    category: "Data Management",
    label: format,
  })
}

// Track sharing and collaboration
export const trackSharingAction = (action: "email_sent" | "link_created" | "access_granted" | "shared_view") => {
  ensureGtag()
  event({
    action,
    category: "Sharing & Collaboration",
  })
}

// Track user interface interactions
export const trackUIAction = (action: string, component: string) => {
  ensureGtag()
  event({
    action,
    category: "UI Interaction",
    label: component,
  })
}

// Track errors (anonymized, no sensitive data)
export const trackError = (error: string, context?: string, fatal = false) => {
  ensureGtag()
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("event", "exception", {
    description: `${context ? `${context}: ` : ""}${error}`,
    fatal,
  })
}

// Track performance metrics
export const trackTiming = (name: string, value: number, category = "Performance") => {
  ensureGtag()
  event({
    action: "timing_complete",
    category,
    label: name,
    value: Math.round(value),
  })
}

// Track user engagement
export const trackEngagement = (feature: string, duration?: number) => {
  ensureGtag()
  event({
    action: "user_engagement",
    category: "Feature Usage",
    label: feature,
    value: duration ? Math.round(duration / 1000) : undefined, // Convert to seconds
  })
}

// Track search and filtering
export const trackSearch = (searchType: string, resultsCount?: number) => {
  ensureGtag()
  event({
    action: "search",
    category: "Search & Filter",
    label: searchType,
    value: resultsCount,
  })
}
