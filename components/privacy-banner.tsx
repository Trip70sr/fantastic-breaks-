"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Shield, Eye, Clock, Database } from "lucide-react"

interface PrivacyBannerProps {
  onConsent: (accepted: boolean) => void
}

export default function PrivacyBanner({ onConsent }: PrivacyBannerProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Privacy & Analytics</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onConsent(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            We use Google Analytics to understand how you use our Employee Break Protocol App. Your privacy is important
            to us - no personal employee data is tracked.
          </p>

          {showDetails && (
            <div className="space-y-4 mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700">What we track:</p>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li>• Page views and navigation</li>
                      <li>• Feature usage patterns</li>
                      <li>• Error occurrences (anonymized)</li>
                      <li>• App performance metrics</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700">What we DON'T track:</p>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li>• Employee names or personal data</li>
                      <li>• Specific break times or schedules</li>
                      <li>• Sensitive business information</li>
                      <li>• Cross-site browsing activity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Data auto-deleted after 2 months</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>IP addresses anonymized</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => onConsent(true)} className="flex-1">
              Accept Analytics
            </Button>
            <Button variant="outline" onClick={() => onConsent(false)} className="flex-1">
              Decline
            </Button>
            <Button variant="ghost" onClick={() => setShowDetails(!showDetails)} className="text-sm">
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can change your preference anytime in your browser settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
