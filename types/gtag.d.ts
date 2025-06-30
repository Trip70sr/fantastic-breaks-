declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent",
      targetId: string | Date,
      config?: {
        page_location?: string
        page_title?: string
        event_category?: string
        event_label?: string
        value?: number
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
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

export interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface GtagConfig {
  page_location?: string
  page_title?: string
  anonymize_ip?: boolean
  allow_google_signals?: boolean
  allow_ad_personalization_signals?: boolean
}

export interface ConsentSettings {
  analytics_storage: "granted" | "denied"
  ad_storage: "granted" | "denied"
  ad_user_data: "granted" | "denied"
  ad_personalization: "granted" | "denied"
}
