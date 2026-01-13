# Daily Break List System Blueprint

## Overview
This document provides a comprehensive blueprint for the daily break list feature, which enables administrators to create break schedules and employees to manage break assignments for their coworkers while maintaining strict privacy controls.

---

## 1. System Architecture

### 1.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Daily Break List Creator                              │  │
│  │  - Select employees with checkboxes                    │  │
│  │  - Choose date                                         │  │
│  │  - Create break list                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Break Assignment Storage                              │  │
│  │  - Store selected employees for date                   │  │
│  │  - Track assignment status                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  EMPLOYEE DASHBOARD                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Break List View (Assigned Employees Only)            │  │
│  │  - View: Am I on the list today?                      │  │
│  │  - Action: Submit my work schedule                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Break Assignment Interface                            │  │
│  │  - View: Who else is on today's list?                 │  │
│  │  - Action: Assign break times to coworkers            │  │
│  │  - Cannot see: Hours worked or break duration         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN ANALYTICS                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Full Visibility Dashboard                             │  │
│  │  - View: All break entries                            │  │
│  │  - View: Employee work hours                          │  │
│  │  - View: Break durations                              │  │
│  │  - View: Compliance violations                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Daily Break List Creation Workflow

### 2.1 Admin Creates Break List

**Step-by-Step Process:**

1. **Admin logs into admin dashboard**
   - Authentication required
   - Role must be: admin, hr_admin, or manager

2. **Admin navigates to "Create Daily Break List" section**
   - Located in "Employees" tab on admin dashboard
   - Button: "Create Daily Break List"

3. **Admin selects date**
   - Date picker defaults to today
   - Can create lists for future dates
   - Cannot modify past dates (read-only)

4. **Admin reviews employee roster**
   - All ACTIVE employees displayed
   - Inactive employees automatically filtered out
   - Employees shown with:
     - Name
     - Current status badge
     - Checkbox for selection

5. **Admin selects employees for the day**
   - Click checkboxes next to employee names
   - "Select All" option available
   - "Clear All" option available
   - Visual feedback: checked boxes highlight row

6. **Admin creates the list**
   - Button: "Create Break List"
   - Validation checks:
     - At least 1 employee selected
     - Date is valid
   - Confirmation message: "Break list created for [date] with [X] employees"

7. **System stores break assignment**
   ```typescript
   {
     date: "2026-01-15",
     employeeIds: ["emp-001", "emp-002", "emp-003"],
     createdAt: "2026-01-15T08:00:00Z",
     createdBy: "admin-user-id",
     status: "active"
   }
   ```

### 2.2 Data Storage Structure

**Break Assignment Record:**
```typescript
interface DailyBreakAssignment {
  date: string                    // YYYY-MM-DD format
  employeeIds: string[]           // Array of employee IDs assigned
  createdAt: string              // ISO timestamp
  createdBy: string              // Admin user ID
  status: "active" | "completed" // List status
}
```

**Storage Location:**
- LocalStorage key: `break_assignments`
- Structure: Array of DailyBreakAssignment objects
- Indexed by date for quick lookup

---

## 3. Employee Break Assignment Workflow

### 3.1 Employee Views Their Assignment Status

**When employee logs in:**

1. **Check if on today's break list**
   ```typescript
   const todaysList = getBreakAssignmentForDate(today)
   const isAssigned = todaysList.employeeIds.includes(currentEmployee.id)
   ```

2. **Display status message**
   - **If assigned:** "✓ You are on today's break list"
   - **If not assigned:** "You are not scheduled to manage breaks today"

3. **Show action required**
   - **If assigned and no schedule submitted:**
     - Prompt: "Please submit your work schedule for today"
     - Form appears with shift start/end time inputs

   - **If assigned and schedule submitted:**
     - Show: "Schedule submitted ✓"
     - Display: Break assignment interface

### 3.2 Employee Submits Work Schedule

**Purpose:** Employee enters their own shift times to determine break eligibility

**Form Fields:**
```
Shift Start Time: [__:__ AM/PM]
Shift End Time:   [__:__ AM/PM]
```

**Validation Rules:**
1. Start time must be before end time
2. Minimum shift: 2 hours
3. Maximum shift: 14 hours
4. Times must be in 15-minute increments

**Submission Process:**
1. Employee fills out times
2. Clicks "Submit Schedule"
3. System calculates total hours worked
4. System determines break eligibility:
   - 4.0+ hours = 1st break required
   - 6.5+ hours = 2nd break required
