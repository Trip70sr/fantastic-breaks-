export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    // Set default consent state
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })

    // Configure Google Analytics
    window.gtag("config", GA_TRACKING_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: "SameSite=Strict;Secure",
    })
  }
}

// Grant consent for analytics
export const grantAnalyticsConsent = () => {
  if (typeof window !== "undefined") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
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
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track employee management actions
export const trackEmployeeAction = (action: "add" | "edit" | "delete", department?: string) => {
  event({
    action: `employee_${action}`,
    category: "Employee Management",
    label: department || "unknown",
  })
}

// Track break scheduling
export const trackBreakAction = (action: "schedule" | "modify" | "cancel") => {
  event({
    action: `break_${action}`,
    category: "Break Management",
  })
}

// Track data operations
export const trackDataAction = (action: "export" | "backup" | "restore") => {
  event({
    action: `data_${action}`,
    category: "Data Management",
  })
}

// Track sharing actions
export const trackSharingAction = (action: "email_sent" | "link_created" | "access_granted") => {
  event({
    action,
    category: "Sharing",
  })
}

// Track errors
export const trackError = (error: string, context?: string) => {
  event({
    action: "error_occurred",
    category: "Error",
    label: `${error}${context ? ` - ${context}` : ""}`,
  })
}
