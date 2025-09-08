"use client"

import { useState } from "react"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)

  const handleAcceptPrivacy = () => {
    setShowPrivacyBanner(false)
    localStorage.setItem("privacy-consent", "accepted")
  }

  const handleDeclinePrivacy = () => {
    setShowPrivacyBanner(false)
    localStorage.setItem("privacy-consent", "declined")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-aquamarine-600 bg-clip-text text-transparent mb-2">
            Employee Break Protocol
          </h1>
          <p className="text-lg text-blue-700">Streamline break scheduling and compliance tracking</p>
        </div>

        <EmployeeBreakDashboard />

        {showPrivacyBanner && <PrivacyBanner onAccept={handleAcceptPrivacy} onDecline={handleDeclinePrivacy} />}
      </div>
    </main>
  )
}
