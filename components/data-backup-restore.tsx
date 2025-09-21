"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, AlertCircle, FileText } from "lucide-react"
import { toast } from "sonner"

interface DataBackupRestoreProps {
  isOpen: boolean
  onClose: () => void
}

export default function DataBackupRestore({ isOpen, onClose }: DataBackupRestoreProps) {
  const [backupData, setBackupData] = useState("")
  const [isRestoring, setIsRestoring] = useState(false)

  const handleBackup = () => {
    try {
      const employees = JSON.parse(localStorage.getItem("employees") || "[]")
      const breakEntries = JSON.parse(localStorage.getItem("breakEntries") || "[]")

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
        },
      }

      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `employee-breaks-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()

      URL.revokeObjectURL(url)
      toast.success("Backup created successfully")
    } catch (error) {
      toast.error("Failed to create backup")
    }
  }

  const handleRestore = () => {
    if (!backupData.trim()) {
      toast.error("Please paste backup data first")
      return
    }

    setIsRestoring(true)
    try {
      const backup = JSON.parse(backupData)

      if (!backup.data || !backup.data.employees || !backup.data.breakEntries) {
        throw new Error("Invalid backup format")
      }

      localStorage.setItem("employees", JSON.stringify(backup.data.employees))
      localStorage.setItem("breakEntries", JSON.stringify(backup.data.breakEntries))

      toast.success("Data restored successfully. Please refresh the page.")
      setBackupData("")
      onClose()
    } catch (error) {
      toast.error("Invalid backup data format")
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
      setBackupData(content)
    }
    reader.readAsText(file)
  }

  const copyBackupToClipboard = () => {
    try {
      const employees = JSON.parse(localStorage.getItem("employees") || "[]")
      const breakEntries = JSON.parse(localStorage.getItem("breakEntries") || "[]")

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
        },
      }

      const dataStr = JSON.stringify(backup, null, 2)
      navigator.clipboard.writeText(dataStr)
      toast.success("Backup data copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy backup data")
    }
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
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {JSON.parse(localStorage.getItem("employees") || "[]").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {JSON.parse(localStorage.getItem("breakEntries") || "[]").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Break Entries</div>
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
              <p className="text-sm text-muted-foreground">
                Download a complete backup of your employee and break entry data.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleBackup} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Backup File
                </Button>
                <Button
                  variant="outline"
                  onClick={copyBackupToClipboard}
                  className="flex items-center gap-2 bg-transparent"
                >
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
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Restoring from backup will completely replace all current data. This action
                  cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="backup-file">Upload Backup File</Label>
                  <Input id="backup-file" type="file" accept=".json" onChange={handleFileUpload} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="backup-data">Or Paste Backup Data</Label>
                  <Textarea
                    id="backup-data"
                    placeholder="Paste your backup JSON data here..."
                    value={backupData}
                    onChange={(e) => setBackupData(e.target.value)}
                    rows={8}
                    className="mt-1 font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleRestore}
                  disabled={!backupData.trim() || isRestoring}
                  className="w-full"
                  variant="destructive"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isRestoring ? "Restoring..." : "Restore Data"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
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
                  <li>Upload a backup file or paste the backup data</li>
                  <li>Click "Restore Data" to replace all current data</li>
                  <li>Refresh the page to see the restored data</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
