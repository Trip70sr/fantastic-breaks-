"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from "lucide-react"
import type { Employee, BreakEntry, BreakViolation } from "@/lib/types"
import { analyzeMultipleEntries, getViolationStats, COLORADO_BREAK_RULES } from "@/lib/colorado-compliance"
import { loadViolations, saveViolations } from "@/lib/compliance-storage"

interface ComplianceMonitorProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  selectedDate?: string
}

export default function ComplianceMonitor({ employees, breakEntries, selectedDate }: ComplianceMonitorProps) {
  const [violations, setViolations] = useState<BreakViolation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeCompliance = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      // Analyze all entries or filtered by date
      let entriesToAnalyze = breakEntries
      if (selectedDate) {
        entriesToAnalyze = breakEntries.filter((e) => e.date === selectedDate)
      }

      const newViolations = analyzeMultipleEntries(entriesToAnalyze, employees)

      // Merge with existing violations (avoid duplicates)
      const existingViolations = loadViolations()
      const allViolations = [...existingViolations]

      for (const violation of newViolations) {
        if (!allViolations.some((v) => v.id === violation.id)) {
          allViolations.push(violation)
        }
      }

      saveViolations(allViolations)
      setViolations(newViolations)
      setIsAnalyzing(false)
    }, 500)
  }

  useEffect(() => {
    analyzeCompliance()
  }, [breakEntries, employees, selectedDate])

  const stats = getViolationStats(violations)

  const getViolationIcon = (type: string) => {
    switch (type) {
      case "excessive_duration":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "unauthorized_break":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "insufficient_rest":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getViolationBadgeVariant = (type: string): "destructive" | "secondary" | "default" => {
    switch (type) {
      case "excessive_duration":
        return "secondary"
      case "unauthorized_break":
        return "destructive"
      case "insufficient_rest":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Colorado Break Compliance Monitor</CardTitle>
            <CardDescription>
              Analyzing breaks against Colorado state labor laws
              {selectedDate && ` for ${selectedDate}`}
            </CardDescription>
          </div>
          <Button onClick={analyzeCompliance} disabled={isAnalyzing} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
            Analyze
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Colorado Rules Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Colorado Break Requirements</AlertTitle>
          <AlertDescription className="text-xs space-y-1 mt-2">
            <div>
              • {COLORADO_BREAK_RULES.requiredBreakMinutes} min paid rest break per{" "}
              {COLORADO_BREAK_RULES.maxConsecutiveHours} hours worked
            </div>
            <div>
              • {COLORADO_BREAK_RULES.mealBreakMinutes} min meal break required for shifts over{" "}
              {COLORADO_BREAK_RULES.maxShiftWithoutMeal} hours
            </div>
            <div>• Allowed variance: ±{COLORADO_BREAK_RULES.allowedBreakVariance} minutes</div>
          </AlertDescription>
        </Alert>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-600 font-medium">Total Violations</div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-600 font-medium">Excessive Duration</div>
            <div className="text-2xl font-bold text-orange-900">{stats.excessive}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-medium">Unauthorized</div>
            <div className="text-2xl font-bold text-red-900">{stats.unauthorized}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">Insufficient Rest</div>
            <div className="text-2xl font-bold text-blue-900">{stats.insufficientRest}</div>
          </div>
        </div>

        {/* Compliance Status */}
        {violations.length === 0 ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Compliant</AlertTitle>
            <AlertDescription>All breaks comply with Colorado state requirements</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Issues Detected</AlertTitle>
            <AlertDescription>{violations.length} violation(s) found that require attention</AlertDescription>
          </Alert>
        )}

        {/* Violations List */}
        {violations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Detected Violations</h4>
              <Badge variant="outline">{violations.length} total</Badge>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-3">
                {violations.map((violation, index) => {
                  const employee = employees.find((e) => e.id === violation.employeeId)

                  return (
                    <div key={violation.id}>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getViolationIcon(violation.violationType)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{employee?.name || "Unknown"}</span>
                              <Badge variant={getViolationBadgeVariant(violation.violationType)} className="text-xs">
                                {violation.violationType.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{violation.description}</p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>Date: {new Date(violation.date).toLocaleDateString()}</span>
                              <span>Shift: {violation.shiftHours.toFixed(1)}h</span>
                              <span>
                                Break: {violation.breakDuration}m / Expected: {violation.expectedDuration}m
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < violations.length - 1 && <Separator className="mt-3" />}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
