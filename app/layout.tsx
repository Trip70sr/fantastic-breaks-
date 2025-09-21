import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from "@/components/google-analytics"
import { PrivacyBanner } from "@/components/privacy-banner"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Management System",
  description: "Manage employee break schedules and coverage assignments efficiently",
  keywords: "employee, breaks, scheduling, coverage, management, timesheet",
  authors: [{ name: "Break Management Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Employee Break Management System",
    description: "Manage employee break schedules and coverage assignments efficiently",
    type: "website",
    locale: "en_US",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            {children}
            <Toaster />
            <PrivacyBanner />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
