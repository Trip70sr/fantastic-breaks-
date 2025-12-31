"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserSession, logout, isAuthenticated } from "@/lib/employee-auth"
import { loadEmployees } from "@/lib/data"
import { saveShiftSchedule } from "@/lib/shift-storage"
import { LogOut, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import type { ShiftScheduleEntry } from "@/lib/types"
import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import EmployeeBreakListView from "@/components/employee-break-list-view"

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [therapyMinutes, setTherapyMinutes] = useState(0)
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const userSession = getUserSession()
    setSession(userSession)
    setEmployees(loadEmployees())
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSubmitHours = () => {
    if (!session || !startTime || !endTime) return

    const start = new Date(`${selectedDate}T${startTime}`)
    const end = new Date(`${selectedDate}T${endTime}`)
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    const netWorkMinutes = totalMinutes - therapyMinutes

    const shiftEntry: ShiftScheduleEntry = {
      id: `${session.employeeId}-${selectedDate}-${Date.now()}`,
      employeeId: session.employeeId,
      date: selectedDate,
      startTime,
      endTime,
      therapyMinutes,
      netWorkMinutes,
      selfReported: true,
      reportedAt: new Date().toISOString(),
    }

    saveShiftSchedule(shiftEntry)
    alert("Work hours submitted successfully!")
    setStartTime("")
    setEndTime("")
    setTherapyMinutes(0)
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Employee Dashboard</h1>
            <p className="text-lg text-blue-700">Welcome, {session.username}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 mb-8">
          <EmployeeBreakListView />

          {session.role === "manager" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Manage Employee Breaks
                </CardTitle>
                <CardDescription>Assign and track employee break times</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeBreakDashboard />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Submit Work Hours
              </CardTitle>
              <CardDescription>Enter your daily work schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapy">Therapy Time (minutes)</Label>
                  <Input
                    id="therapy"
                    type="number"
                    value={therapyMinutes}
                    onChange={(e) => setTherapyMinutes(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Time</Label>
                  <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">End Time</Label>
                  <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSubmitHours} className="w-full">
                Submit Hours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
