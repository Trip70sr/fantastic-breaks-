"use client"

import Script from "next/script"
import { GA_TRACKING_ID, initGA } from "@/lib/gtag"

export default function GoogleAnalytics() {
  // Don't load analytics if no tracking ID is provided
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      {/* Load Google Analytics script */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />

      {/* Initialize Google Analytics */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
          `,
        }}
      />

      {/* Initialize GA with privacy settings */}
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(${initGA.toString()})();`,
        }}
      />
    </>
  )
}
