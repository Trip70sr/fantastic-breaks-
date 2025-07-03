import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Protocol App",
  description: "Comprehensive employee break management system with scheduling, tracking, and compliance features.",
  keywords: "employee breaks, scheduling, workforce management, compliance, HR tools",
  authors: [{ name: "Triptech-code" }],
  creator: "Triptech-code",
  publisher: "Triptech-code",
  robots: "index, follow",
  openGraph: {
    title: "Employee Break Protocol App",
    description: "Streamline your employee break management with our comprehensive scheduling and tracking system.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Break Protocol App",
    description: "Comprehensive employee break management system",
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
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
