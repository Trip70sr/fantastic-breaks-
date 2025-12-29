import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Protocol",
  description: "Manage employee break schedules and compliance tracking",
  keywords: "employee, breaks, scheduling, compliance, workplace, management",
  authors: [{ name: "Employee Break Protocol Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Employee Break Protocol",
    description: "Manage employee break schedules and compliance tracking",
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
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">{children}</div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
