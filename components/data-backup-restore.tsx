"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, AlertCircle, CheckCircle } from "lucide-react"
import type { Employee, BreakEntry } from "@/lib/types"
import { toast } from "sonner"

interface DataBackupRestoreProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onDataImport: (data: { employees: Employee[]; breakEntries: BreakEntry[] }) => void
}

export function DataBackupRestore({ employees, breakEntries, onDataImport }: DataBackupRestoreProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  const exportData = () => {
    const data = {
      employees,
      breakEntries,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `employee-break-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Data exported successfully")
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus("idle")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate data structure
        if (
          !data.employees ||
          !data.breakEntries ||
          !Array.isArray(data.employees) ||
          !Array.isArray(data.breakEntries)
        ) {
          throw new Error("Invalid data format")
        }

        // Validate employee structure
        const validEmployees = data.employees.every(
          (emp: any) => emp.id && emp.name && emp.department && typeof emp.isActive === "boolean",
        )

        // Validate break entry structure
        const validBreakEntries = data.breakEntries.every((entry: any) => entry.id && entry.employeeId && entry.date)

        if (!validEmployees || !validBreakEntries) {
          throw new Error("Invalid data structure")
        }

        onDataImport({
          employees: data.employees,
          breakEntries: data.breakEntries,
        })

        setImportStatus("success")
        toast.success("Data imported successfully")
      } catch (error) {
        console.error("Import error:", error)
        setImportStatus("error")
        toast.error("Failed to import data. Please check the file format.")
      } finally {
        setIsImporting(false)
      }
    }

    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      onDataImport({ employees: [], breakEntries: [] })
      toast.success("All data cleared")
    }
  }

  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset to default data? This will overwrite all current data.")) {
      // Import default data
      import("@/lib/data").then(({ defaultEmployees, defaultBreakEntries }) => {
        onDataImport({
          employees: defaultEmployees,
          breakEntries: defaultBreakEntries,
        })
        toast.success("Data reset to defaults")
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Backup, restore, and manage your employee break data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export Data</h3>
            <p className="text-sm text-muted-foreground">
              Download a backup of all employee and break schedule data as a JSON file.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={exportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <div className="text-sm text-muted-foreground">
                {employees.length} employees, {breakEntries.length} break entries
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Import Data</h3>
            <p className="text-sm text-muted-foreground">
              Upload a previously exported JSON file to restore your data. This will replace all current data.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="file-import" className="cursor-pointer">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled={isImporting}>
                    <Upload className="h-4 w-4" />
                    {isImporting ? "Importing..." : "Choose File"}
                  </Button>
                </Label>
                <Input id="file-import" type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </div>

              {importStatus === "success" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Data imported successfully! All employee and break schedule data has been updated.
                  </AlertDescription>
                </Alert>
              )}

              {importStatus === "error" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Failed to import data. Please ensure the file is a valid JSON export from this application.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Reset Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Reset Data</h3>
            <p className="text-sm text-muted-foreground">
              Reset your data to default values or clear all data completely.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button variant="destructive" onClick={clearAllData}>
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Data Summary */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Current Data Summary</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Employees</div>
                <div className="text-2xl font-bold">{employees.length}</div>
                <div className="text-sm text-muted-foreground">
                  {employees.filter((emp) => emp.isActive).length} active,{" "}
                  {employees.filter((emp) => !emp.isActive).length} inactive
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Break Entries</div>
                <div className="text-2xl font-bold">{breakEntries.length}</div>
                <div className="text-sm text-muted-foreground">Across all dates and employees</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
