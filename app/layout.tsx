import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import GoogleAnalytics from "@/components/google-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Protocol App",
  description: "Manage employee breaks, schedules, and coverage assignments",
  keywords: "employee management, break scheduling, workforce management",
  authors: [{ name: "Trip-tech.art" }],
  robots: "index, follow",
  openGraph: {
    title: "Employee Break Protocol App",
    description: "Manage employee breaks, schedules, and coverage assignments",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  )
}
