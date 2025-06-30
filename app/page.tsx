"use client"

import { useState } from "react"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)

  const handlePrivacyAccept = () => {
    setShowPrivacyBanner(false)
    // Analytics consent is handled in the PrivacyBanner component
  }

  const handlePrivacyDecline = () => {
    setShowPrivacyBanner(false)
    // Analytics remains disabled
  }

  return (
    <main className="min-h-screen bg-background">
      <EmployeeBreakDashboard />
      {showPrivacyBanner && <PrivacyBanner onAccept={handlePrivacyAccept} onDecline={handlePrivacyDecline} />}
    </main>
  )
}
