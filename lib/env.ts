// Environment variable validation and type safety
import { z } from "zod"

const envSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("Employee Break Protocol App"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Authentication
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(32),

  // Email Configuration
  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  DIRECTOR_EMAIL: z.string().email().optional(),

  // Database
  DATABASE_URL: z.string().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_EMAIL_SHARING: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // Company Settings
  NEXT_PUBLIC_COMPANY_NAME: z.string().default("Your Company"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),
})

type Env = z.infer<typeof envSchema>

// Validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error("❌ Invalid environment variables:", error)
    throw new Error("Invalid environment variables")
  }
}

export const env = validateEnv()

// Helper functions
export const isProduction = env.NODE_ENV === "production"
export const isDevelopment = env.NODE_ENV === "development"
export const isTest = env.NODE_ENV === "test"

// Feature flags
export const features = {
  emailSharing: env.NEXT_PUBLIC_ENABLE_EMAIL_SHARING,
  notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
}

// Email configuration check
export const hasEmailConfig = !!(env.SENDGRID_API_KEY && env.FROM_EMAIL)

// Database configuration check
export const hasDatabaseConfig = !!env.DATABASE_URL

// Supabase configuration check
export const hasSupabaseConfig = !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
