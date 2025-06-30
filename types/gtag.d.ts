declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "consent",
      targetId: string | "default" | "update",
      config?: {
        page_path?: string
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
        cookie_flags?: string
        event_category?: string
        event_label?: string
        value?: number
        description?: string
        fatal?: boolean
        name?: string
        analytics_storage?: "granted" | "denied"
        ad_storage?: "granted" | "denied"
        ad_user_data?: "granted" | "denied"
        ad_personalization?: "granted" | "denied"
        [key: string]: any
      },
    ) => void
    dataLayer: any[]
  }
}

export {}
