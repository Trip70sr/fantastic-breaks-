"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Employee, BreakEntry } from "@/lib/types"
import { Download, Upload, Database, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { format } from "date-fns"

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

  const generateBackup = () => {
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        employees,
        breakEntries,
      },
      metadata: {
        employeeCount: employees.length,
        breakEntryCount: breakEntries.length,
        departments: [...new Set(employees.map((e) => e.department))],
      },
    }

    return JSON.stringify(backup, null, 2)
  }

  const handleDownloadBackup = () => {
    const backupData = generateBackup()
    const blob = new Blob([backupData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `employee-break-backup-${format(new Date(), "yyyy-MM-dd-HHmm")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleRestoreData = async () => {
    if (!restoreData.trim()) {
      setRestoreStatus({
        type: "error",
        message: "Please paste backup data to restore",
      })
      return
    }

    setIsRestoring(true)
    setRestoreStatus({ type: null, message: "" })

    try {
      const backup = JSON.parse(restoreData)

      // Validate backup structure
      if (!backup.data || !backup.data.employees || !backup.data.breakEntries) {
        throw new Error("Invalid backup format. Missing required data structure.")
      }

      // Validate employees array
      if (!Array.isArray(backup.data.employees)) {
        throw new Error("Invalid backup format. Employees data is not an array.")
      }

      // Validate break entries array
      if (!Array.isArray(backup.data.breakEntries)) {
        throw new Error("Invalid backup format. Break entries data is not an array.")
      }

      // Validate employee structure
      for (const employee of backup.data.employees) {
        if (!employee.id || !employee.name || !employee.department) {
          throw new Error("Invalid employee data structure in backup.")
        }
      }

      // Validate break entry structure
      for (const entry of backup.data.breakEntries) {
        if (!entry.id || !entry.employeeId || !entry.date || !entry.shiftStart || !entry.shiftEnd) {
          throw new Error("Invalid break entry data structure in backup.")
        }
      }

      // Restore the data
      onRestoreData(backup.data.employees, backup.data.breakEntries)

      setRestoreStatus({
        type: "success",
        message: `Successfully restored ${backup.data.employees.length} employees and ${backup.data.breakEntries.length} break entries.`,
      })

      setRestoreData("")
    } catch (error) {
      setRestoreStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to restore backup data. Please check the format.",
      })
    } finally {
      setIsRestoring(false)
    }
  }

  const handleCopyBackup = () => {
    const backupData = generateBackup()
    navigator.clipboard.writeText(backupData).then(() => {
      setRestoreStatus({
        type: "success",
        message: "Backup data copied to clipboard!",
      })
    })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Backup & Restore
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Current Data Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{breakEntries.length}</div>
                  <div className="text-sm text-gray-600">Break Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {[...new Set(employees.map((e) => e.department))].length}
                  </div>
                  <div className="text-sm text-gray-600">Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {breakEntries.filter((e) => e.break1Start && e.break1End).length}
                  </div>
                  <div className="text-sm text-gray-600">With Breaks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Create Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Download a complete backup of your employee and break entry data. This includes all employees, their
                break schedules, coverage assignments, and outside therapy time.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleDownloadBackup} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Backup File
                </Button>
                <Button variant="outline" onClick={handleCopyBackup} className="flex items-center gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Restore Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Restore from Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Restoring from backup will completely replace all current data. This action
                  cannot be undone. Make sure to create a backup of your current data first.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="restore-data">Paste Backup Data</Label>
                <Textarea
                  id="restore-data"
                  placeholder="Paste your backup JSON data here..."
                  value={restoreData}
                  onChange={(e) => setRestoreData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              {restoreStatus.type && (
                <Alert variant={restoreStatus.type === "error" ? "destructive" : "default"}>
                  {restoreStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>{restoreStatus.message}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleRestoreData}
                disabled={isRestoring || !restoreData.trim()}
                className="flex items-center gap-2"
                variant="destructive"
              >
                <Upload className="h-4 w-4" />
                {isRestoring ? "Restoring..." : "Restore Data"}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>To create a backup:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Click "Download Backup File" to save a JSON file to your computer</li>
                  <li>Or click "Copy to Clipboard" to copy the backup data</li>
                  <li>Store the backup file in a safe location</li>
                </ol>
              </div>
              <div>
                <strong>To restore from backup:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Open your backup file in a text editor and copy the contents</li>
                  <li>Paste the backup data into the text area above</li>
                  <li>Click "Restore Data" to replace all current data</li>
                  <li>The page will refresh with the restored data</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
