# Employee Break Management Application
## Technical Specifications & Implementation Blueprint

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Blueprint](#architecture-blueprint)
4. [Security Protocols](#security-protocols)
5. [User Roles & Authentication](#user-roles--authentication)
6. [Core Features](#core-features)
7. [Data Models](#data-models)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Deployment Strategy](#deployment-strategy)
10. [Compliance & Legal Requirements](#compliance--legal-requirements)

---

## 1. Executive Summary

### Purpose
The Employee Break Management Application is a workforce compliance system designed to help businesses track, manage, and ensure compliance with Colorado labor laws regarding mandatory employee breaks.

### Business Problem Solved
- **Legal Liability**: Prevents costly wage claims and labor law violations ($1,500+ per violation)
- **Operational Efficiency**: Automates break tracking and compliance monitoring
- **Documentation**: Creates immutable audit trails for legal protection
- **Real-time Alerts**: Proactively notifies management of potential violations

### Key Stakeholders
- **Business Owners**: Legal protection and compliance assurance
- **HR/Management**: Employee scheduling and break assignment
- **Employees**: Schedule visibility and break confirmation
- **Legal/Compliance Teams**: Audit trail access and reporting

---

## 2. System Overview

### Technology Stack

**Frontend**
- Framework: Next.js 14.2.35 (App Router)
- Language: TypeScript
- UI Library: React 18
- Component Library: shadcn/ui (Radix UI primitives)
- Styling: Tailwind CSS
- Charts: Recharts
- Date Handling: date-fns
- Forms: React Hook Form + Zod validation

**Backend**
- Runtime: Next.js API Routes
- Authentication: Custom JWT-based session management
- Storage: localStorage (Phase 1), Supabase (Phase 2)
- Email: Resend API (production)

**Development Tools**
- Package Manager: pnpm
- Version Control: Git/GitHub
- Deployment: Vercel
- Linting: ESLint
- Type Checking: TypeScript strict mode

### System Requirements

**Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Performance Targets**
- Initial page load: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse Score: 90+

---

## 3. Architecture Blueprint

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Admin Portal │  │ Employee App │  │  Login Page  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATION LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  • Session Management (localStorage/cookies)                 │
│  • Role-Based Access Control (RBAC)                         │
│  • Permission Validation                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Employee Mgmt│  │  Break Logic │  │  Compliance  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Scheduling  │  │   Reporting  │  │ Notifications│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              DATA LAYER                                      │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: localStorage                                       │
│  Phase 2: Supabase PostgreSQL                               │
│  • employees        • break_entries    • audit_log          │
│  • break_assignments• compliance_data  • notifications      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────┤
│  • Email Service (Resend)                                    │
│  • Analytics (Vercel)                                        │
│  • Error Tracking (optional: Sentry)                        │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
fantastic-breaks/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing/redirect page
│   ├── login/
│   │   └── page.tsx             # Unified login page
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard
│   ├── employee-dashboard/
│   │   └── page.tsx             # Employee dashboard
│   ├── shared/
│   │   └── page.tsx             # Shared view (legacy)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── employee-management.tsx  # Employee CRUD
│   ├── employee-break-dashboard.tsx
│   ├── daily-break-list-creator.tsx
│   ├── employee-break-list-view.tsx
│   ├── compliance-monitor.tsx
│   ├── admin-reports.tsx
│   └── [other feature components]
│
├── lib/                         # Core business logic
│   ├── types.ts                # TypeScript definitions
│   ├── admin-auth.ts           # Admin authentication
│   ├── employee-auth.ts        # Employee authentication
│   ├── data.ts                 # Data management
│   ├── break-validation.ts     # Break logic validation
│   ├── break-assignments.ts    # Assignment management
│   ├── colorado-compliance.ts  # Compliance rules
│   ├── audit-trail.ts          # Audit logging
│   ├── notification-system.ts  # Email notifications
│   └── [other utilities]
│
├── middleware.ts                # Route protection
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

### Data Flow

**Admin Creates Daily Break List**
```
1. Admin selects date
2. Admin selects employees (checkboxes)
3. System creates DailyBreakList record
4. Selected employees added to list
5. Employees can now see assignment
```

**Employee Submits Schedule**
```
1. Employee logs in
2. Views assigned break list
3. Enters shift start/end times
4. System validates shift hours
5. Schedule saved, visible to managers
```

**Manager Assigns Break**
```
1. Manager views employees with schedules
2. Selects employee for break
3. Enters break start/end times
4. System validates:
   - No duplicate breaks
   - Break eligibility (shift hours)
   - Time logic (end > start)
5. Break entry saved
6. Audit trail created
7. Compliance updated
```

---

## 4. Security Protocols

### Authentication System

#### Admin Authentication
```typescript
interface AdminSession {
  username: string
  role: 'admin' | 'manager' | 'hr_admin' | 'director'
  loginTime: string
  expiresAt: string
}
```

**Security Features:**
- Password hashing using bcrypt (12 rounds)
- Session timeout: 30 minutes of inactivity
- Failed login tracking (lock after 5 attempts)
- Session tokens stored in localStorage (Phase 1)
- HTTP-only cookies (Phase 2 with Supabase)

#### Employee Authentication
```typescript
interface EmployeeSession {
  employeeId: string
  name: string
  role: 'employee' | 'manager'
  loginTime: string
  expiresAt: string
}
```

**Security Features:**
- Employee ID-based authentication
- Role-based dashboard access
- Same session management as admin
- Can only view own data (except managers)

### Role-Based Access Control (RBAC)

#### Permission Matrix

| Feature | Admin | Manager | HR Admin | Director | Employee |
|---------|-------|---------|----------|----------|----------|
| Add/Remove Employees | ✓ | ✗ | ✓ | ✗ | ✗ |
| Edit Employees | ✓ | ✗ | ✓ | ✗ | ✗ |
| View All Employees | ✓ | ✓ | ✓ | ✓ | ✗ |
| Create Break Lists | ✓ | ✓ | ✗ | ✗ | ✗ |
| Assign Breaks | ✓ | ✓ | ✗ | ✗ | ✗ |
| Submit Schedule | ✗ | ✓ | ✗ | ✗ | ✓ |
| View Compliance | ✓ | ✓ | ✓ | ✓ | ✗ |
| Approve Waivers | ✗ | ✗ | ✗ | ✓ | ✗ |
| View Reports | ✓ | ✓ | ✓ | ✓ | ✗ |
| Export Data | ✓ | ✓ | ✓ | ✓ | ✗ |
| View Audit Trail | ✓ | ✗ | ✓ | ✓ | ✗ |

#### Implementation
```typescript
const ROLE_PERMISSIONS = {
  admin: {
    viewEmployees: true,
    editEmployees: true,
    viewCompliance: true,
    createBreakLists: true,
    assignBreaks: true,
    viewReports: true,
    viewAudit: true,
    manageSettings: true
  },
  manager: {
    viewEmployees: true,
    editEmployees: false,
    viewCompliance: true,
    createBreakLists: true,
    assignBreaks: true,
    viewReports: true,
    viewAudit: false,
    manageSettings: false
  },
  // ... other roles
}
```

### Middleware Protection

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const session = getSession()
  
  // Public routes
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }
  
  // Protected routes require authentication
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Role-based route protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!hasAdminAccess(session.role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }
  
  return NextResponse.next()
}
```

### Data Security

**Phase 1 (Current - localStorage)**
- Client-side storage only
- No data encryption at rest
- Suitable for demo/development only
- **NOT production-ready**

**Phase 2 (Production - Supabase)**
- Server-side PostgreSQL database
- Row-Level Security (RLS) policies
- Encrypted at rest and in transit (TLS)
- Automatic backups
- GDPR/CCPA compliant

**Audit Trail Security**
- Immutable logs (append-only)
- Cryptographic timestamps
- Cannot be edited or deleted
- Retained for 7 years (compliance requirement)

---

## 5. User Roles & Authentication

### Admin Portal Access

#### Admin (Highest Privilege)
**Access:**
- Full system access
- Employee management (add/edit/delete)
- Break list creation
- Break assignment
- All reports and analytics
- System settings
- Audit trail access

**Login Credentials (Demo):**
```
Username: admin
Password: admin123
```

#### Manager
**Access:**
- View all employees
- Create daily break lists
- Assign breaks to employees
- View compliance reports
- Submit schedules on behalf of employees

**Login Credentials (Demo):**
```
Employee ID: emp001
Password: manager123
```

#### HR Admin
**Access:**
- Employee management
- View compliance reports
- Export data
- View audit trail
- No break assignment capability

#### Director
**Access:**
- View-only access to all data
- Approve break waivers
- View compliance and reports
- No edit capabilities

### Employee Dashboard Access

#### Employee
**Access:**
- View if assigned to today's break list
- Submit work schedule (start/end times)
- View own break history
- Confirm breaks taken

**Login Credentials (Demo):**
```
Employee ID: emp002
Password: employee123
```

#### Manager (Employee Role)
**Access:**
- All employee capabilities
- Plus: Assign breaks to other employees
- View all employees on break list

---

## 6. Core Features

### 6.1 Employee Management

**Features:**
- Add new employees with details:
  - Full name
  - Employee ID (unique)
  - Hourly rate
  - Role (employee/manager)
  - Active/Inactive status
- Edit existing employee information
- Toggle active/inactive status
- View employee statistics
- Filter by status (all/active/inactive)
- Search employees by name

**Business Rules:**
- Employee IDs must be unique
- Hourly rate must be positive number
- Inactive employees:
  - Cannot log in
  - Hidden from daily break lists
  - Historical data retained

**Data Model:**
```typescript
interface Employee {
  id: string              // Unique identifier (emp001, emp002, etc.)
  name: string           // Full name
  hourlyRate: number     // Wage rate for revenue calculations
  role: 'employee' | 'manager'
  password: string       // Hashed password
  active: boolean        // Active/Inactive status
}
```

### 6.2 Daily Break List Management

**Purpose:**
Create a daily roster of employees who need break tracking.

**Workflow:**
1. Admin opens "Create Break List" dialog
2. Selects date (defaults to today)
3. Views all active employees with checkboxes
4. Selects employees working that day
5. Clicks "Create Break List"
6. System creates assignment record

**Features:**
- Date picker for future scheduling
- Select all/deselect all toggles
- Employee count display
- Visual confirmation of list creation
- View existing lists by date

**Business Rules:**
- Only active employees appear in selection
- Can create lists for future dates
- One list per date (overwrite if exists)
- Only admins and managers can create lists

**Data Model:**
```typescript
interface DailyBreakList {
  date: string           // YYYY-MM-DD format
  employeeIds: string[]  // Array of assigned employee IDs
  createdBy: string      // Admin username
  createdAt: string      // ISO timestamp
}
```

### 6.3 Employee Schedule Submission

**Purpose:**
Employees enter their actual work hours for break eligibility calculation.

**Workflow:**
1. Employee logs in
2. Views today's date
3. Sees if assigned to break list
4. Enters shift start time (e.g., "8:00 AM")
5. Enters shift end time (e.g., "5:00 PM")
6. System calculates total hours
7. System determines break eligibility:
   - 4+ hours: 1 break required
   - 6.5+ hours: 2 breaks required
8. Schedule saved and visible to managers

**Features:**
- Time picker with validation
- Real-time hours calculation
- Break eligibility display
- Edit submitted schedule (same day only)
- Visual confirmation

**Business Rules:**
- End time must be after start time
- Maximum 24-hour shift
- Can only submit for current date
- Overwrites previous submission

**Data Model:**
```typescript
interface EmployeeSchedule {
  employeeId: string
  date: string
  shiftStart: string     // Time format: "08:00"
  shiftEnd: string       // Time format: "17:00"
  totalHours: number     // Calculated
  breaksRequired: number // 1 or 2 based on hours
  submittedAt: string
}
```

### 6.4 Break Assignment

**Purpose:**
Managers assign and track actual breaks given to employees.

**Workflow:**
1. Manager views employees with submitted schedules
2. Selects employee needing break
3. Chooses break number (1st or 2nd)
4. Enters break start time
5. Enters break end time
6. System validates:
   - No duplicate break for same period
   - Employee eligible for break number
   - Times are logical
7. Break recorded
8. Compliance status updated

**Features:**
- Filter by schedule status
- Visual indicators (who has breaks)
- Break validation with error messages
- Audit trail automatic creation
- Real-time compliance updates

**Business Rules:**
- Cannot assign duplicate breaks (same employee, same number, same date)
- Cannot assign 2nd break if shift < 6.5 hours
- Break end must be after break start
- Must be assigned on same date as schedule

**Validation Messages:**
```
✓ "Break 1 assigned successfully"
✗ "This employee has already had their first break today"
✗ "Second break only available for shifts 6.5+ hours"
✗ "Break end time must be after start time"
```

**Data Model:**
```typescript
interface BreakEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  breakNumber: 1 | 2
  breakStart: string     // Time format
  breakEnd: string       // Time format
  duration: number       // Minutes
  assignedBy: string     // Manager ID
  timestamp: string      // ISO timestamp
}
```

### 6.5 Colorado Compliance Monitoring

**Legal Requirements:**
- Employees working 4+ hours: 1 paid 10-minute break
- Employees working 6.5+ hours: 2 paid 10-minute breaks
- Breaks should occur in middle of work period
- Violations subject to penalties

**Features:**
- Real-time compliance status
- Violation detection
- Risk profiling (high/medium/low risk employees)
- Compliance percentage by employee
- Historical violation trends

**Compliance Calculation:**
```typescript
function checkCompliance(employee, date, entries) {
  const schedule = getSchedule(employee.id, date)
  const breaks = getBreaks(employee.id, date)
  
  const required = schedule.hoursWorked >= 6.5 ? 2 : 
                   schedule.hoursWorked >= 4 ? 1 : 0
  const taken = breaks.length
  
  return {
    compliant: taken >= required,
    required,
    taken,
    missing: Math.max(0, required - taken)
  }
}
```

**Data Model:**
```typescript
interface ComplianceRecord {
  employeeId: string
  date: string
  hoursWorked: number
  breaksRequired: number
  breaksTaken: number
  compliant: boolean
  violationType?: 'missing_first' | 'missing_second' | 'no_breaks'
  calculatedAt: string
}
```

### 6.6 Reporting & Analytics

**Available Reports:**

1. **Daily Compliance Report**
   - All employees for selected date
   - Compliance status
   - Missing breaks
   - Export to CSV

2. **Employee Performance Report**
   - Individual employee history
   - Compliance percentage
   - Violation count
   - Date range filter

3. **Revenue Impact Analysis**
   - Lost productivity from violations
   - Cost per violation
   - Total liability exposure
   - Trend charts

4. **Risk Assessment Report**
   - High-risk employees (repeat violations)
   - Department-level compliance
   - Predictive insights

**Export Formats:**
- CSV (Excel compatible)
- PDF (formatted reports)
- JSON (raw data)

### 6.7 Email Notifications

**Notification Types:**

1. **Break Reminder** (12:45 PM)
   - Sent if first break not taken
   - Recipients: Manager, Admin

2. **Violation Alert** (1:00 PM)
   - Sent if first break deadline passed
   - Recipients: Manager, Admin, HR

3. **Second Break Reminder** (3:15 PM)
   - For employees working 6.5+ hours
   - Recipients: Manager

4. **End of Day Summary**
   - All violations for the day
   - Compliance statistics
   - Recipients: Admin, HR

**Email Template:**
```
Subject: Break Compliance Alert - [Employee Name]

Employee: John Smith
Date: 2025-01-15
Shift: 8:00 AM - 5:00 PM (9 hours)

Status: First break not taken
Time: 12:45 PM (15 minutes until violation)

Action Required: Assign break immediately to avoid violation.

[View Dashboard] button
```

### 6.8 Audit Trail

**Purpose:**
Immutable log of all system actions for legal defense.

**Logged Actions:**
- User logins/logouts
- Employee additions/edits/deletions
- Break list creations
- Schedule submissions
- Break assignments
- Compliance overrides
- Report generations
- Settings changes

**Audit Entry:**
```typescript
interface AuditEntry {
  id: string
  timestamp: string      // ISO 8601
  actor: string         // Who performed action
  actorRole: string     // Their role
  action: string        // What they did
  targetType: string    // What was affected
  targetId: string      // Specific record
  changes?: object      // Before/after values
  ipAddress?: string    // Network info
  userAgent?: string    // Browser info
}
```

**Features:**
- Cannot be edited or deleted
- Searchable by date, user, action
- Export for legal review
- Retention: 7 years minimum

---

## 7. Data Models

### Complete Database Schema

```typescript
// Core Entities

interface Employee {
  id: string                    // Primary key (emp001, emp002, etc.)
  name: string
  hourlyRate: number
  role: 'employee' | 'manager'
  password: string              // Hashed with bcrypt
  active: boolean               // Status flag
  createdAt: string
  updatedAt: string
}

interface DailyBreakList {
  id: string                    // Primary key
  date: string                  // YYYY-MM-DD (unique)
  employeeIds: string[]         // Foreign keys to Employee
  createdBy: string             // Admin username
  createdAt: string
}

interface EmployeeSchedule {
  id: string                    // Primary key
  employeeId: string            // Foreign key to Employee
  date: string                  // YYYY-MM-DD
  shiftStart: string            // HH:mm format
  shiftEnd: string              // HH:mm format
  totalHours: number            // Calculated
  breaksRequired: number        // 0, 1, or 2
  submittedAt: string
  // Unique constraint: (employeeId, date)
}

interface BreakEntry {
  id: string                    // Primary key
  employeeId: string            // Foreign key to Employee
  employeeName: string          // Denormalized for performance
  date: string                  // YYYY-MM-DD
  breakNumber: 1 | 2            // First or second break
  breakStart: string            // HH:mm format
  breakEnd: string              // HH:mm format
  duration: number              // Calculated minutes
  assignedBy: string            // Manager/Admin ID
  timestamp: string             // ISO 8601
  // Unique constraint: (employeeId, date, breakNumber)
}

interface ComplianceRecord {
  id: string                    // Primary key
  employeeId: string            // Foreign key
  date: string                  // YYYY-MM-DD
  hoursWorked: number
  breaksRequired: number
  breaksTaken: number
  compliant: boolean            // Derived field
  violationType: string | null  // If not compliant
  riskLevel: 'low' | 'medium' | 'high'
  calculatedAt: string
}

interface AuditEntry {
  id: string                    // Primary key
  timestamp: string             // ISO 8601 (indexed)
  actor: string                 // Username or employee ID
  actorRole: string             // Role at time of action
  action: string                // Action type (indexed)
  targetType: string            // Entity type affected
  targetId: string              // Specific record ID
  changes: object | null        // JSON of before/after
  ipAddress: string | null
  userAgent: string | null
}

interface AdminCredential {
  username: string              // Primary key
  passwordHash: string          // bcrypt hash
  role: 'admin' | 'manager' | 'hr_admin' | 'director'
  email: string | null
  createdAt: string
  lastLogin: string | null
  failedAttempts: number        // Security tracking
}

interface BreakWaiver {
  id: string                    // Primary key
  employeeId: string
  date: string
  reason: string                // Why waiving break
  requestedBy: string           // Manager
  approvedBy: string | null     // Director
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
  reviewedAt: string | null
}

interface Notification {
  id: string
  type: 'break_reminder' | 'violation_alert' | 'daily_summary'
  recipientEmail: string
  subject: string
  body: string
  sentAt: string
  status: 'sent' | 'failed'
  errorMessage: string | null
}

// Revenue Analytics (future enhancement)
interface RevenueImpact {
  date: string
  totalViolations: number
  estimatedLiability: number    // Violations * $1500
  lostProductivity: number      // Hours * hourly rate
  complianceRate: number        // Percentage
}
```

### Relationships

```
Employee (1) ──< (M) BreakEntry
Employee (1) ──< (M) EmployeeSchedule
Employee (1) ──< (M) ComplianceRecord
Employee (1) ──< (M) BreakWaivers
DailyBreakList (1) ──< (M) Employee (via employeeIds array)
```

### Indexes (for Performance - Phase 2)

```sql
-- Employee lookups
CREATE INDEX idx_employee_active ON employees(active);
CREATE INDEX idx_employee_role ON employees(role);

-- Break queries
CREATE INDEX idx_break_date ON break_entries(date);
CREATE INDEX idx_break_employee_date ON break_entries(employee_id, date);

-- Schedule queries
CREATE INDEX idx_schedule_date ON employee_schedules(date);
CREATE INDEX idx_schedule_employee_date ON employee_schedules(employee_id, date);

-- Compliance queries
CREATE INDEX idx_compliance_date ON compliance_records(date);
CREATE INDEX idx_compliance_employee ON compliance_records(employee_id);

-- Audit trail
CREATE INDEX idx_audit_timestamp ON audit_entries(timestamp DESC);
CREATE INDEX idx_audit_actor ON audit_entries(actor);
CREATE INDEX idx_audit_action ON audit_entries(action);
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (COMPLETED ✓)
**Duration:** Weeks 1-4
**Status:** Deployed to v0

**Deliverables:**
- ✓ Basic Next.js application setup
- ✓ UI component library (shadcn/ui)
- ✓ Employee management interface
- ✓ Break entry dashboard
- ✓ localStorage data persistence
- ✓ Colorado compliance rules engine
- ✓ Basic authentication (admin/employee)
- ✓ Audit trail logging
- ✓ CSV export functionality

**Limitations:**
- LocalStorage only (not production-ready)
- Simulated email notifications
- No real password security
- Client-side only validation

---

### Phase 2: Security & Production Readiness (RECOMMENDED NEXT)
**Duration:** Weeks 5-8
**Priority:** HIGH

#### Week 5: Database Migration
**Tasks:**
1. Set up Supabase project
2. Create PostgreSQL schema
3. Implement Row-Level Security (RLS) policies
4. Migrate data from localStorage to database
5. Update all data access functions
6. Test data persistence

**Supabase Schema:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('employee', 'manager')),
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Break entries table
CREATE TABLE break_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT REFERENCES employees(id),
  employee_name TEXT NOT NULL,
  date DATE NOT NULL,
  break_number INTEGER CHECK (break_number IN (1, 2)),
  break_start TIME NOT NULL,
  break_end TIME NOT NULL,
  duration INTEGER NOT NULL,
  assigned_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date, break_number)
);