5. Status updated: Employee can now assign breaks to others

**Data Stored:**
```typescript
{
  employeeId: "emp-001",
  date: "2026-01-15",
  shiftStart: "09:00",
  shiftEnd: "17:00",
  totalHours: 8.0,
  breaksRequired: 2,
  scheduleSubmittedAt: "2026-01-15T09:05:00Z"
}
```

### 3.3 Employee Assigns Breaks to Coworkers

**Interface Display:**

Once schedule is submitted, employee sees:

```
┌─────────────────────────────────────────────────────────┐
│  Assign Breaks to Coworkers                              │
│                                                           │
│  Today's Break List (5 employees)                        │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Employee Name    │ Status      │ Actions        │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ John Smith       │ ⏱ Needs Break │ [Assign]    │    │
│  │ Sarah Johnson    │ ✓ Break Given │ [View]      │    │
│  │ Mike Davis       │ ⏱ Needs Break │ [Assign]    │    │
│  │ Emily Chen       │ ⏱ Needs Break │ [Assign]    │    │
│  │ You (Sam Wilson) │ ⏱ Needs Break │ -           │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**What Employee Can See:**
- ✅ Names of coworkers on today's list
- ✅ Whether coworker has received a break yet
- ✅ Option to assign break times
- ❌ **CANNOT see:** Coworker's shift hours
- ❌ **CANNOT see:** How long coworker's break was
- ❌ **CANNOT see:** When coworker started/ended work

**Assigning a Break:**

1. **Employee clicks "Assign" next to coworker's name**
2. **Break assignment dialog opens:**
   ```
   Assign Break to: Sarah Johnson
   
   Break Start Time: [__:__ AM/PM]
   Break End Time:   [__:__ AM/PM]
   
   Break Type: ● First Break  ○ Second Break
   
   [Cancel]  [Assign Break]
   ```

3. **Validation (behind the scenes):**
   - Check if coworker already received this break type today
   - Ensure break times are logical (end after start)
   - Verify minimum break duration (10 minutes)
   - Check Colorado compliance (before 1:00 PM for first, before 3:30 PM for second)

4. **Submit break assignment**
   - Employee clicks "Assign Break"
   - System records break entry
   - Coworker's status updates to "✓ Break Given"
   - Audit trail created

**Data Stored:**
```typescript
{
  id: "break-entry-12345",
  employeeId: "emp-002",           // Sarah (receiving break)
  date: "2026-01-15",
  breakType: "first",
  breakStartTime: "10:30",
  breakEndTime: "10:40",
  assignedBy: "emp-001",           // John (assigning break)
  assignedAt: "2026-01-15T10:30:00Z",
  
  // PRIVATE DATA - Not visible to assigning employee
  shiftStart: "09:00",            // Sarah's shift start
  shiftEnd: "17:00",              // Sarah's shift end
  breakDurationMinutes: 10        // Calculated duration
}
```

---

## 4. Privacy & Permission Controls

### 4.1 Employee View Restrictions

**What Employees CAN Access:**
```typescript
// Visible to employee assigning breaks
{
  coworkerName: "Sarah Johnson",
  hasReceivedBreak: true,
  breakType: "first",
  // That's it!
}
```

**What Employees CANNOT Access:**
```typescript
// Hidden from employee view
{
  shiftStart: "HIDDEN",           // ❌ Private
  shiftEnd: "HIDDEN",             // ❌ Private
  totalHoursWorked: "HIDDEN",     // ❌ Private
  breakDurationMinutes: "HIDDEN", // ❌ Private
  breakStartTime: "HIDDEN",       // ❌ Private (after assignment)
  breakEndTime: "HIDDEN"          // ❌ Private (after assignment)
}
```

### 4.2 Admin Full Visibility

**What Admins CAN Access:**
```typescript
// Admin has complete visibility
{
  employeeName: "Sarah Johnson",
  date: "2026-01-15",
  
  // Shift Information
  shiftStart: "09:00 AM",
  shiftEnd: "5:00 PM",
  totalHours: 8.0,
  
  // Break Information
  firstBreak: {
    startTime: "10:30 AM",
    endTime: "10:40 AM",
    duration: "10 minutes",
    assignedBy: "John Smith",
    complianceStatus: "✓ On Time"
  },
  
  secondBreak: {
    startTime: "2:15 PM",
    endTime: "2:25 PM",
    duration: "10 minutes",
    assignedBy: "Mike Davis",
    complianceStatus: "✓ On Time"
  },
  
  // Analytics
  breaksRequired: 2,
  breaksReceived: 2,
  complianceRate: "100%",
  
  // Revenue Calculation
  hourlyRate: 25.00,
  hoursWorked: 8.0,
  breakTime: 0.33,    // 20 minutes total
  paidHours: 8.33,    // Includes break time
  totalWages: 208.25
}
```

### 4.3 Permission Implementation

**Code Example - Data Access Control:**

```typescript
// In employee dashboard - RESTRICTED VIEW
export function getBreakListForEmployee(employeeId: string, date: string) {
  const assignment = getBreakAssignmentForDate(date)
  
  if (!assignment.employeeIds.includes(employeeId)) {
    return null  // Employee not on list
  }
  
  // Return only names and break status
  return assignment.employeeIds.map(id => {
    const employee = getEmployeeById(id)
    const hasBreak = checkIfEmployeeHasBreak(id, date)
    
    return {
      id: employee.id,
      name: employee.name,
      hasReceivedBreak: hasBreak,
      // NO shift times, NO break durations
    }
  })
}

