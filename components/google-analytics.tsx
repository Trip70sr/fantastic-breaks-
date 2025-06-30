"use client"

import Script from "next/script"
import { GA_TRACKING_ID, isGAEnabled } from "@/lib/gtag"

export default function GoogleAnalytics() {
  if (!isGAEnabled) {
    return null
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent state
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            
            gtag('js', new Date());
            
            gtag('config', '${GA_TRACKING_ID}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              cookie_flags: 'SameSite=Strict;Secure',
              page_title: document.title,
              custom_map: {
                'custom_parameter_1': 'app_section'
              }
            });
          `,
        }}
      />
    </>
  )
}
