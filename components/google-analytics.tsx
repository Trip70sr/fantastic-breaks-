"use client"

import { useEffect } from "react"
import { initGA, GA_TRACKING_ID } from "@/lib/gtag"

export default function GoogleAnalytics() {
  useEffect(() => {
    // Only initialize if we have a tracking ID and user has consented
    if (GA_TRACKING_ID && typeof window !== "undefined") {
      const consent = localStorage.getItem("analytics-consent")
      if (consent === "accepted") {
        initGA()
      }
    }
  }, [])

  // Don't render anything if no tracking ID
  if (!GA_TRACKING_ID) {
    return null
  }

  return null
}
