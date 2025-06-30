"use client"

import { useState } from "react"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("analytics-consent")
    }
    return true
  })

  const handlePrivacyConsent = (accepted: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics-consent", accepted ? "accepted" : "declined")
      setShowPrivacyBanner(false)

      // Reload page to initialize analytics if accepted
      if (accepted) {
        window.location.reload()
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <EmployeeBreakDashboard />
      {showPrivacyBanner && <PrivacyBanner onConsent={handlePrivacyConsent} />}
    </main>
  )
}
