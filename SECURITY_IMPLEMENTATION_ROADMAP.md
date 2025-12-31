# Security & Compliance Implementation Roadmap
## Employee Break Protocol System

---

## EXECUTIVE SUMMARY

This document outlines the security enhancements needed to move from the current localStorage-based prototype to a production-ready workforce scheduling and break compliance system.

**Current Risk Level**: HIGH (not production-ready)  
**Target Risk Level**: LOW (enterprise-ready)  
**Estimated Implementation Time**: 4-6 weeks

---

## PHASE 1: CRITICAL SECURITY FIXES (Week 1-2)

### 1.1 Real Authentication System

**Current Problem**: Passwords stored in localStorage with weak hashing

**Solution**: Implement Supabase Auth or NextAuth.js

```typescript
// Recommended: Supabase Auth
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sign up with role
export async function signUpAdmin(email: string, password: string, role: AdminRole) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        created_at: new Date().toISOString()
      }
    }
  })
  return { data, error }
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}
```

**Benefits**:
- Industry-standard bcrypt password hashing
- Automatic session management
- Email verification
- Password reset flows
- MFA support available

### 1.2 Server-Side Data Storage

**Current Problem**: All data in localStorage (insecure, not scalable)

**Solution**: Migrate to Supabase PostgreSQL database

```sql
-- employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- break_entries table
CREATE TABLE break_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  break1_start TIME,
  break1_end TIME,
  break2_start TIME,
  break2_end TIME,
  coverage_employee_id UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- audit_trail table (IMMUTABLE)
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_role TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address INET,
  CONSTRAINT no_delete CHECK (true) -- Prevent deletes
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Policies: Only managers can modify employees
CREATE POLICY "Managers can manage employees"
  ON employees
  FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('manager', 'hr_admin', 'admin', 'director')
  );

-- Everyone can read employees
CREATE POLICY "All can read employees"
  ON employees
  FOR SELECT
  USING (true);

-- Audit trail is append-only
CREATE POLICY "Audit trail append only"
  ON audit_trail
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read audit trail"
  ON audit_trail
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('hr_admin', 'admin', 'director')
  );
```

### 1.3 Session Security

**Implementation**:

```typescript
// middleware.ts - Enhanced with real session checking
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // No session = redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check role for management routes
  if (req.nextUrl.pathname.startsWith('/admin/employees')) {
    const userRole = session?.user?.user_metadata?.role

    if (!['manager', 'hr_admin', 'admin', 'director'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Auto-logout after 30 minutes inactivity
  if (session) {
    const lastActivity = req.cookies.get('last_activity')?.value
    const now = Date.now()
    
    if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?timeout=true', req.url))
    }

    // Update last activity
    res.cookies.set('last_activity', now.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 // 30 minutes
    })
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}
```

---

## PHASE 2: BREAK COMPLIANCE AUTOMATION (Week 3)

### 2.1 Real-Time Break Monitoring

**Current**: Manual analysis only  
**Needed**: Automatic monitoring with alerts

```typescript
// lib/break-monitor-service.ts
import { supabase } from './supabase-client'
import { sendEmail } from './email-service'

export async function monitorBreaksRealTime(date: string) {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM

  // Check for first break violations (after 1:00 PM)
  if (currentTime === '13:00') {
    const { data: employees } = await supabase
      .from('employees')
      .select('*, break_entries!inner(date, break1_start)')
      .eq('status', 'active')
      .eq('break_entries.date', date)
      .is('break_entries.break1_start', null)

    if (employees && employees.length > 0) {
      await sendBreakViolationAlert({
        type: 'first_break_missing',
        employees: employees.map(e => e.name),
        time: '1:00 PM',
        date
      })
    }
  }

  // Check for second break violations (after 3:30 PM)
  if (currentTime === '15:30') {
    const { data: employees } = await supabase
      .from('employees')
      .select('*, break_entries!inner(date, break2_start, shift_start, shift_end)')
      .eq('status', 'active')
      .eq('break_entries.date', date)
      .is('break_entries.break2_start', null)

    // Filter for 6.5+ hour shifts
    const eligibleEmployees = employees?.filter(e => {
      const entry = e.break_entries[0]
      const shiftHours = calculateShiftHours(entry.shift_start, entry.shift_end)
      return shiftHours >= 6.5
    })

    if (eligibleEmployees && eligibleEmployees.length > 0) {
      await sendBreakViolationAlert({
        type: 'second_break_missing',
        employees: eligibleEmployees.map(e => e.name),
        time: '3:30 PM',
        date
      })
    }
  }
}

// Run this as a cron job every 15 minutes
export async function setupBreakMonitoring() {
  // Using Vercel Cron Jobs
  // vercel.json:
  // {
  //   "crons": [{
  //     "path": "/api/cron/monitor-breaks",
  //     "schedule": "*/15 * * * *"
  //   }]
  // }
}
```

### 2.2 Email Notification System

**Current**: Simulated emails only  
**Needed**: Real email delivery with Resend

