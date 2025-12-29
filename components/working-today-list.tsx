"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import type { Employee } from "@/lib/types"

interface WorkingTodayListProps {
  employees: Employee[]
}

export default function WorkingTodayList({ employees }: WorkingTodayListProps) {
  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="italic text-gray-500">No employees assigned today</p>
            <p className="text-sm mt-1">Use "Assign Employees for Breaks" to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Working Today
          </span>
          <Badge variant="secondary">{employees.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {employees
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((e) => (
              <li key={e.id} className="p-2 border rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{e.name}</span>
                  <span className="text-sm text-muted-foreground">{e.department}</span>
                </div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}
