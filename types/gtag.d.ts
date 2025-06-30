// TypeScript declarations for Google Analytics gtag

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: {
        page_location?: string
        page_title?: string
        send_page_view?: boolean
        event_category?: string
        event_label?: string
        value?: number
        enhanced_measurement?: {
          scrolls?: boolean
          outbound_clicks?: boolean
          site_search?: boolean
          video_engagement?: boolean
          file_downloads?: boolean
        }
        custom_map?: Record<string, string>
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
      },
    ) => void
    dataLayer: any[]
  }
}

export {}
