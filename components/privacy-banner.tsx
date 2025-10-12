"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface PrivacyBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export default function PrivacyBanner({ onAccept, onDecline }: PrivacyBannerProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Privacy Notice</h3>
              <p className="text-sm text-blue-700 mb-4">
                We use cookies and analytics to improve your experience. Your data is stored locally and never shared
                without consent.
              </p>
              <div className="flex gap-2">
                <Button onClick={onAccept} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Accept
                </Button>
                <Button
                  onClick={onDecline}
                  size="sm"
                  variant="outline"
                  className="border-blue-200 text-blue-700 bg-transparent"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
