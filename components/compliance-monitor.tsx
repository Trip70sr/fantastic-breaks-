"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw, Shield, TrendingUp } from "lucide-react"
import type { Employee, BreakEntry, BreakViolation } from "@/lib/types"
import {
  analyzeMultipleEntries,
  getViolationStats,
  COLORADO_BREAK_RULES,
  getAtRiskEmployees,
  categorizeViolation,
} from "@/lib/colorado-compliance"
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

  const stats = useMemo(() => getViolationStats(violations), [violations])

  const atRiskEmployees = useMemo(() => {
    const allViolations = loadViolations()
    return getAtRiskEmployees(allViolations, employees)
  }, [violations, employees])

  const violationsByCategory = useMemo(() => {
    const financial = violations.filter((v) => categorizeViolation(v.violationType) === "financial")
    const compliance = violations.filter((v) => categorizeViolation(v.violationType) === "compliance")
    return { financial, compliance }
  }, [violations])

  const getViolationIcon = (type: string) => {
    switch (type) {
      case "overage":
      case "excessive_duration":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "missed":
      case "unauthorized_break":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "insufficient_rest":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getViolationBadgeVariant = (type: string): "destructive" | "secondary" | "default" => {
    const category = categorizeViolation(type)
    return category === "financial" ? "destructive" : "secondary"
  }

  const getRiskBadgeVariant = (
    level: string,
  ): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      default:
        return "outline"
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
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-medium">Financial Loss</div>
            <div className="text-2xl font-bold text-red-900">{stats.financial}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">Compliance Risk</div>
            <div className="text-2xl font-bold text-blue-900">{stats.compliance}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-600 font-medium">At Risk</div>
            <div className="text-2xl font-bold text-orange-900">{atRiskEmployees.length}</div>
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
            <AlertDescription>
              {violations.length} violation(s) found: {violationsByCategory.financial.length} causing revenue loss,{" "}
              {violationsByCategory.compliance.length} compliance risks
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="violations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="violations">All Violations</TabsTrigger>
            <TabsTrigger value="financial">Financial Loss</TabsTrigger>
            <TabsTrigger value="risk">At Risk Employees</TabsTrigger>
          </TabsList>

          {/* All Violations */}
          <TabsContent value="violations">
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
                      const category = categorizeViolation(violation.violationType)

                      return (
                        <div key={violation.id}>
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{getViolationIcon(violation.violationType)}</div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{employee?.name || "Unknown"}</span>
                                  <Badge
                                    variant={getViolationBadgeVariant(violation.violationType)}
                                    className="text-xs"
                                  >
                                    {violation.violationType.replace("_", " ")}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                </div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>Date: {new Date(violation.date).toLocaleDateString()}</span>
                                  <span>
                                    Break: {violation.breakDuration}m / Expected: {violation.expectedDuration}m
                                  </span>
                                  {category === "financial" && (
                                    <span className="text-red-600 font-medium">
                                      Loss: {violation.breakDuration - violation.expectedDuration}m
                                    </span>
                                  )}
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
          </TabsContent>

          {/* Financial Loss Violations */}
          <TabsContent value="financial">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Financial Loss Violations</h4>
                <Badge variant="destructive">{violationsByCategory.financial.length} violations</Badge>
              </div>

              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-3">
                  {violationsByCategory.financial.map((violation, index) => {
                    const employee = employees.find((e) => e.id === violation.employeeId)
                    const excessMinutes = violation.breakDuration - violation.expectedDuration

                    return (
                      <div key={violation.id}>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{employee?.name || "Unknown"}</span>
                                  <Badge variant="destructive" className="text-xs">
                                    {violation.violationType.replace("_", " ")}
                                  </Badge>
                                </div>
                                <span className="text-red-600 font-bold">{excessMinutes}m excess</span>
                              </div>
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <span>Date: {new Date(violation.date).toLocaleDateString()}</span>
                                <span>
                                  Break: {violation.breakDuration}m / Allowed: {violation.expectedDuration}m
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < violationsByCategory.financial.length - 1 && <Separator className="mt-3" />}
                      </div>
                    )
                  })}
                  {violationsByCategory.financial.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No financial loss violations detected
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* At Risk Employees */}
          <TabsContent value="risk">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">High Risk Employees</h4>
                <Badge variant="secondary">{atRiskEmployees.length} employees</Badge>
              </div>

              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-3">
                  {atRiskEmployees.map((profile, index) => (
                    <div key={profile.employeeId}>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{profile.employeeName}</span>
                              <Badge variant={getRiskBadgeVariant(profile.riskLevel)}>{profile.riskLevel} risk</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2 bg-red-50 rounded">
                                <div className="text-red-600 font-medium">Overages</div>
                                <div className="text-red-900 font-bold">{profile.totalOverages}</div>
                              </div>
                              <div className="p-2 bg-orange-50 rounded">
                                <div className="text-orange-600 font-medium">Lost Hours</div>
                                <div className="text-orange-900 font-bold">{profile.totalLostHours}h</div>
                              </div>
                              <div className="p-2 bg-blue-50 rounded">
                                <div className="text-blue-600 font-medium">Compliance</div>
                                <div className="text-blue-900 font-bold">{profile.complianceViolations}</div>
                              </div>
                              <div className="p-2 bg-slate-50 rounded">
                                <div className="text-slate-600 font-medium">Financial</div>
                                <div className="text-slate-900 font-bold">{profile.financialViolations}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < atRiskEmployees.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                  {atRiskEmployees.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">No high-risk employees detected</p>
                      <p className="text-xs text-muted-foreground">All employees are within acceptable thresholds</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
