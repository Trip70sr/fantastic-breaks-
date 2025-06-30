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
  title: "Employee Break Protocol App",
  description: "Manage employee break schedules and track time efficiently",
  keywords: "employee management, break scheduling, time tracking, workplace productivity",
  authors: [{ name: "Employee Break Protocol Team" }],
  creator: "Employee Break Protocol Team",
  publisher: "Employee Break Protocol Team",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    title: "Employee Break Protocol App",
    description: "Manage employee break schedules and track time efficiently",
    siteName: "Employee Break Protocol App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Break Protocol App",
    description: "Manage employee break schedules and track time efficiently",
  },
    generator: 'v0.dev'
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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
