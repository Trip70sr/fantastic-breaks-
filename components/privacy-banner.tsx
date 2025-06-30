"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Cookie, X } from "lucide-react"

export default function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("analytics-consent")
    if (consent === null) {
      setShowBanner(true)
    } else {
      setAnalyticsConsent(consent === "true")
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("analytics-consent", "true")
    setAnalyticsConsent(true)
    setShowBanner(false)

    // Reload to initialize Google Analytics
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  const handleDecline = () => {
    localStorage.setItem("analytics-consent", "false")
    setAnalyticsConsent(false)
    setShowBanner(false)
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-2 border-blue-200 bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-sm">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs">
              We use Google Analytics to understand how you use our app and improve your experience. Your data is
              anonymized and we don't track personal information.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-xs text-gray-600 mb-4">
            <p>
              <strong>What we collect:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Page views and navigation patterns</li>
              <li>Feature usage statistics</li>
              <li>Error reports (anonymized)</li>
              <li>Performance metrics</li>
            </ul>
            <p>
              <strong>What we don't collect:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Employee names or personal data</li>
              <li>Sensitive business information</li>
              <li>Login credentials</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAccept} size="sm" className="flex-1 text-xs">
              Accept Analytics
            </Button>
            <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
              Decline
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">You can change this preference anytime in settings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
