declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: {
        page_title?: string
        page_location?: string
        custom_map?: { [key: string]: string }
        [key: string]: any
      },
    ) => void
  }
}

export {}
