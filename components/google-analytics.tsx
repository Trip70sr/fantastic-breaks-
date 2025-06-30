"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { pageview, isGAEnabled, GA_TRACKING_ID } from "@/lib/gtag"

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isGAEnabled) return

    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  // Check if user has consented to analytics
  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("analytics-consent")
      if (consent !== "true") {
        return // Don't load GA if user hasn't consented
      }
    }
  }, [])

  // Don't render anything if GA is not enabled or user hasn't consented
  if (!isGAEnabled) return null

  const hasConsent = typeof window !== "undefined" && localStorage.getItem("analytics-consent") === "true"
  if (!hasConsent) return null

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure privacy settings
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              // Privacy settings
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              // Data retention settings
              storage: 'none',
              // Custom settings for employee break app
              custom_map: {
                'custom_parameter_1': 'app_version',
                'custom_parameter_2': 'user_type'
              },
              // Enhanced privacy mode
              restricted_data_processing: true
            });

            // Set default consent state
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted'
            });

            // Update consent when user accepts
            if (localStorage.getItem('analytics-consent') === 'true') {
              gtag('consent', 'update', {
                'analytics_storage': 'granted'
              });
            }
          `,
        }}
      />
    </>
  )
}
