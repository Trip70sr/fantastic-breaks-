"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { loadNotificationLogs } from "@/lib/notification-system"
import type { NotificationLog } from "@/lib/notification-system"

export default function NotificationHistory() {
  const [logs, setLogs] = useState<NotificationLog[]>([])

  useEffect(() => {
    setLogs(loadNotificationLogs())
  }, [])

  const getTypeIcon = (type: NotificationLog["type"]) => {
    switch (type) {
      case "immediate_alert":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "daily_threshold":
        return <Bell className="h-4 w-4 text-orange-600" />
      case "monthly_threshold":
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getTypeBadge = (type: NotificationLog["type"]) => {
    switch (type) {
      case "immediate_alert":
        return <Badge variant="destructive">Immediate</Badge>
      case "daily_threshold":
        return <Badge variant="secondary">Daily</Badge>
      case "monthly_threshold":
        return <Badge variant="default">Monthly</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-blue-900">Notification History</h3>
        <p className="text-sm text-blue-600">View all sent and pending notification alerts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>History of all violation alerts and threshold notifications</CardDescription>
            </div>
            <Badge variant="outline">{logs.length} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications have been sent yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Notifications will appear here when violation thresholds are exceeded
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {logs
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((log, index) => (
                    <div key={log.id}>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getTypeIcon(log.type)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {getTypeBadge(log.type)}
                              {log.sent ? (
                                <Badge variant="outline" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Sent
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>

                            <p className="text-sm font-medium">{log.message}</p>

                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                              <span>•</span>
                              <span>{log.violationCount} violations</span>
                              <span>•</span>
                              <span>{log.affectedEmployees.length} employees</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < logs.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
