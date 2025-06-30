"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Shield, Eye, Database } from "lucide-react"
import { grantAnalyticsConsent } from "@/lib/gtag"

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
    localStorage.setItem("analytics-consent", "accepted")
    grantAnalyticsConsent()
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("analytics-consent", "declined")
    setShowBanner(false)
  }

  const handleClose = () => {
    // If they close without choosing, default to declined
    if (!localStorage.getItem("analytics-consent")) {
      localStorage.setItem("analytics-consent", "declined")
    }
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-white/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-lg border-2">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              We use Google Analytics to understand how you use our Employee Break Protocol App and improve your
              experience. Your privacy is important to us.
            </p>

            {showDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">What we track:</p>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      <li>• Page views and navigation patterns</li>
                      <li>• Feature usage (anonymized)</li>
                      <li>• Error reports for debugging</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Database className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">What we DON'T track:</p>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      <li>• Employee names or personal information</li>
                      <li>• Business-sensitive data</li>
                      <li>• Cross-site tracking</li>
                      <li>• Advertising profiles</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-xs text-gray-600">
                    <strong>Privacy-first:</strong> All data is anonymized, IP addresses are masked, and data is
                    automatically deleted after 2 months. You can withdraw consent anytime.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white">
                Accept Analytics
              </Button>
              <Button onClick={handleDecline} variant="outline" className="border-gray-300 bg-transparent">
                Decline
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {showDetails ? "Hide Details" : "Learn More"}
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              By accepting, you agree to our privacy-compliant analytics. You can change your preference anytime in your
              browser settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
