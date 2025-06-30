"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Shield, Eye, Database } from "lucide-react"
import { grantConsent, denyConsent } from "@/lib/gtag"

export default function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("analytics-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("analytics-consent", "true")
    grantConsent()
    setShowBanner(false)

    // Track consent given (this will now work since consent is granted)
    if (window.gtag) {
      window.gtag("event", "consent_given", {
        event_category: "Privacy",
        event_label: "Analytics Consent Accepted",
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem("analytics-consent", "false")
    denyConsent()
    setShowBanner(false)

    // We don't track the decline since user declined tracking
    console.log("Analytics consent declined by user")
  }

  const handleClose = () => {
    // If user closes without choosing, default to decline
    handleDecline()
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We use Google Analytics to understand how you use our Employee Break Protocol App. This helps us improve
              the app and fix issues. Your privacy is important to us.
            </p>

            {showDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <strong>What we track:</strong>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      <li>Which features you use (anonymously)</li>
                      <li>How long you spend in the app</li>
                      <li>Error messages (to fix bugs)</li>
                      <li>General usage patterns</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Database className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <strong>What we DON'T track:</strong>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      <li>Employee names or personal information</li>
                      <li>Sensitive business data</li>
                      <li>Your IP address (anonymized)</li>
                      <li>Cross-site tracking or ads</li>
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-gray-500 border-t pt-2">
                  <strong>Data Retention:</strong> Analytics data is automatically deleted after 2 months. You can
                  change your choice anytime in the app settings.
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <Button variant="link" onClick={() => setShowDetails(!showDetails)} className="text-sm p-0 h-auto">
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDecline} className="min-w-[100px] bg-transparent">
                  Decline
                </Button>
                <Button onClick={handleAccept} className="min-w-[100px] bg-blue-600 hover:bg-blue-700">
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
