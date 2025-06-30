declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "consent" | "js",
      targetId: string | Date,
      config?: {
        // Page tracking
        page_path?: string

        // Event parameters
        event_category?: string
        event_label?: string
        value?: number

        // Privacy settings
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean

        // Consent parameters
        analytics_storage?: "granted" | "denied"
        ad_storage?: "granted" | "denied"
        ad_user_data?: "granted" | "denied"
        ad_personalization?: "granted" | "denied"

        // Custom parameters
        [key: string]: any
      },
    ) => void
    dataLayer: any[]
  }
}

export {}
