"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Employee, BreakEntry } from "@/lib/types"
import { Download, Upload, Database, AlertCircle, CheckCircle, FileText } from "lucide-react"

interface DataBackupRestoreProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  breakEntries: BreakEntry[]
  onRestoreData: (employees: Employee[], breakEntries: BreakEntry[]) => void
}

export default function DataBackupRestore({
  isOpen,
  onClose,
  employees,
  breakEntries,
  onRestoreData,
}: DataBackupRestoreProps) {
  const [restoreData, setRestoreData] = useState("")
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreStatus, setRestoreStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleExportData = () => {
    const data = {
      employees,
      breakEntries,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `employee-break-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportData = async () => {
    if (!restoreData.trim()) {
      setRestoreStatus({
        type: "error",
        message: "Please paste the backup data first",
      })
      return
    }

    setIsRestoring(true)
    setRestoreStatus({ type: null, message: "" })

    try {
      const data = JSON.parse(restoreData)

      // Validate data structure
      if (!data.employees || !Array.isArray(data.employees)) {
        throw new Error("Invalid data format: employees array not found")
      }

      if (!data.breakEntries || !Array.isArray(data.breakEntries)) {
        throw new Error("Invalid data format: breakEntries array not found")
      }

      // Validate employee structure
      for (const emp of data.employees) {
        if (!emp.id || !emp.name || !emp.department) {
          throw new Error("Invalid employee data structure")
        }
      }

      // Validate break entry structure
      for (const entry of data.breakEntries) {
        if (!entry.id || !entry.employeeId || !entry.date || !entry.shiftStart || !entry.shiftEnd) {
          throw new Error("Invalid break entry data structure")
        }
      }

      onRestoreData(data.employees, data.breakEntries)

      setRestoreStatus({
        type: "success",
        message: `Successfully restored ${data.employees.length} employees and ${data.breakEntries.length} break entries`,
      })

      setRestoreData("")
    } catch (error) {
      setRestoreStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to restore data",
      })
    } finally {
      setIsRestoring(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setRestoreData(content)
    }
    reader.readAsText(file)
  }

  const dataStats = {
    totalEmployees: employees.length,
    totalBreakEntries: breakEntries.length,
    lastUpdate: localStorage.getItem("lastDataUpdate"),
    dataSize: JSON.stringify({ employees, breakEntries }).length,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Backup & Restore
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="restore">Restore</TabsTrigger>
            <TabsTrigger value="info">Data Info</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download a complete backup of all employee data and break entries. This file can be used to restore
                  your data later.
                </p>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Employees</div>
                    <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Break Entries</div>
                    <div className="text-2xl font-bold text-green-600">{breakEntries.length}</div>
                  </div>
                </div>

                <Button onClick={handleExportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup File
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restore" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Importing data will replace all current data. Make sure to backup your
                    current data first.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Backup File</Label>
                  <Input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restore-data">Or Paste Backup Data</Label>
                  <Textarea
                    id="restore-data"
                    placeholder="Paste your backup JSON data here..."
                    value={restoreData}
                    onChange={(e) => setRestoreData(e.target.value)}
                    rows={10}
                  />
                </div>

                {restoreStatus.type && (
                  <Alert variant={restoreStatus.type === "error" ? "destructive" : "default"}>
                    {restoreStatus.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{restoreStatus.message}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleImportData} disabled={isRestoring || !restoreData.trim()} className="w-full">
                  {isRestoring ? "Restoring..." : "Restore Data"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Current Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Employees:</span>
                      <span className="font-medium">{dataStats.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Break Entries:</span>
                      <span className="font-medium">{dataStats.totalBreakEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Size:</span>
                      <span className="font-medium">{(dataStats.dataSize / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium text-xs">
                        {dataStats.lastUpdate ? new Date(dataStats.lastUpdate).toLocaleString() : "Never"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      employees.reduce(
                        (acc, emp) => {
                          acc[emp.department] = (acc[emp.department] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([dept, count]) => (
                      <div key={dept} className="flex justify-between">
                        <span>{dept}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Storage Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Local Storage:</strong> Data is stored locally in your browser. It will persist between
                    sessions but may be cleared if you clear browser data.
                  </p>
                  <p>
                    <strong>Backup Recommendation:</strong> Regular backups are recommended to prevent data loss.
                  </p>
                  <p>
                    <strong>Data Format:</strong> Backups are saved in JSON format and include all employee information
                    and break entries with timestamps.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
