"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface ShiftVerificationBlockProps {
  verified: boolean
  corrected: boolean
  correctionReason: string
  onVerify: () => void
  onCorrect: () => void
  onReasonChange: (reason: string) => void
}

export default function ShiftVerificationBlock({
  verified,
  corrected,
  correctionReason,
  onVerify,
  onCorrect,
  onReasonChange,
}: ShiftVerificationBlockProps) {
  return (
    <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
        <p className="font-semibold text-amber-900">Schedule Verification Required</p>
      </div>

      <p className="text-sm text-amber-800">
        Before submitting a break entry, you must verify the employee's shift schedule.
      </p>

      <div className="space-y-3 mt-4">
        <label className="flex items-start gap-3 p-3 border border-blue-200 rounded bg-white hover:bg-blue-50 cursor-pointer transition-colors">
          <Checkbox checked={verified} onCheckedChange={onVerify} className="mt-1" />
          <div className="flex-1">
            <div className="font-medium text-sm">Schedule Verified</div>
            <div className="text-xs text-gray-600">
              I have verbally confirmed with the employee that their scheduled shift times are correct.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 border border-red-200 rounded bg-white hover:bg-red-50 cursor-pointer transition-colors">
          <Checkbox checked={corrected} onCheckedChange={onCorrect} className="mt-1" />
          <div className="flex-1">
            <div className="font-medium text-sm">Schedule Needs Correction</div>
            <div className="text-xs text-gray-600">
              The employee made an error entering their schedule. I will correct it and provide a reason below.
            </div>
          </div>
        </label>
      </div>

      {corrected && (
        <div className="mt-3 space-y-2">
          <Label htmlFor="correction-reason" className="text-sm font-medium">
            Correction Reason (Required)
          </Label>
          <Textarea
            id="correction-reason"
            value={correctionReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Explain why the schedule needed correction (e.g., 'Employee accidentally entered PM instead of AM')"
            className="min-h-[80px]"
            required={corrected}
          />
        </div>
      )}

      {!verified && !corrected && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          Please select one option to proceed with break entry submission.
        </div>
      )}
    </div>
  )
}
