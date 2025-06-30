"use client"

import Script from "next/script"
import { GA_TRACKING_ID, initGA } from "@/lib/gtag"

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) return null

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
            window.gtag = gtag;
            gtag('js', new Date());
          `,
        }}
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (${initGA.toString()})();
          `,
        }}
      />
    </>
  )
}