```typescript
// lib/email-service.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface BreakViolationAlert {
  type: 'first_break_missing' | 'second_break_missing' | 'excessive_break'
  employees: string[]
  time: string
  date: string
}

export async function sendBreakViolationAlert(alert: BreakViolationAlert) {
  const recipients = await getManagementEmails()

  const subject = getAlertSubject(alert.type)
  const html = generateAlertHTML(alert)

  const { data, error } = await resend.emails.send({
    from: 'Break Compliance <alerts@yourdomain.com>',
    to: recipients,
    subject,
    html,
    replyTo: 'no-reply@yourdomain.com'
  })

  // Log email sent to audit trail
  await logAuditEntry({
    action: 'email_sent',
    actor: 'system',
    actorRole: 'system',
    details: {
      type: alert.type,
      recipients,
      employees: alert.employees,
      success: !error
    }
  })

  return { data, error }
}

function getAlertSubject(type: string): string {
  switch (type) {
    case 'first_break_missing':
      return '🚨 URGENT: First Break Violations Detected'
    case 'second_break_missing':
      return '⚠️ ALERT: Second Break Violations Detected'
    case 'excessive_break':
      return '💰 ALERT: Excessive Break Duration Detected'
    default:
      return 'Break Compliance Alert'
  }
}

function generateAlertHTML(alert: BreakViolationAlert): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .alert-box { background: #fee; border-left: 4px solid #c00; padding: 20px; }
        .employee-list { margin: 10px 0; padding: 10px; background: #fff; }
        .action-button { 
          background: #0070f3; 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          border-radius: 5px;
          display: inline-block;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="alert-box">
        <h2>Break Compliance Violation Detected</h2>
        <p><strong>Type:</strong> ${alert.type.replace('_', ' ').toUpperCase()}</p>
        <p><strong>Date:</strong> ${alert.date}</p>
        <p><strong>Time Detected:</strong> ${alert.time}</p>
        
        <div class="employee-list">
          <h3>Affected Employees (${alert.employees.length})</h3>
          <ul>
            ${alert.employees.map(name => `<li>${name}</li>`).join('')}
          </ul>
        </div>

        <p><strong>Required Action:</strong> Please review the break logs and take corrective action immediately to minimize compliance risk and revenue impact.</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/compliance" class="action-button">
          View Compliance Dashboard
        </a>
      </div>

      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        This is an automated alert from the Employee Break Protocol system. 
        Do not reply to this email.
      </p>
    </body>
    </html>
  `
}

async function getManagementEmails(): Promise<string[]> {
  const { data } = await supabase
    .from('users')
    .select('email')
    .in('role', ['manager', 'hr_admin', 'admin', 'director'])
    .eq('notifications_enabled', true)

  return data?.map(u => u.email) || []
}
```

### 2.3 Escalation Logic

```typescript
// lib/alert-escalation.ts
export async function handleEscalation(violation: BreakViolation) {
  // First alert → Manager only
  const firstAlert = await sendBreakViolationAlert({
    type: violation.violationType,
    employees: [violation.employeeName],
    time: new Date().toLocaleTimeString(),
    date: violation.date
  })

  // If not acknowledged in 15 minutes, escalate
  setTimeout(async () => {
    const acknowledged = await checkIfAcknowledged(violation.id)
    
    if (!acknowledged) {
      // Second alert → Manager + Admin
      await sendEscalationAlert({
        level: 2,
        violation,
        originalAlertTime: new Date(Date.now() - 15 * 60 * 1000)
      })
    }
  }, 15 * 60 * 1000) // 15 minutes

  // End of day summary → All management
  scheduleEndOfDaySummary(violation.date)
}
```

---

## PHASE 3: AUDIT & COMPLIANCE PROTECTION (Week 4)

### 3.1 Immutable Audit Trail

**Critical**: Audit logs must be tamper-proof for legal defense

```sql
-- Create audit table with append-only constraint
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_state JSONB,
  after_state JSONB,
  ip_address INET,
  user_agent TEXT,
  reason TEXT,
  CONSTRAINT no_update_or_delete CHECK (true) -- Prevents updates/deletes
);

-- Function to prevent modifications
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Audit trail records cannot be modified or deleted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_trail
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- Policy: Anyone can append, only admin can read all
CREATE POLICY "Append only audit trail"
  ON audit_trail
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read all audits"
  ON audit_trail
  FOR SELECT
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR
    actor_id = auth.uid() -- Users can see their own actions
  );
