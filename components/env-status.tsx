"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Settings, Eye, EyeOff } from "lucide-react"

interface EnvStatus {
  name: string
  value: string | undefined
  required: boolean
  category: string
  description: string
}

export default function EnvironmentStatus() {
  const [showValues, setShowValues] = useState(false)
  const [envStatus, setEnvStatus] = useState<EnvStatus[]>([])

  useEffect(() => {
    // Check environment variables (only public ones for security)
    const status: EnvStatus[] = [
      {
        name: "NEXT_PUBLIC_APP_NAME",
        value: process.env.NEXT_PUBLIC_APP_NAME,
        required: false,
        category: "App Config",
        description: "Application name displayed in the UI",
      },
      {
        name: "NEXT_PUBLIC_APP_VERSION",
        value: process.env.NEXT_PUBLIC_APP_VERSION,
        required: false,
        category: "App Config",
        description: "Current application version",
      },
      {
        name: "NEXT_PUBLIC_COMPANY_NAME",
        value: process.env.NEXT_PUBLIC_COMPANY_NAME,
        required: false,
        category: "Company",
        description: "Your company/organization name",
      },
      {
        name: "NEXT_PUBLIC_ENABLE_EMAIL_SHARING",
        value: process.env.NEXT_PUBLIC_ENABLE_EMAIL_SHARING,
        required: false,
        category: "Features",
        description: "Enable email sharing functionality",
      },
      {
        name: "NEXT_PUBLIC_ENABLE_NOTIFICATIONS",
        value: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
        required: false,
        category: "Features",
        description: "Enable notification system",
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: false,
        category: "Database",
        description: "Supabase project URL (if using Supabase)",
      },
    ]

    setEnvStatus(status)
  }, [])

  const getStatusIcon = (value: string | undefined, required: boolean) => {
    if (required && !value) {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else if (!required && !value) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (value: string | undefined, required: boolean) => {
    if (required && !value) {
      return <Badge variant="destructive">Missing</Badge>
    } else if (!required && !value) {
      return <Badge variant="secondary">Optional</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Set</Badge>
    }
  }

  const categorizedEnv = envStatus.reduce(
    (acc, env) => {
      if (!acc[env.category]) {
        acc[env.category] = []
      }
      acc[env.category].push(env)
      return acc
    },
    {} as Record<string, EnvStatus[]>,
  )

  const missingRequired = envStatus.filter((env) => env.required && !env.value)
  const missingOptional = envStatus.filter((env) => !env.required && !env.value)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Environment Configuration Status
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="flex items-center gap-2"
            >
              {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showValues ? "Hide Values" : "Show Values"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{envStatus.filter((env) => env.value).length}</div>
              <div className="text-sm text-green-600">Variables Set</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">{missingRequired.length}</div>
              <div className="text-sm text-red-600">Required Missing</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{missingOptional.length}</div>
              <div className="text-sm text-yellow-600">Optional Missing</div>
            </div>
          </div>

          {/* Alerts */}
          {missingRequired.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Missing Required Variables:</strong> {missingRequired.map((env) => env.name).join(", ")}
                <br />
                Please set these variables in your .env.local file for the app to work properly.
              </AlertDescription>
            </Alert>
          )}

          {/* Environment Variables by Category */}
          {Object.entries(categorizedEnv).map(([category, envs]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">{category}</h3>
              <div className="space-y-2">
                {envs.map((env) => (
                  <div key={env.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(env.value, env.required)}
                      <div>
                        <div className="font-medium">{env.name}</div>
                        <div className="text-sm text-gray-600">{env.description}</div>
                        {showValues && env.value && (
                          <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                            {env.value.length > 50 ? `${env.value.substring(0, 50)}...` : env.value}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(env.value, env.required)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Setup Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>
                Copy <code>.env.example</code> to <code>.env.local</code>
              </li>
              <li>
                Fill in your actual values in <code>.env.local</code>
              </li>
              <li>
                Restart your development server: <code>npm run dev</code>
              </li>
              <li>Check this page again to verify configuration</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
