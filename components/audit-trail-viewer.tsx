"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, Download, Search } from "lucide-react"
import { getAuditTrail, getWageClaimDefenseRecords, exportAuditTrail, exportWageDefenseReport } from "@/lib/audit-trail"
import type { AuditEntry } from "@/lib/audit-trail"

export default function AuditTrailViewer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const auditEntries = useMemo(() => {
    return getAuditTrail({ startDate, endDate })
  }, [startDate, endDate])

  const wageDefenseRecords = useMemo(() => {
    return getWageClaimDefenseRecords()
  }, [])

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return auditEntries
    const lower = searchTerm.toLowerCase()
    return auditEntries.filter(
      (e) =>
        e.actor.toLowerCase().includes(lower) ||
        e.action.toLowerCase().includes(lower) ||
        e.details.employeeName?.toLowerCase().includes(lower),
    )
  }, [auditEntries, searchTerm])

  const handleExportAudit = () => {
    const data = exportAuditTrail(startDate, endDate)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-trail-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportWageDefense = () => {
    const data = exportWageDefenseReport()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wage-defense-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getActionBadgeColor = (action: AuditEntry["action"]) => {
    switch (action) {
      case "violation_detected":
        return "destructive"
      case "manual_edit":
        return "secondary"
      case "report_generated":
        return "outline"
      case "settings_changed":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Audit Trail & Wage Defense
        </h3>
        <p className="text-sm text-blue-600">Complete audit trail for legal defensibility and wage claim protection</p>
      </div>

      {/* Filters & Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportAudit} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Audit Trail
            </Button>
            <Button onClick={handleExportWageDefense} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Wage Defense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-900">{filteredEntries.length}</div>
            <p className="text-xs text-muted-foreground">Total Audit Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-900">{wageDefenseRecords.length}</div>
            <p className="text-xs text-muted-foreground">Wage Defense Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-900">
              {filteredEntries.filter((e) => e.action === "violation_detected").length}
            </div>
            <p className="text-xs text-muted-foreground">Violations Logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-900">
              {filteredEntries.filter((e) => e.action === "manual_edit").length}
            </div>
            <p className="text-xs text-muted-foreground">Manual Edits</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail ({filteredEntries.length} entries)</CardTitle>
          <CardDescription>Immutable record of all system actions for legal defensibility</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeColor(entry.action)}>{entry.action.replace(/_/g, " ")}</Badge>
                      <Badge variant="outline">{entry.actorRole}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">Actor: {entry.actor}</div>
                    {entry.details.employeeName && (
                      <div className="text-sm text-muted-foreground">Employee: {entry.details.employeeName}</div>
                    )}
                    {entry.details.reason && (
                      <div className="text-sm text-muted-foreground">Reason: {entry.details.reason}</div>
                    )}
                    {entry.details.changes && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Changes: {JSON.stringify(entry.details.changes)}
                      </div>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-xs text-muted-foreground">
                    ID: {entry.id} | IP: {entry.ipAddress}
                  </div>
                </div>
              ))}
              {filteredEntries.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No audit entries found</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Wage Claim Defense Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Wage Claim Defense Records
          </CardTitle>
          <CardDescription>Legal documentation for wage and hour compliance violations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {wageDefenseRecords.map((record) => (
                <div key={record.auditId} className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-green-900">{record.employeeName}</div>
                      <div className="text-sm text-green-700">{record.violationType.replace(/_/g, " ")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</div>
                      <Badge variant="outline" className="mt-1">
                        ${record.evidence.revenueImpact.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Legal Reference:</span> {record.evidence.coloradoLawReference}
                    </div>
                    <div>
                      <span className="font-semibold">Calculation Method:</span> {record.evidence.calculationMethod}
                    </div>
                    <div>
                      <span className="font-semibold">Approved By:</span> {record.approvedBy}
                    </div>
                    {record.legalNotes && (
                      <div>
                        <span className="font-semibold">Notes:</span> {record.legalNotes}
                      </div>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">Defense Record ID: {record.auditId}</div>
                </div>
              ))}
              {wageDefenseRecords.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No wage defense records found</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
