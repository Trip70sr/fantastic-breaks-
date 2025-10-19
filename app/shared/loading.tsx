import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center space-y-4">
            <Clock className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Loading Break Report</h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we retrieve the employee break data...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
