"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Clock } from "lucide-react"
import type { ShiftScheduleEntry } from "@/lib/types"

interface ShiftScheduleModalProps {
  employeeId: string
  employeeName: string
  date: string
  onSave: (schedule: ShiftScheduleEntry) => void
  onClose: () => void
}

export default function ShiftScheduleModal({
  employeeId,
  employeeName,
  date,
  onSave,
  onClose,
}: ShiftScheduleModalProps) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [therapyMinutes, setTherapyMinutes] = useState(0)

  const calculateNetMinutes = () => {
    if (!startTime || !endTime) return 0

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    let endMinutes = endHour * 60 + endMin

    // Handle overnight shifts
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60
    }

    const totalMinutes = endMinutes - startMinutes
    return Math.max(0, totalMinutes - therapyMinutes)
  }

  const netMinutes = calculateNetMinutes()
  const netHours = (netMinutes / 60).toFixed(2)

  const handleSave = () => {
    if (!startTime || !endTime) {
      alert("Please enter both start and end times")
      return
    }

    const schedule: ShiftScheduleEntry = {
      id: `shift-${employeeId}-${date}-${Date.now()}`,
      employeeId,
      date,
      startTime,
      endTime,
      therapyMinutes,
      netWorkMinutes: netMinutes,
      selfReported: true,
      reportedAt: new Date().toISOString(),
    }

    onSave(schedule)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle>Enter Today's Schedule</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {employeeName} - {new Date(date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapy-minutes">Therapy Time (minutes, excluded from work hours)</Label>
            <Input
              id="therapy-minutes"
              type="number"
              min={0}
              value={therapyMinutes}
              onChange={(e) => setTherapyMinutes(Math.max(0, Number.parseInt(e.target.value) || 0))}
              className="w-full"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Therapy time is excluded from total working hours for break calculations
            </p>
          </div>

          {startTime && endTime && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Net Working Hours</div>
              <div className="text-2xl font-bold text-blue-600">{netHours} hours</div>
              <div className="text-xs text-blue-700 mt-1">{netMinutes} minutes (after excluding therapy time)</div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
