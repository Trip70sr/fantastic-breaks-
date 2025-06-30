export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  }
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
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track user interactions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...parameters,
      app_name: "Employee Break Protocol",
      app_version: "1.0.0",
    })
  }
}

// Track errors
export const trackError = (error: string, fatal = false) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "exception", {
      description: error,
      fatal: fatal,
    })
  }
}

// Track timing
export const trackTiming = (name: string, value: number, category?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "timing_complete", {
      name: name,
      value: value,
      event_category: category || "Performance",
    })
  }
}
