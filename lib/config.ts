// Application configuration using environment variables
import { env } from "./env"

export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    url: env.NEXTAUTH_URL,
    environment: env.NODE_ENV,
  },

  company: {
    name: env.NEXT_PUBLIC_COMPANY_NAME,
    supportEmail: env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },

  email: {
    apiKey: env.SENDGRID_API_KEY,
    fromEmail: env.FROM_EMAIL,
    directorEmail: env.DIRECTOR_EMAIL,
  },

  database: {
    url: env.DATABASE_URL,
  },

  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },

  features: {
    emailSharing: env.NEXT_PUBLIC_ENABLE_EMAIL_SHARING,
    notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  },

  // Default notification thresholds
  notifications: {
    breakComplianceThreshold: 85,
    coverageComplianceThreshold: 90,
    overtimeLimit: 3,
    missingBreaksLimit: 2,
  },

  // Rate limiting
  rateLimiting: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // File upload limits
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
}

export default config
