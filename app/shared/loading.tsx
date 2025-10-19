import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-aquamarine-50 flex items-center justify-center">
      <Card className="w-96">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 animate-spin text-blue-600" />
            <p className="text-lg">Loading break report...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
