declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "consent" | "js",
      targetId: string | "default" | "update" | Date,
      config?: {
        // Page tracking
        page_path?: string
        page_title?: string
        page_location?: string
        send_page_view?: boolean

        // Privacy settings
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
        cookie_flags?: string

        // Event parameters
        event_category?: string
        event_label?: string
        value?: number

        // Consent parameters
        analytics_storage?: "granted" | "denied"
        ad_storage?: "granted" | "denied"
        ad_user_data?: "granted" | "denied"
        ad_personalization?: "granted" | "denied"

        // Exception parameters
        description?: string
        fatal?: boolean

        // Custom parameters
        [key: string]: any
      },
    ) => void
    dataLayer: any[]
  }
}

export {}