// In admin dashboard - FULL ACCESS
export function getBreakListForAdmin(date: string) {
  const assignment = getBreakAssignmentForDate(date)
  const breakEntries = getBreakEntriesForDate(date)
  
  return assignment.employeeIds.map(id => {
    const employee = getEmployeeById(id)
    const breaks = breakEntries.filter(b => b.employeeId === id)
    const schedule = getEmployeeSchedule(id, date)
    
    return {
      id: employee.id,
      name: employee.name,
      hourlyRate: employee.hourlyRate,
      
      // Full shift details
      shiftStart: schedule.shiftStart,
      shiftEnd: schedule.shiftEnd,
      totalHours: schedule.totalHours,
      
      // Full break details
      breaks: breaks.map(b => ({
        type: b.breakType,
        startTime: b.breakStartTime,
        endTime: b.breakEndTime,
        duration: calculateDuration(b.breakStartTime, b.breakEndTime),
        assignedBy: getEmployeeName(b.assignedBy),
        complianceStatus: checkCompliance(b, schedule)
      })),
      
      // Revenue calculation
      totalWages: calculateWages(employee.hourlyRate, schedule.totalHours, breaks)
    }
  })
}
```

---

## 5. Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Admin Creates Daily Break List                      │
│                                                               │
│ Admin Action:                                                 │
│   - Selects date: 2026-01-15                                 │
│   - Selects employees: [John, Sarah, Mike, Emily, Sam]      │
│   - Clicks "Create Break List"                               │
│                                                               │
│ Data Stored:                                                  │
│   break_assignments = [                                       │
│     {                                                         │
│       date: "2026-01-15",                                    │
│       employeeIds: ["emp-001", "emp-002", ...]              │
│     }                                                         │
│   ]                                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Employees Log In and Check Status                   │
│                                                               │
│ John Logs In:                                                 │
│   System checks: Is John in today's list?                    │
│   Result: YES → Show "You're on today's list"               │
│   Action Required: Submit work schedule                      │
│                                                               │
│ Bob Logs In:                                                  │
│   System checks: Is Bob in today's list?                     │
│   Result: NO → Show "Not scheduled today"                    │
│   Available Actions: None (view only mode)                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: John Submits His Work Schedule                      │
│                                                               │
│ John's Input:                                                 │
│   - Shift Start: 9:00 AM                                     │
│   - Shift End: 5:00 PM                                       │
│                                                               │
│ System Calculates:                                            │
│   - Total Hours: 8.0                                         │
│   - Breaks Required: 2 (first + second)                     │
│                                                               │
│ Data Stored:                                                  │
│   employee_schedules = [                                      │
│     {                                                         │
│       employeeId: "emp-001",                                 │
│       date: "2026-01-15",                                    │
│       shiftStart: "09:00",                                   │
│       shiftEnd: "17:00",                                     │
│       totalHours: 8.0,                                       │
│       breaksRequired: 2                                      │
│     }                                                         │
│   ]                                                           │
│                                                               │
│ John's View Updates:                                          │
│   ✓ Schedule submitted                                       │
│   → Break assignment interface now available                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: John Views Coworkers on Break List                  │
│                                                               │
│ John Sees (LIMITED VIEW):                                     │
│   ┌───────────────────────────────────────┐                 │
│   │ Sarah Johnson  │ Needs Break │ Assign │                 │
│   │ Mike Davis     │ Break Given │ View   │                 │
│   │ Emily Chen     │ Needs Break │ Assign │                 │
│   │ Sam Wilson     │ Needs Break │ Assign │                 │
│   └───────────────────────────────────────┘                 │
│                                                               │
│ John CANNOT See:                                              │
│   ❌ What time Sarah started work                            │
│   ❌ What time Sarah will end work                           │
│   ❌ How many hours Sarah is working                         │
│   ❌ How long Mike's break lasted                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: John Assigns Break to Sarah                         │
│                                                               │
│ John's Action:                                                │
│   - Clicks "Assign" next to Sarah                            │
│   - Enters break times:                                      │
│     • Start: 10:30 AM                                        │
│     • End: 10:40 AM                                          │
│   - Selects: First Break                                     │
│   - Clicks "Assign Break"                                    │
│                                                               │
│ System Validation (Behind the Scenes):                       │
│   ✓ Sarah hasn't had first break yet                        │
│   ✓ Break time is before 1:00 PM (Colorado law)            │
│   ✓ Break duration is at least 10 minutes                   │
│   ✓ Break times are logical                                  │
│                                                               │
│ Data Stored:                                                  │
│   break_entries = [                                           │
│     {                                                         │
│       id: "break-12345",                                     │
│       employeeId: "emp-002",        // Sarah                 │
│       date: "2026-01-15",                                    │
│       breakType: "first",                                    │
│       breakStartTime: "10:30",                               │
│       breakEndTime: "10:40",                                 │
│       assignedBy: "emp-001",        // John                  │
│       assignedAt: "2026-01-15T10:30:00Z"                    │
│     }                                                         │
│   ]                                                           │
│                                                               │
│ John's View Updates:                                          │
│   Sarah's status: "Needs Break" → "Break Given" ✓           │
│                                                               │
│ Audit Trail Created:                                          │
│   "John Smith assigned first break to Sarah Johnson          │
│    at 10:30 AM on 2026-01-15"                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Admin Views Complete Break Activity                 │
│                                                               │
│ Admin Dashboard Display (FULL VISIBILITY):                   │
│                                                               │
│ Sarah Johnson - January 15, 2026                             │
│ ─────────────────────────────────────────────────────────   │
│                                                               │
│ Work Schedule:                                                │
│   Shift Start:    9:00 AM                                    │
│   Shift End:      5:00 PM                                    │
│   Total Hours:    8.0 hours                                  │
│   Hourly Rate:    $25.00                                     │
│                                                               │
│ Breaks Taken:                                                 │
│   First Break:                                                │
│     Start:        10:30 AM                                   │
│     End:          10:40 AM                                   │
│     Duration:     10 minutes                                 │
│     Assigned By:  John Smith                                 │
│     Compliance:   ✓ On Time (before 1:00 PM)               │
│                                                               │
│   Second Break:                                               │
│     Start:        2:15 PM                                    │
│     End:          2:25 PM                                    │
│     Duration:     10 minutes                                 │
│     Assigned By:  Mike Davis                                 │
│     Compliance:   ✓ On Time (before 3:30 PM)               │
│                                                               │
│ Revenue Analytics:                                            │
│   Hours Worked:   8.0 hours                                  │
│   Break Time:     20 minutes (0.33 hours)                   │
│   Paid Hours:     8.33 hours                                 │
│   Total Wages:    $208.25                                    │
│                                                               │
│ Compliance Status: ✓ COMPLIANT                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Security & Privacy Implementation

### 6.1 Frontend Data Filtering

**Employee Dashboard Component:**
```typescript
// components/employee-break-list-view.tsx

