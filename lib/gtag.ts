// Google Analytics configuration and helper functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// Check if GA_TRACKING_ID is available
export const isGAEnabled = GA_TRACKING_ID && GA_TRACKING_ID !== ""

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

// Custom events for the Employee Break App
export const trackEmployeeAction = (action: string, employeeName?: string) => {
  event({
    action,
    category: "Employee Management",
    label: employeeName,
  })
}

export const trackBreakAction = (action: string, breakType?: string) => {
  event({
    action,
    category: "Break Management",
    label: breakType,
  })
}

export const trackDataAction = (action: string, dataType?: string) => {
  event({
    action,
    category: "Data Management",
    label: dataType,
  })
}

export const trackShareAction = (action: string, shareType?: string) => {
  event({
    action,
    category: "App Sharing",
    label: shareType,
  })
}

export const trackExportAction = (exportType: string, recordCount?: number) => {
  event({
    action: "Export Data",
    category: "Data Export",
    label: exportType,
    value: recordCount,
  })
}

export const trackPageView = (pageName: string) => {
  event({
    action: "Page View",
    category: "Navigation",
    label: pageName,
  })
}

export const trackUserEngagement = (feature: string, duration?: number) => {
  event({
    action: "Feature Usage",
    category: "User Engagement",
    label: feature,
    value: duration,
  })
}

// Track errors
export const trackError = (errorMessage: string, errorLocation: string) => {
  event({
    action: "Error Occurred",
    category: "Errors",
    label: `${errorLocation}: ${errorMessage}`,
  })
}
