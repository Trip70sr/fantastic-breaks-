// Ensure gtag is available even before Google Analytics loads
function ensureGtag() {
  if (typeof window !== "undefined" && !window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }
}

// Initialize gtag immediately
ensureGtag()

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// Page view tracking
export const pageview = (url: string) => {
  ensureGtag()
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Event tracking
export const event = (action: string, category: string, label?: string, value?: number) => {
  ensureGtag()
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Grant analytics consent
export const grantAnalyticsConsent = () => {
  ensureGtag()
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

// Initialize Google Analytics with privacy settings
export const initGA = () => {
  ensureGtag()
  if (GA_TRACKING_ID && window.gtag) {
    // Set default consent state
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })

    // Configure GA
    window.gtag("config", GA_TRACKING_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  }
}