-- RLS Policies
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_entries ENABLE ROW LEVEL SECURITY;

-- Admin can see all
CREATE POLICY "Admins can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'hr_admin'));

-- Employees can only see themselves
CREATE POLICY "Employees can view own record"
  ON employees FOR SELECT
  TO authenticated
  USING (id = auth.jwt() ->> 'employee_id');
```

#### Week 6: Authentication Upgrade
**Tasks:**
1. Implement Supabase Auth
2. Replace localStorage sessions with JWT
3. Add HTTP-only cookie support
4. Implement proper password hashing (bcrypt)
5. Add session timeout enforcement
6. Add failed login tracking
7. Test authentication flows

**Benefits:**
- Industry-standard security
- Automatic session management
- Protection against XSS attacks
- Multi-device support

#### Week 7: Email Integration
**Tasks:**
1. Set up Resend account
2. Create email templates
3. Implement notification scheduling
4. Add email queue system
5. Test email delivery
6. Add email logs/tracking

**Email Templates to Create:**
- Break reminder (12:45 PM)
- Violation alert (1:00 PM)
- Second break reminder (3:15 PM)
- Daily summary (5:00 PM)
- Waiver approval request

#### Week 8: Testing & Hardening
**Tasks:**
1. Add input validation with Zod
2. Implement rate limiting
3. Add CSRF protection
4. Security audit
5. Performance testing
6. User acceptance testing (UAT)
7. Documentation updates

---

### Phase 3: Advanced Features (FUTURE)
**Duration:** Weeks 9-12
**Priority:** MEDIUM

#### Week 9: Enhanced Reporting
- Advanced analytics dashboard
- Predictive compliance insights
- Department-level reporting
- Custom report builder
- Scheduled report delivery

#### Week 10: Mobile Optimization
- Progressive Web App (PWA)
- Mobile-first interface refinement
- Push notifications
- Offline mode support

#### Week 11: Integrations
- Calendar integration (Google/Outlook)
- Payroll system integration
- Time clock/POS integration
- Slack/Teams notifications

#### Week 12: Enterprise Features
- Multi-location support
- Custom break rules by jurisdiction
- Approval workflows
- Advanced role management
- API for third-party access

---

### Phase 4: Scale & Optimize (FUTURE)
**Duration:** Ongoing
**Priority:** LOW

- Performance optimization
- Caching layer (Redis)
- CDN integration
- Load testing
- Monitoring and alerts (Sentry)
- A/B testing framework

---

## 9. Deployment Strategy

### Current Deployment (Phase 1)

**Platform:** Vercel
**Branch:** `my-first-branch`
**URL:** TBD (Vercel assigns on deploy)

**Deployment Process:**
1. Push code to GitHub repository
2. Vercel automatically detects changes
3. Runs build process (`pnpm run build`)
4. Deploys to production
5. Generates preview URLs for PRs

**Environment Variables:**
```
NEXT_PUBLIC_APP_NAME=Employee Break Management
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### Production Deployment (Phase 2)

