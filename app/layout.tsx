import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Protocol",
  description: "Comprehensive employee break management system with scheduling, tracking, and compliance features",
  keywords: ["employee management", "break scheduling", "workforce management", "hr tools"],
  authors: [{ name: "Trip-tech.art", url: "https://triptech.art" }],
  creator: "Trip-tech.art",
  publisher: "Trip-tech.art",
  robots: "index, follow",
  openGraph: {
    title: "Employee Break Protocol",
    description: "Comprehensive employee break management system",
    url: "https://trip70sr.github.io/fantastic-breaks-/",
    siteName: "Employee Break Protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Break Protocol",
    description: "Comprehensive employee break management system",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