```

### 3.2 Wage Claim Defense Package

```typescript
// lib/wage-claim-defense.ts
export async function generateWageClaimDefensePackage(
  employeeId: string,
  startDate: string,
  endDate: string
) {
  // Gather all evidence
  const breakEntries = await getBreakEntriesForPeriod(employeeId, startDate, endDate)
  const violations = await getViolationsForEmployee(employeeId, startDate, endDate)
  const auditTrail = await getAuditTrailForEmployee(employeeId, startDate, endDate)
  const scheduleHistory = await getScheduleHistory(employeeId, startDate, endDate)

  // Calculate compliance metrics
  const totalShifts = breakEntries.length
  const shiftsWithBreaks = breakEntries.filter(e => e.break1_start).length
  const complianceRate = (shiftsWithBreaks / totalShifts) * 100

  // Generate PDF report
  const pdf = await generatePDF({
    employee: await getEmployee(employeeId),
    period: { startDate, endDate },
    summary: {
      totalShifts,
      shiftsWithBreaks,
      complianceRate,
      totalViolations: violations.length,
      violationsByType: groupBy(violations, 'violationType')
    },
    evidence: {
      breakEntries,
      violations,
      auditTrail,
      scheduleHistory
    },
    coloradoLawReferences: getColoradoLawReferences(),
    systemCertification: {
      automated: true,
      algorithmVersion: '1.0.0',
      complianceStandard: 'Colorado Wage Order #38',
      generatedAt: new Date().toISOString()
    }
  })

  return pdf
}
```

---

## PHASE 4: PRODUCTION HARDENING (Week 5-6)

### 4.1 Rate Limiting & Security Headers

```typescript
// middleware.ts additions
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export async function middleware(req: NextRequest) {
  // Rate limiting
  const ip = req.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  const res = NextResponse.next()

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  return res
}
```

### 4.2 Input Validation with Zod

```typescript
// lib/validation/break-entry.ts
import { z } from 'zod'

export const BreakEntrySchema = z.object({
  employeeId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  shiftStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  shiftEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  break1Start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  break1End: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  break2Start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  break2End: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  coverageEmployeeId: z.string().uuid().optional(),
}).refine(data => {
  // Validate break times are within shift
  if (data.break1Start && data.break1End) {
    return data.break1Start >= data.shiftStart && data.break1End <= data.shiftEnd
  }
  return true
}, {
  message: 'Break times must be within shift hours'
})

// Use in API routes
export async function POST(req: Request) {
  const body = await req.json()
  
  // Validate input
  const validation = BreakEntrySchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json({
      error: 'Invalid input',
      details: validation.error.flatten()
    }, { status: 400 })
  }

  // Proceed with validated data
  const entry = validation.data
  // ... rest of logic
}
```

### 4.3 Error Monitoring

```typescript
// lib/error-monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

export function reportError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
    tags: {
      component: 'break-compliance',
    },
  })
}
```

---

## DEPLOYMENT CHECKLIST

### Pre-Production
- [ ] All localStorage code removed
- [ ] Real authentication implemented (Supabase/NextAuth)
- [ ] Database migrations completed
- [ ] RLS policies tested
- [ ] Email service configured (Resend)
- [ ] Cron jobs set up (break monitoring)
- [ ] Environment variables configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Error monitoring configured (Sentry)

### Testing
- [ ] Unit tests for break compliance logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical flows
- [ ] Load testing (100+ concurrent users)
- [ ] Security audit (penetration testing)
- [ ] Accessibility audit (WCAG 2.1 AA)

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] User manual updated
- [ ] Admin guide created
- [ ] Runbook for on-call
- [ ] Data retention policy documented
- [ ] Privacy policy updated
- [ ] Terms of service updated

### Monitoring
- [ ] Uptime monitoring (UptimeRobot/Better Uptime)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (Vercel Logs/Datadog)
- [ ] Audit log retention (7 years minimum)

---

## COST ESTIMATE

### Infrastructure (Monthly)
- Supabase Pro: $25/month
- Resend (5k emails/month): $20/month
- Upstash Rate Limiting: $10/month
- Sentry (10k events/month): Free tier
- Vercel Pro: $20/month
- **Total: ~$75/month**

### Development Time
- Phase 1: 40 hours
- Phase 2: 32 hours
- Phase 3: 24 hours
- Phase 4: 24 hours
- **Total: 120 hours (~3 weeks full-time)**

---

## NEXT STEPS

**Choose Your Path:**

### Option A: Full Production Migration (Recommended)
"Implement all 4 phases - I want a production-ready system"
- Database migration with Supabase
- Real authentication
- Email notifications
- Immutable audit trail
- **Timeline: 4-6 weeks**

### Option B: Quick Security Fixes Only
"Fix critical security issues but keep localStorage for now"
- Better password hashing
- Session timeout
- Input validation
- **Timeline: 1 week**

### Option C: Email Notifications First
"Get email alerts working, security later"
- Integrate Resend
- Set up cron jobs for monitoring
- Basic alert system
- **Timeline: 1 week**

### Option D: Audit Trail Hardening
"Make the audit system legally defensible"
- Database migration for audit logs only
- Immutable storage
- Wage claim defense package generator
- **Timeline: 2 weeks**

---

## RECOMMENDED PRIORITY

Based on your requirements document, I recommend:

**Week 1-2**: Phase 1 (Authentication + Database)  
**Week 3**: Phase 2 (Email Notifications)  
**Week 4**: Phase 3 (Audit Trail)  
**Week 5-6**: Phase 4 (Production Hardening)

This gives you a legally defensible, production-ready system with real-time compliance monitoring and automated management alerts.

**What would you like to implement first?**
