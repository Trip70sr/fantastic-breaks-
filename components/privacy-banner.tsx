"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Shield, Eye, Clock, Database } from "lucide-react"

export default function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("analytics-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("analytics-consent", "accepted")
    setShowBanner(false)

    // Update consent for Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem("analytics-consent", "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDecline} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            We use Google Analytics to understand how you use our Employee Break Protocol app. This helps us improve the
            experience for everyone.
          </p>

          {showDetails && (
            <div className="mb-4 p-4 bg-muted rounded-lg text-sm space-y-3">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <strong>What we track:</strong>
                  <ul className="mt-1 text-muted-foreground list-disc list-inside ml-2">
                    <li>Page views and navigation patterns</li>
                    <li>Feature usage (anonymized)</li>
                    <li>Error rates for debugging</li>
                    <li>Performance metrics</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <strong>What we DON'T track:</strong>
                  <ul className="mt-1 text-muted-foreground list-disc list-inside ml-2">
                    <li>Employee names or personal information</li>
                    <li>Sensitive business data</li>
                    <li>Exact break times or schedules</li>
                    <li>Any personally identifiable information</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-orange-600" />
                <div>
                  <strong>Data retention:</strong>
                  <p className="mt-1 text-muted-foreground">
                    Analytics data is automatically deleted after 2 months. Your IP address is anonymized immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleAccept} className="flex-1">
              Accept Analytics
            </Button>
            <Button variant="outline" onClick={handleDecline} className="flex-1 bg-transparent">
              Decline
            </Button>
            <Button variant="ghost" onClick={() => setShowDetails(!showDetails)} className="text-sm">
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can change your preference anytime by clearing your browser data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
