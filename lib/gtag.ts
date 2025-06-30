export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Check if Google Analytics is enabled
export const isGAEnabled = !!GA_TRACKING_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const trackPageView = (pageName: string) => {
  if (!isGAEnabled) return

  window.gtag("config", GA_TRACKING_ID, {
    page_title: pageName,
    page_location: window.location.href,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!isGAEnabled) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Employee-specific tracking
export const trackEmployeeAction = (action: string, employeeName?: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "employee_action", {
    event_category: "Employee Management",
    event_label: action,
    custom_parameter_1: employeeName ? "with_name" : "anonymous",
  })
}

// Break-specific tracking
export const trackBreakAction = (action: string, breakType?: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "break_action", {
    event_category: "Break Management",
    event_label: action,
    break_type: breakType,
  })
}

// Data management tracking
export const trackDataAction = (action: string, dataType?: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "data_action", {
    event_category: "Data Management",
    event_label: action,
    data_type: dataType,
  })
}

// Sharing tracking
export const trackShareAction = (action: string, shareType?: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "share_action", {
    event_category: "Sharing",
    event_label: action,
    share_type: shareType,
  })
}

// Export tracking
export const trackExportAction = (exportType: string, recordCount?: number) => {
  if (!isGAEnabled) return

  window.gtag("event", "export_action", {
    event_category: "Data Export",
    event_label: exportType,
    value: recordCount,
  })
}

// User engagement tracking
export const trackUserEngagement = (feature: string, duration?: number) => {
  if (!isGAEnabled) return

  window.gtag("event", "user_engagement", {
    event_category: "User Engagement",
    event_label: feature,
    engagement_time_msec: duration,
  })
}

// Error tracking
export const trackError = (error: string, location: string) => {
  if (!isGAEnabled) return

  window.gtag("event", "exception", {
    description: error,
    fatal: false,
    custom_parameter_1: location,
  })
}

// Consent management
export const grantConsent = () => {
  if (!isGAEnabled) return

  window.gtag("consent", "update", {
    analytics_storage: "granted",
  })
}

export const denyConsent = () => {
  if (!isGAEnabled) return

  window.gtag("consent", "update", {
    analytics_storage: "denied",
  })
}
