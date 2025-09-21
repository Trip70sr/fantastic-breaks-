"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, Database, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function DataBackupRestore() {
  const [backupData, setBackupData] = useState("")
  const [isRestoring, setIsRestoring] = useState(false)

  const handleBackup = () => {
    try {
      const data = {
        employees: JSON.parse(localStorage.getItem("employees") || "[]"),
        breakEntries: JSON.parse(localStorage.getItem("breakEntries") || "[]"),
        timestamp: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(data, null, 2)
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
      const data = JSON.parse(backupData)

      if (data.employees) {
        localStorage.setItem("employees", JSON.stringify(data.employees))
      }
      if (data.breakEntries) {
        localStorage.setItem("breakEntries", JSON.stringify(data.breakEntries))
      }

      toast.success("Data restored successfully. Please refresh the page.")
      setBackupData("")
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Backup & Restore
        </CardTitle>
        <CardDescription>Backup your data or restore from a previous backup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Create Backup</h4>
            <p className="text-sm text-muted-foreground mb-3">Download a backup of all your employee and break data</p>
            <Button onClick={handleBackup} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Backup
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Restore from Backup</h4>
            <p className="text-sm text-muted-foreground mb-3">Upload a backup file or paste backup data to restore</p>

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
                  rows={6}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <Button onClick={handleRestore} disabled={!backupData.trim() || isRestoring} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {isRestoring ? "Restoring..." : "Restore Data"}
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important Notes:</p>
                <ul className="mt-1 text-yellow-700 space-y-1">
                  <li>• Restoring will overwrite all current data</li>
                  <li>• Make sure to backup current data before restoring</li>
                  <li>• Refresh the page after restoring to see changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
