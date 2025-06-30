"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { grantAnalyticsConsent } from "@/lib/gtag"
import { Shield, Eye, Database, Clock, X } from "lucide-react"

interface PrivacyBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export default function PrivacyBanner({ onAccept, onDecline }: PrivacyBannerProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleAccept = () => {
    // Grant analytics consent
    grantAnalyticsConsent()
    onAccept()
  }

  const handleDecline = () => {
    onDecline()
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Privacy & Analytics</CardTitle>
              <Badge variant="secondary" className="text-xs">
                GDPR Compliant
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDecline} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>We respect your privacy and want to be transparent about data collection.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">What we collect (if you consent):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-blue-800">
                <Eye className="h-4 w-4 text-blue-600" />
                <span>Page views and navigation</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Feature usage (anonymized)</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Session duration</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Error reports (no personal data)</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Privacy protections:</h3>
            <ul className="text-sm space-y-2 text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>IP addresses are anonymized immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>No personal employee data is tracked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Data is automatically deleted after 2 months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>No advertising or cross-site tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>You can withdraw consent anytime</span>
              </li>
            </ul>
          </div>

          {showDetails && (
            <div className="bg-gray-50 p-4 rounded-lg border text-sm">
              <h3 className="font-semibold mb-2 text-gray-900">Technical Details:</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  We use Google Analytics 4 with enhanced privacy settings to understand how our app is used and improve
                  the user experience. This helps us identify which features are most valuable and where users encounter
                  difficulties.
                </p>
                <p>
                  <strong>Data retention:</strong> Analytics data is automatically deleted after 2 months to minimize
                  data storage.
                </p>
                <p>
                  <strong>Your rights:</strong> You can change your consent preference anytime by clearing your browser
                  data or refreshing the page.
                </p>
                <p>
                  <strong>Legal basis:</strong> Your explicit consent (GDPR Article 6(1)(a)).
                </p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            {showDetails ? "Hide" : "Show"} technical details
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleAccept} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Accept Analytics
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            Decline Analytics
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
