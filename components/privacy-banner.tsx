"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Database, Clock } from "lucide-react"

interface PrivacyBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export default function PrivacyBanner({ onAccept, onDecline }: PrivacyBannerProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Privacy & Analytics</CardTitle>
            <Badge variant="secondary">GDPR Compliant</Badge>
          </div>
          <CardDescription>We respect your privacy and want to be transparent about data collection.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What we collect (if you consent):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span>Page views and navigation</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Feature usage (anonymized)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Session duration</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Error reports (no personal data)</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Privacy protections:</h3>
            <ul className="text-sm space-y-1 text-green-800">
              <li>• IP addresses are anonymized</li>
              <li>• No personal employee data is tracked</li>
              <li>• Data is automatically deleted after 26 months</li>
              <li>• No advertising or cross-site tracking</li>
              <li>• You can withdraw consent anytime</li>
            </ul>
          </div>

          {showDetails && (
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Technical Details:</h3>
              <p className="mb-2">
                We use Google Analytics 4 with enhanced privacy settings to understand how our app is used and improve
                the user experience. This helps us identify which features are most valuable and where users encounter
                difficulties.
              </p>
              <p className="mb-2">
                <strong>Data retention:</strong> Analytics data is automatically deleted after 26 months.
              </p>
              <p className="mb-2">
                <strong>Your rights:</strong> You can change your consent preference anytime by clearing your browser
                data or contacting us.
              </p>
              <p>
                <strong>Legal basis:</strong> Your explicit consent (GDPR Article 6(1)(a)).
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showDetails ? "Hide" : "Show"} technical details
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onAccept} className="flex-1">
            Accept Analytics
          </Button>
          <Button onClick={onDecline} variant="outline" className="flex-1 bg-transparent">
            Decline Analytics
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
