"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, RefreshCw, Database, AlertCircle, CheckCircle } from "lucide-react"
import type { Employee, BreakEntry } from "@/lib/types"
import { toast } from "sonner"

interface DataBackupRestoreProps {
  employees: Employee[]
  breakEntries: BreakEntry[]
  onEmployeesChange: (employees: Employee[]) => void
  onBreakEntriesChange: (breakEntries: BreakEntry[]) => void
}

export function DataBackupRestore({
  employees,
  breakEntries,
  onEmployeesChange,
  onBreakEntriesChange,
}: DataBackupRestoreProps) {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [restoreProgress, setRestoreProgress] = useState(0)

  const createBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const progressInterval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)

          // Create backup data
          const backupData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            employees,
            breakEntries,
            metadata: {
              totalEmployees: employees.length,
              totalBreakEntries: breakEntries.length,
              activeEmployees: employees.filter((emp) => emp.isActive).length,
            },
          }

          // Download backup file
          const blob = new Blob([JSON.stringify(backupData, null, 2)], {
            type: "application/json",
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `employee-break-backup-${new Date().toISOString().split("T")[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          setIsBackingUp(false)
          toast.success("Backup created and downloaded successfully")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json") {
      toast.error("Please select a valid JSON backup file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string)
        restoreFromBackup(backupData)
      } catch (error) {
        toast.error("Invalid backup file format")
      }
    }
    reader.readAsText(file)
  }

  const restoreFromBackup = (backupData: any) => {
    setIsRestoring(true)
    setRestoreProgress(0)

    // Validate backup data structure
    if (!backupData.employees || !backupData.breakEntries) {
      toast.error("Invalid backup file structure")
      setIsRestoring(false)
      return
    }

    // Simulate restore progress
    const progressInterval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)

          // Restore data
          onEmployeesChange(backupData.employees)
          onBreakEntriesChange(backupData.breakEntries)

          // Update localStorage
          localStorage.setItem("employees", JSON.stringify(backupData.employees))
          localStorage.setItem("breakEntries", JSON.stringify(backupData.breakEntries))

          setIsRestoring(false)
          toast.success("Data restored successfully from backup")
          return 100
        }
        return prev + 12.5
      })
    }, 300)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      onEmployeesChange([])
      onBreakEntriesChange([])
      localStorage.removeItem("employees")
      localStorage.removeItem("breakEntries")
      toast.success("All data cleared successfully")
    }
  }

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset to default data? This will overwrite all current data.")) {
      // Import initial data
      import("@/lib/data").then(({ initialEmployees, initialBreakEntries }) => {
        onEmployeesChange(initialEmployees)
        onBreakEntriesChange(initialBreakEntries)
        localStorage.setItem("employees", JSON.stringify(initialEmployees))
        localStorage.setItem("breakEntries", JSON.stringify(initialBreakEntries))
        toast.success("Data reset to defaults successfully")
      })
    }
  }

  const totalRecords = employees.length + breakEntries.length
  const activeEmployees = employees.filter((emp) => emp.isActive).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Backup Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup Data
            </CardTitle>
            <CardDescription>Create a backup of all your employee and break schedule data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Employees:</span>
                <span className="font-medium">{employees.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Employees:</span>
                <span className="font-medium">{activeEmployees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Break Entries:</span>
                <span className="font-medium">{breakEntries.length}</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Total Records:</span>
                <span>{totalRecords}</span>
              </div>
            </div>

            {isBackingUp && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating backup...
                </div>
                <Progress value={backupProgress} className="w-full" />
              </div>
            )}

            <Button onClick={createBackup} disabled={isBackingUp || totalRecords === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isBackingUp ? "Creating Backup..." : "Download Backup"}
            </Button>

            {totalRecords === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No data available to backup. Add employees and break schedules first.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Restore Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore Data
            </CardTitle>
            <CardDescription>Restore your data from a previously created backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Restoring from backup will replace all current data. Make sure to create a backup first if needed.
              </AlertDescription>
            </Alert>

            {isRestoring && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Restoring data...
                </div>
                <Progress value={restoreProgress} className="w-full" />
              </div>
            )}

            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isRestoring}
                className="hidden"
                id="backup-file"
              />
              <Button asChild disabled={isRestoring} className="w-full bg-transparent" variant="outline">
                <label htmlFor="backup-file" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {isRestoring ? "Restoring..." : "Select Backup File"}
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Advanced data management options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Reset to Defaults</h4>
              <p className="text-sm text-muted-foreground">
                Restore the application to its initial state with sample data
              </p>
              <Button onClick={resetToDefaults} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Clear All Data</h4>
              <p className="text-sm text-muted-foreground">Permanently delete all employees and break schedules</p>
              <Button onClick={clearAllData} variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All data is automatically saved to your browser's local storage. Regular backups are recommended to
              prevent data loss.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
