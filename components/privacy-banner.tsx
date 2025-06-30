"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { grantAnalyticsConsent } from "@/lib/gtag"
import { X, Shield, Info } from "lucide-react"

interface PrivacyBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export default function PrivacyBanner({ onAccept, onDecline }: PrivacyBannerProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleAccept = () => {
    // Grant analytics consent
    grantAnalyticsConsent()

    // Store consent in localStorage
    localStorage.setItem("analytics-consent", "granted")
    localStorage.setItem("analytics-consent-date", new Date().toISOString())

    onAccept()
  }

  const handleDecline = () => {
    // Store decline in localStorage
    localStorage.setItem("analytics-consent", "denied")
    localStorage.setItem("analytics-consent-date", new Date().toISOString())

    onDecline()
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-2 border-blue-200 bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDecline} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            We use analytics to improve your experience with the Employee Break Protocol App. Your privacy is important
            to us.
          </p>

          {showDetails && (
            <div className="mb-3 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
              <h4 className="font-medium mb-2">What we collect:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Page views and feature usage (anonymized)</li>
                <li>Error tracking for app improvements</li>
                <li>General usage patterns (no personal data)</li>
              </ul>
              <h4 className="font-medium mt-2 mb-1">What we DON'T collect:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Employee names or personal information</li>
                <li>Sensitive business data</li>
                <li>IP addresses (anonymized)</li>
              </ul>
              <p className="mt-2 text-xs">
                Data is automatically deleted after 2 months. You can withdraw consent anytime.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button onClick={handleAccept} size="sm" className="flex-1">
                Accept Analytics
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1 bg-transparent">
                Decline
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 h-6"
            >
              <Info className="h-3 w-3 mr-1" />
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
