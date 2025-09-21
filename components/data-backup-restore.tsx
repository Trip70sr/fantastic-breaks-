"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, FileText, AlertCircle, CheckCircle } from "lucide-react"
import type { Employee, BreakEntry, BackupData } from "@/lib/types"
import { toast } from "sonner"

interface DataBackupRestoreProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onDataRestore: (data: { employees: Employee[]; breakEntries: BreakEntry[] }) => void
}

export function DataBackupRestore({ employees, breakEntries, onDataRestore }: DataBackupRestoreProps) {
  const [importData, setImportData] = useState("")
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null)

  const handleExport = () => {
    const backupData: BackupData = {
      employees,
      breakEntries,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `employee-break-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Data exported successfully")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      validateJson(content)
    }
    reader.readAsText(file)
  }

  const validateJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)

      // Check if it has the required structure
      if (data.employees && data.breakEntries && Array.isArray(data.employees) && Array.isArray(data.breakEntries)) {
        setIsValidJson(true)
      } else {
        setIsValidJson(false)
      }
    } catch (error) {
      setIsValidJson(false)
    }
  }

  const handleImport = () => {
    if (!importData || !isValidJson) {
      toast.error("Please provide valid backup data")
      return
    }

    try {
      const backupData: BackupData = JSON.parse(importData)

      // Validate data structure
      if (!backupData.employees || !backupData.breakEntries) {
        throw new Error("Invalid backup format")
      }

      // Validate employees array
      if (!Array.isArray(backupData.employees)) {
        throw new Error("Employees data is not in correct format")
      }

      // Validate break entries array
      if (!Array.isArray(backupData.breakEntries)) {
        throw new Error("Break entries data is not in correct format")
      }

      // Restore the data
      onDataRestore({
        employees: backupData.employees,
        breakEntries: backupData.breakEntries,
      })

      setImportData("")
      setIsValidJson(null)
      toast.success("Data imported successfully")
    } catch (error) {
      console.error("Import error:", error)
      toast.error("Failed to import data. Please check the file format.")
    }
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("employees")
      localStorage.removeItem("breakEntries")
      onDataRestore({ employees: [], breakEntries: [] })
      toast.success("All data cleared")
    }
  }

  const generateSampleData = () => {
    const sampleData: BackupData = {
      employees: [
        {
          id: "sample-1",
          name: "John Doe",
          email: "john.doe@company.com",
          department: "Customer Service",
          position: "Representative",
          startDate: "2023-01-15",
          isActive: true,
        },
      ],
      breakEntries: [
        {
          id: "sample-break-1",
          employeeId: "sample-1",
          employeeName: "John Doe",
          date: new Date().toISOString().split("T")[0],
          break1Start: "10:00",
          break1End: "10:15",
          break1Coverage: "Jane Smith",
          break2Start: "14:00",
          break2End: "14:15",
          break2Coverage: "Bob Johnson",
          notes: "Regular schedule",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    setImportData(JSON.stringify(sampleData, null, 2))
    setIsValidJson(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Backup & Restore
          </CardTitle>
          <CardDescription>Export your data for backup or import data from a previous backup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export Data</h3>
            <p className="text-sm text-muted-foreground">
              Download all employee and break entry data as a JSON file for backup purposes.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <div className="text-sm text-muted-foreground">
                {employees.length} employees, {breakEntries.length} break entries
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Import Data</h3>
            <p className="text-sm text-muted-foreground">
              Upload a backup file to restore your data. This will replace all current data.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Backup File</Label>
                <Input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-data">Or Paste JSON Data</Label>
                <Textarea
                  id="json-data"
                  placeholder="Paste your backup JSON data here..."
                  value={importData}
                  onChange={(e) => {
                    setImportData(e.target.value)
                    validateJson(e.target.value)
                  }}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              {isValidJson !== null && (
                <Alert className={isValidJson ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {isValidJson ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={isValidJson ? "text-green-700" : "text-red-700"}>
                      {isValidJson
                        ? "Valid backup data format detected"
                        : "Invalid JSON format or missing required fields"}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="flex items-center gap-2">
                <Button onClick={handleImport} disabled={!isValidJson} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
                <Button
                  variant="outline"
                  onClick={generateSampleData}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <FileText className="h-4 w-4" />
                  Load Sample Data
                </Button>
              </div>
            </div>
          </div>

          {/* Clear Data Section */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete all data from the application. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleClearData} className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
