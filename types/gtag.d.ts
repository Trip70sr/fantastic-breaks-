// TypeScript declarations for Google Analytics gtag

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent",
      targetId: string | Date,
      config?: {
        page_location?: string
        page_title?: string
        page_path?: string
        anonymize_ip?: boolean
        allow_google_signals?: boolean
        allow_ad_personalization_signals?: boolean
        storage?: string
        custom_map?: Record<string, string>
        restricted_data_processing?: boolean
        event_category?: string
        event_label?: string
        value?: number
        [key: string]: any
      },
    ) => void
    dataLayer: any[]
  }
}

// Google Analytics 4 Event Parameters
export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Custom event types for Employee Break App
export interface EmployeeEvent extends GAEvent {
  employee_name?: string
  department?: string
  action_type?: "add" | "edit" | "delete" | "bulk_import"
}

export interface BreakEvent extends GAEvent {
  break_type?: "first" | "second" | "lunch"
  coverage_assigned?: boolean
  duration_minutes?: number
}

export interface DataEvent extends GAEvent {
  data_type?: "employee" | "schedule" | "break" | "full_backup"
  record_count?: number
  file_format?: "csv" | "json"
}

export interface ShareEvent extends GAEvent {
  share_method?: "email" | "link" | "qr_code"
  recipient_count?: number
  access_level?: "view" | "edit" | "admin"
}

export interface ErrorEvent extends GAEvent {
  error_type?: "validation" | "api" | "network" | "permission"
  error_code?: string
  component?: string
}

export interface EngagementEvent extends GAEvent {
  feature_name?: string
  session_duration?: number
  interaction_count?: number
}

// Consent types for GDPR compliance
export type ConsentType =
  | "analytics_storage"
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage"

export type ConsentValue = "granted" | "denied"

export interface ConsentSettings {
  [key: string]: ConsentValue
}