export function EmployeeBreakListView({ currentEmployeeId }: Props) {
  const [breakList, setBreakList] = useState<BreakListItem[]>([])
  
  useEffect(() => {
    // Fetch break list with employee-restricted data
    const list = getBreakListForEmployee(currentEmployeeId, today)
    
    // Data received ONLY includes:
    // - Coworker names
    // - Break assignment status (yes/no)
    // NO shift times, NO durations
    
    setBreakList(list)
  }, [currentEmployeeId])
  
  return (
    <div>
      <h3>Today's Break List</h3>
      {breakList.map(employee => (
        <div key={employee.id}>
          <span>{employee.name}</span>
          <span>{employee.hasReceivedBreak ? '✓ Break Given' : '⏱ Needs Break'}</span>
          {!employee.hasReceivedBreak && (
            <Button onClick={() => assignBreak(employee.id)}>
              Assign Break
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
```

**Admin Dashboard Component:**
```typescript
// components/admin-break-analytics.tsx

export function AdminBreakAnalytics() {
  const [detailedData, setDetailedData] = useState<DetailedBreakData[]>([])
  
  useEffect(() => {
    // Admin gets FULL DATA ACCESS
    const data = getBreakListForAdmin(today)
    
    // Data includes:
    // - All employee information
    // - Shift start/end times
    // - Break start/end times
    // - Break durations
    // - Hourly rates
    // - Wage calculations
    
    setDetailedData(data)
  }, [])
  
  return (
    <div>
      <h3>Break Activity - Full Details</h3>
      {detailedData.map(employee => (
        <div key={employee.id}>
          <h4>{employee.name}</h4>
          
          {/* Shift Details - ADMIN ONLY */}
          <div>
            <p>Shift: {employee.shiftStart} - {employee.shiftEnd}</p>
            <p>Total Hours: {employee.totalHours}</p>
            <p>Hourly Rate: ${employee.hourlyRate}</p>
          </div>
          
          {/* Break Details - ADMIN ONLY */}
          {employee.breaks.map(breakItem => (
            <div key={breakItem.type}>
              <p>{breakItem.type} Break</p>
              <p>Time: {breakItem.startTime} - {breakItem.endTime}</p>
              <p>Duration: {breakItem.duration} minutes</p>
              <p>Assigned by: {breakItem.assignedBy}</p>
            </div>
          ))}
          
          {/* Revenue Calculation - ADMIN ONLY */}
          <div>
            <p>Total Wages: ${employee.totalWages}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 6.2 Data Storage Separation

**Employee Schedule Data (PRIVATE):**
```typescript
// Only accessible to admin
localStorage.setItem('employee_schedules', JSON.stringify([
  {
    employeeId: "emp-002",
    date: "2026-01-15",
    shiftStart: "09:00",      // PRIVATE
    shiftEnd: "17:00",        // PRIVATE
    totalHours: 8.0,          // PRIVATE
    breaksRequired: 2
  }
]))
```

**Break Entry Data (PRIVATE DETAILS):**
```typescript
// Only accessible to admin
localStorage.setItem('break_entries', JSON.stringify([
  {
    id: "break-12345",
    employeeId: "emp-002",
    date: "2026-01-15",
    breakType: "first",
    breakStartTime: "10:30",    // PRIVATE after assignment
    breakEndTime: "10:40",      // PRIVATE after assignment
    assignedBy: "emp-001",
    assignedAt: "2026-01-15T10:30:00Z"
  }
]))
```

**Break List Assignment (SEMI-PUBLIC):**
```typescript
// Accessible to assigned employees (limited view)
localStorage.setItem('break_assignments', JSON.stringify([
  {
    date: "2026-01-15",
    employeeIds: ["emp-001", "emp-002", "emp-003"], // PUBLIC to assigned employees
    createdAt: "2026-01-15T08:00:00Z",
    createdBy: "admin-001"
  }
]))
```

### 6.3 Access Control Functions

```typescript
// lib/break-list-permissions.ts

export function canViewBreakList(userId: string, date: string): boolean {
  const session = getSession()
  
  // Admin can view any break list
  if (session?.role === 'admin' || session?.role === 'hr_admin') {
    return true
  }
  
  // Employee can only view if they're assigned to that day's list
  const assignment = getBreakAssignmentForDate(date)
  return assignment?.employeeIds.includes(userId) || false
}

export function canAssignBreak(assignerId: string, targetEmployeeId: string, date: string): boolean {
  // Check if assigner is on today's break list
  const assignment = getBreakAssignmentForDate(date)
  if (!assignment?.employeeIds.includes(assignerId)) {
    return false
  }
  
  // Check if target employee is also on the list
  if (!assignment?.employeeIds.includes(targetEmployeeId)) {
    return false
  }
  
  // Cannot assign break to yourself
  if (assignerId === targetEmployeeId) {
    return false
  }
  
  return true
}

export function canViewScheduleDetails(viewerId: string, targetEmployeeId: string): boolean {
  const session = getSession()
  
  // Only admin can view schedule details
  if (session?.role === 'admin' || session?.role === 'hr_admin') {
    return true
  }
  
  // Employees can only view their own schedule
  return viewerId === targetEmployeeId
}

export function canViewBreakDuration(viewerId: string, targetEmployeeId: string): boolean {
  const session = getSession()
  
  // Only admin can view break durations
  return session?.role === 'admin' || session?.role === 'hr_admin'
}
```

---

## 7. User Interface Mockups

### 7.1 Admin: Create Daily Break List

```
╔═══════════════════════════════════════════════════════════╗
║ Admin Dashboard > Employees > Create Daily Break List     ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║ Select Date: [January 15, 2026 ▼]                        ║
║                                                            ║
║ Select Employees for Break List:                          ║
║                                                            ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ [✓] Select All    [ ] Deselect All                 │   ║
║ ├────────────────────────────────────────────────────┤   ║
║ │ [✓] John Smith         Active   Manager            │   ║
║ │ [✓] Sarah Johnson      Active   Employee           │   ║
║ │ [✓] Mike Davis         Active   Employee           │   ║
║ │ [✓] Emily Chen         Active   Employee           │   ║
║ │ [✓] Sam Wilson         Active   Manager            │   ║
║ │ [ ] Robert Taylor      Inactive Employee           │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                            ║
║ 5 employees selected                                       ║
║                                                            ║
║ [Cancel]  [Create Break List]                             ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### 7.2 Employee: View Break List Assignment

```
╔═══════════════════════════════════════════════════════════╗
║ Employee Dashboard > Today's Break List                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║ Status: ✓ You are on today's break list                  ║
║ Date: January 15, 2026                                     ║
║                                                            ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ Step 1: Submit Your Work Schedule                   │   ║
║ │                                                      │   ║
║ │ Shift Start Time: [09:00 ▼] [AM ▼]                 │   ║
║ │ Shift End Time:   [05:00 ▼] [PM ▼]                 │   ║
║ │                                                      │   ║
║ │ [Submit Schedule]                                    │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### 7.3 Employee: Assign Breaks to Coworkers

```
╔═══════════════════════════════════════════════════════════╗
║ Employee Dashboard > Assign Breaks                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║ ✓ Your schedule submitted: 9:00 AM - 5:00 PM             ║
║                                                            ║
║ Today's Break List (5 employees)                           ║
║                                                            ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ Employee         │ Status          │ Action        │   ║
║ ├────────────────────────────────────────────────────┤   ║
║ │ John Smith       │ ⏱ Needs Break   │ [Assign]     │   ║
║ │ Sarah Johnson    │ ✓ Break Given   │ [View]       │   ║
║ │ Mike Davis       │ ⏱ Needs Break   │ [Assign]     │   ║
║ │ Emily Chen       │ ⏱ Needs Break   │ [Assign]     │   ║
║ │ You (Sam Wilson) │ ⏱ Needs Break   │ -            │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                            ║
║ Note: You cannot see coworkers' shift times or break       ║
║ durations. This information is private to admin.           ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### 7.4 Employee: Assign Break Dialog

```
╔═══════════════════════════════════════════════════════════╗
║ Assign Break to: John Smith                               ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║ Break Type:                                                ║
║   ● First Break (required by 1:00 PM)                     ║
║   ○ Second Break (required by 3:30 PM)                    ║
║                                                            ║
║ Break Start Time: [10:30 ▼] [AM ▼]                       ║
║ Break End Time:   [10:40 ▼] [AM ▼]                       ║
║                                                            ║
║ Duration: 10 minutes                                       ║
║                                                            ║
║ [Cancel]  [Assign Break]                                  ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### 7.5 Admin: View Full Break Details

```
╔═══════════════════════════════════════════════════════════╗
║ Admin Dashboard > Break Activity > January 15, 2026       ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║ Sarah Johnson                                              ║
║ ┌────────────────────────────────────────────────────┐   ║
║ │ Work Schedule (ADMIN VIEW)                          │   ║
║ │   Shift Start:    9:00 AM                           │   ║
║ │   Shift End:      5:00 PM                           │   ║
║ │   Total Hours:    8.0 hours                         │   ║
║ │   Hourly Rate:    $25.00/hour                       │   ║
║ │                                                      │   ║
║ │ Breaks Taken (ADMIN VIEW)                           │   ║
║ │   First Break:                                       │   ║
║ │     Time:         10:30 AM - 10:40 AM              │   ║
║ │     Duration:     10 minutes                        │   ║
║ │     Assigned By:  John Smith                        │   ║
║ │     Status:       ✓ Compliant (before 1:00 PM)     │   ║
║ │                                                      │   ║
║ │   Second Break:                                      │   ║
║ │     Time:         2:15 PM - 2:25 PM                │   ║
║ │     Duration:     10 minutes                        │   ║
║ │     Assigned By:  Mike Davis                        │   ║
║ │     Status:       ✓ Compliant (before 3:30 PM)     │   ║
║ │                                                      │   ║
║ │ Revenue Calculation (ADMIN VIEW)                    │   ║
║ │   Hours Worked:   8.0 hours                         │   ║
║ │   Break Time:     0.33 hours (20 min)              │   ║
║ │   Paid Hours:     8.33 hours                        │   ║
║ │   Total Wages:    $208.25                           │   ║
║ │                                                      │   ║
║ │ Compliance: ✓ COMPLIANT                             │   ║
║ └────────────────────────────────────────────────────┘   ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 8. Implementation Checklist

### Phase 1: Admin Break List Creation
- [ ] Create daily break list modal component
- [ ] Add employee selection checkboxes
- [ ] Implement date picker for list date
- [ ] Add "Select All" / "Deselect All" functionality
- [ ] Filter out inactive employees
- [ ] Store break assignment in localStorage
- [ ] Add confirmation message on creation
- [ ] Create audit trail entry

### Phase 2: Employee Break List View
- [ ] Check if employee is on today's list
- [ ] Display assignment status message
- [ ] Show work schedule submission form
- [ ] Validate shift times (start before end, reasonable duration)
- [ ] Calculate break eligibility based on hours
- [ ] Store employee schedule data
- [ ] Update UI to show schedule submitted status

### Phase 3: Employee Break Assignment Interface
- [ ] Display list of coworkers on today's list
- [ ] Show break status for each coworker
- [ ] Hide shift time details from employee view
- [ ] Create break assignment dialog
- [ ] Add break type selection (first/second)
- [ ] Implement break time inputs
- [ ] Validate break assignment rules
- [ ] Store break entry
- [ ] Update coworker status in real-time
- [ ] Prevent assigning break to self

### Phase 4: Admin Full Visibility Dashboard
- [ ] Create detailed break activity view
- [ ] Display all employee schedules
- [ ] Show all break entries with full details
- [ ] Calculate break durations
- [ ] Display hourly rates
- [ ] Calculate total wages
- [ ] Show compliance status
- [ ] Add export functionality

### Phase 5: Privacy & Security
- [ ] Implement data filtering for employee view
- [ ] Add permission checks on all data access
- [ ] Separate public and private data storage
- [ ] Add role-based access control functions
- [ ] Test employee cannot access private data
- [ ] Audit all data access points

### Phase 6: Testing & Validation
- [ ] Test admin creates break list
- [ ] Test employee sees assignment status
- [ ] Test employee submits schedule
- [ ] Test employee assigns break to coworker
- [ ] Test employee cannot see private data
- [ ] Test admin sees all details
- [ ] Test break validation rules
- [ ] Test compliance checking

---

## 9. Key Takeaways

### Core Principles
1. **Separation of Concerns**: Employees manage break assignments, admins manage analytics
2. **Privacy by Design**: Sensitive data (hours, durations) hidden from peer employees
3. **Role-Based Access**: Clear boundaries between employee and admin capabilities
4. **Audit Trail**: Every action logged for compliance and accountability
5. **Colorado Compliance**: Break timing rules enforced automatically

### Data Privacy Rules
- ✅ Employees can see: Names, break assignment status
- ❌ Employees cannot see: Shift times, break durations, wages
- ✅ Admins can see: Everything - full transparency for management

### Workflow Summary
1. Admin creates daily break list with selected employees
2. Assigned employees submit their work schedules
3. Employees assign breaks to each other during the day
4. Admin reviews complete activity with full details
5. System tracks compliance and generates reports

This blueprint ensures legal compliance, protects employee privacy, and provides management with complete visibility for decision-making and wage calculations.
