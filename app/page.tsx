"use client"

import { useState, useEffect } from "react"
import { EmployeeBreakDashboard } from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("privacy-consent")
    if (!consent) {
      setShowPrivacyBanner(true)
    }
  }, [])

  const handleAcceptPrivacy = () => {
    localStorage.setItem("privacy-consent", "accepted")
    setShowPrivacyBanner(false)
  }

  const handleDeclinePrivacy = () => {
    localStorage.setItem("privacy-consent", "declined")
    setShowPrivacyBanner(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <EmployeeBreakDashboard />
      {showPrivacyBanner && <PrivacyBanner onAccept={handleAcceptPrivacy} onDecline={handleDeclinePrivacy} />}
    </main>
  )
}
