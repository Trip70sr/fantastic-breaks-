"use client"

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export function gtag(...args: any[]) {
  if (typeof window === "undefined") return
  ;(window as any).gtag?.(...args)
}

export function setConsentFlag() {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("ga-consent", "true")
  } catch {
    // Ignore errors
  }
}

export function checkConsent(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem("ga-consent") === "true"
  } catch {
    return false
  }
}

// Alias for compatibility with existing code
export const isAnalyticsEnabled = checkConsent

export const pageview = (url: string) => {
  if (!checkConsent()) return
  gtag("config", GA_TRACKING_ID, { page_path: url })
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!checkConsent()) return
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export const trackEmployeeAction = (action: "add" | "edit" | "delete" | "import", count?: number) => {
  event({
    action: `employee_${action}`,
    category: "Employee Management",
    label: count ? `count_${count}` : undefined,
    value: count,
  })
}

export const trackBreakAction = (action: "schedule" | "modify" | "cancel" | "assign_coverage") => {
  event({
    action: `break_${action}`,
    category: "Break Management",
    label: action,
  })
}

export const trackDataAction = (action: "export" | "backup" | "restore" | "import", format?: string) => {
  event({
    action: `data_${action}`,
    category: "Data Management",
    label: format || action,
  })
}

export const trackSharingAction = (action: "email_sent" | "link_created" | "access_granted" | "shared_view") => {
  event({
    action,
    category: "Sharing & Collaboration",
    label: action,
  })
}