**Requirements:**
- Supabase project URL
- Supabase anon key
- Resend API key
- Custom domain (optional)

**Environment Variables:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (server-side only)

# Resend
RESEND_API_KEY=re_...

# App Config
NEXT_PUBLIC_APP_URL=https://yourapp.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com

# Security
JWT_SECRET=your-super-secret-key-here
SESSION_TIMEOUT_MINUTES=30
```

**Deployment Checklist:**
- [ ] All environment variables set in Vercel
- [ ] Supabase RLS policies enabled
- [ ] Database backups configured
- [ ] Email templates tested
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] User documentation complete
- [ ] Admin training completed

### Backup Strategy

**Database Backups (Supabase):**
- Automatic daily backups (retained 7 days)
- Weekly full backups (retained 4 weeks)
- Monthly archives (retained 12 months)

**Code Repository:**
- GitHub as source of truth
- Protected main branch
- Require PR reviews
- Automated CI/CD testing

### Rollback Plan

If deployment issues occur:
1. Revert to previous Vercel deployment (instant)
2. Check error logs in Vercel dashboard
3. Verify environment variables
4. Test in preview environment
5. Redeploy when issue resolved

---

## 10. Compliance & Legal Requirements

### Colorado Labor Law (C.R.S. § 8-4-101 et seq.)

**Rest Break Requirements:**
- **4+ hours worked:** 1 paid 10-minute rest break
- **6.5+ hours worked:** 2 paid 10-minute rest breaks
- Breaks should occur as near as possible to the middle of the work period
- Breaks are paid time
- Employer must make good faith effort to provide breaks

**Penalties for Non-Compliance:**
- Wage claim liability: Up to $1,500 per violation
- Administrative fines
- Legal fees if employee wins lawsuit
- Reputation damage

### Record Retention Requirements

**Minimum Retention Periods:**
- Break records: 3 years (Fair Labor Standards Act)
- Payroll records: 3 years (FLSA)
- Employee records: 7 years (IRS recommendation)
- Audit logs: 7 years (compliance best practice)

**What to Retain:**
- Employee work schedules
- Break times and durations
- Waiver requests and approvals
- Compliance violation records
- Manager acknowledgments
- Audit trail of all system actions

### Data Privacy Compliance

**Personal Information Collected:**
- Employee names
- Employee IDs
- Work hours
- Break times
- Login credentials
- IP addresses (audit logs)

**Privacy Requirements:**
- Informed consent for data collection
- Data access controls (RBAC)
- Right to access personal data
- Right to correction
- Right to deletion (after retention period)
- Data breach notification procedures

**GDPR Compliance (if applicable):**
- Data processing agreements
- Privacy policy
- Cookie consent
- Data portability
- Right to be forgotten

### Audit Trail Legal Standards

**Requirements:**
- Immutable (cannot be altered)
- Time-stamped (accurate clock)
- Complete (no gaps)
- Accessible (can be searched/exported)
- Retained (7+ years)

**What Courts Look For:**
- Who did what, when
- Evidence of good faith effort
- Documentation of policy enforcement
- Proof of manager training
- Response to violations

### Recommended Policies

1. **Break Policy Document**
   - Explains Colorado requirements
   - States company procedures
   - Describes consequences of violations
   - Updated annually

2. **Manager Training**
   - Break law requirements
   - How to use the system
   - When to assign breaks
   - Documentation importance
   - Quarterly refresher training

3. **Employee Handbook Entry**
   - Employee break rights
   - How to use the system
   - Who to contact with issues
   - Given to all new hires

4. **Incident Response Plan**
   - What to do if violation occurs
   - Who to notify
   - Documentation steps
   - Corrective actions

---

## Appendix A: Demo Credentials

### Admin Portal

```
URL: /login
Username: admin
Password: admin123
Role: Admin (full access)
```

### Employee Accounts

**Manager Account:**
```
URL: /login
Employee ID: emp001
Password: manager123
Role: Manager
Can: Assign breaks, create lists, view reports
```

**Regular Employee:**
```
URL: /login
Employee ID: emp002
Password: employee123
Role: Employee
Can: Submit schedule, view own breaks
```

**Additional Test Accounts:**
- emp003 / employee123
- emp004 / employee123
- emp005 / employee123

---

## Appendix B: API Reference (Phase 2)

### Authentication Endpoints

```typescript
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, user: UserSession }

POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }

GET /api/auth/session
Headers: { Authorization: Bearer <token> }
Response: { user: UserSession }
```

### Employee Endpoints

```typescript
GET /api/employees
Response: Employee[]

POST /api/employees
Body: Omit<Employee, 'id'>
Response: Employee

PUT /api/employees/:id
Body: Partial<Employee>
Response: Employee

DELETE /api/employees/:id
Response: { success: boolean }
```

### Break Management

```typescript
POST /api/breaks/assign
Body: {
  employeeId: string
  date: string
  breakNumber: 1 | 2
  startTime: string
  endTime: string
}
Response: BreakEntry

GET /api/breaks/list/:date
Response: BreakEntry[]

POST /api/breaks/validate
Body: { employeeId, date, breakNumber, ... }
Response: { valid: boolean, message?: string }
```

---

## Appendix C: Testing Scenarios

### Scenario 1: Daily Break List Creation
1. Login as admin
2. Click "Create Break List"
3. Select 5 employees
4. Click "Create"
5. Verify success message
6. Logout and login as employee
7. Verify employee sees assignment

### Scenario 2: Schedule Submission
1. Login as employee (emp002)
2. Enter shift: 8:00 AM - 5:00 PM
3. Submit schedule
4. Verify 9 hours = 2 breaks required shown
5. Logout

### Scenario 3: Break Assignment
1. Login as manager (emp001)
2. View employees with schedules
3. Select employee emp002
4. Assign break 1: 10:00 AM - 10:10 AM
5. Verify success
6. Try to assign duplicate break 1
7. Verify error message
8. Assign break 2: 2:30 PM - 2:40 PM
9. Verify compliance status updates

### Scenario 4: Compliance Violation
1. Setup: Employee worked 8 hours
2. Do NOT assign any breaks
3. Check compliance report
4. Verify shows as violation
5. Verify risk level increases

### Scenario 5: Inactive Employee
1. Login as admin
2. Edit employee, uncheck "Active"
3. Save
4. Verify employee doesn't appear in break list creator
5. Logout, try to login as that employee
6. Verify login denied

---

## Appendix D: Troubleshooting Guide

### Common Issues

**Issue:** Cannot login as admin
**Solution:** Username is "admin" (lowercase), password is "admin123"

**Issue:** Employee doesn't see break list
**Solution:** 
1. Check if employee is on today's break list
2. Verify employee is marked as "Active"
3. Check date selected matches list creation date

**Issue:** Cannot assign second break
**Solution:** Verify employee worked 6.5+ hours. Second breaks only for longer shifts.

**Issue:** Data disappeared
**Solution:** localStorage cleared. This is Phase 1 limitation. Backup data regularly or implement Phase 2 database.

**Issue:** Email notifications not sending
**Solution:** Phase 1 uses simulated emails. Implement Resend integration in Phase 2.

---

## Appendix E: Future Enhancements

### Requested Features

1. **Shift Templates**
   - Pre-defined shift patterns (8-5, 9-6, etc.)
   - One-click schedule entry

2. **Break Preferences**
   - Employees can request preferred break times
   - System suggests optimal break schedule

3. **Team View**
   - See who's on break in real-time
   - Coverage management

4. **Mobile App**
   - Native iOS/Android apps
   - Push notifications
   - Geofencing for clock-in

5. **Integration Hub**
   - Connect to Square, Toast, other POS systems
   - Automatic schedule import
   - Two-way sync

6. **Advanced Analytics**
   - Predictive models
   - Compliance trends
   - Cost savings calculations
   - Benchmark against industry

7. **Multi-Location**
   - Different rules per state/country
   - Roll-up reporting
   - Location-based permissions

8. **Approval Workflows**
   - Manager approves schedules
   - Director approves waivers
   - HR reviews violations

---

## Document Control

**Version:** 1.0
**Date:** 2025-01-15
**Author:** v0 AI Assistant
**Status:** DRAFT

**Change Log:**
- 2025-01-15: Initial comprehensive specification created

**Review Cycle:** Quarterly or upon major feature additions

**Distribution:**
- Development team
- Project stakeholders
- Implementation partners

---

**END OF SPECIFICATION**
