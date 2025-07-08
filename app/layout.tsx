import type React from "react"
import "@/app/globals.css"

import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Break Protocol",
  description: "Manage employee breaks, track timesheets, and stay compliant.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>
            {/* App pages render here */}
            {children}

            {/* Analytics (no props needed) */}
            <GoogleAnalytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
