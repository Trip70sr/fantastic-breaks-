"use client"

import { useState } from "react"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)

  const handleAcceptPrivacy = () => {
    setShowPrivacyBanner(false)
    // Store consent in localStorage
    localStorage.setItem("privacy-consent", "accepted")
  }

  const handleDeclinePrivacy = () => {
    setShowPrivacyBanner(false)
    // Store decline in localStorage
    localStorage.setItem("privacy-consent", "declined")
  }

  return (
    <main className="min-h-screen">
      <EmployeeBreakDashboard />
      {showPrivacyBanner && <PrivacyBanner onAccept={handleAcceptPrivacy} onDecline={handleDeclinePrivacy} />}
    </main>
  )
}
