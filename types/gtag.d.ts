declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "consent",
      targetId: string | "default" | "update",
      config?: {
        page_title?: string
        page_location?: string
        event_category?: string
        event_label?: string
        value?: number
        break_type?: string
        data_type?: string
        share_type?: string
        engagement_time_msec?: number
        custom_parameter_1?: string
        analytics_storage?: "granted" | "denied"
        ad_storage?: "granted" | "denied"
        ad_user_data?: "granted" | "denied"
        ad_personalization?: "granted" | "denied"
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
        cookie_flags?: string
        custom_map?: Record<string, string>
        description?: string
        fatal?: boolean
      },
    ) => void
    dataLayer: any[]
  }
}

export {}
