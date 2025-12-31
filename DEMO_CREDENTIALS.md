# Demo Login Credentials

This document contains all demo login credentials for testing the Employee Break Management System.

## Quick Access

### Employee Accounts
- **Username**: `sarah.johnson` | **Password**: `employee123` | **Role**: Employee
- **Username**: `michael.chen` | **Password**: `employee123` | **Role**: Manager

### Admin Account
- **Username**: `admin` | **Password**: `admin123` | **Role**: Administrator

---

## Detailed Account Information

### Employee Login (`/login` - Employee Tab)

#### 1. Sarah Johnson (Regular Employee)
```
Username: sarah.johnson
Password: employee123
Role: Employee
Employee ID: 1
```
**What you can do:**
- View personal work schedule
- Add daily work hours
- View break assignments
- View personal break history

#### 2. Michael Chen (Manager)
```
Username: michael.chen
Password: employee123
Role: Manager
Employee ID: 2
```
**What you can do:**
- Add daily work hours for self
- Assign breaks to employees
- View all employee schedules
- Submit break entries for team
- View compliance alerts
- All employee-level permissions

---

### Admin Login (`/login` - Admin Tab)

#### Administrator Account
```
Username: admin
Password: admin123
Role: Administrator
```
**What you can do:**
- Add/edit/remove employees
- View compliance monitoring dashboard
- Access revenue analytics
- Generate compliance reports
- View audit trail history
- Configure email notifications
- Full system access

---

## Pre-loaded Employee Data

The system comes with 5 demo employees:

1. **Sarah Johnson** - Customer Service (Morning Shift)
   - Employee ID: 1
   - Has login access

2. **Michael Chen** - Sales (Afternoon Shift)
   - Employee ID: 2
   - Has login access (Manager role)

3. **Emily Rodriguez** - Customer Service (Evening Shift)
   - Employee ID: 3
   - No login access (regular employee in system)

4. **David Kim** - Tech Support (Morning Shift)
   - Employee ID: 4
   - No login access (regular employee in system)

5. **Jessica Taylor** - Sales (Afternoon Shift)
   - Employee ID: 5
   - No login access (regular employee in system)

---

## Testing Scenarios

### Scenario 1: Employee Adding Work Hours
1. Login as `sarah.johnson` / `employee123`
2. Navigate to employee dashboard
3. Add work hours (e.g., 8:00 AM - 4:00 PM)
4. System automatically calculates break requirements

### Scenario 2: Manager Assigning Breaks
1. Login as `michael.chen` / `employee123`
2. Navigate to employee dashboard
3. View working employees list
4. Assign first break to an employee before 1:00 PM
5. Assign second break (if eligible) before 3:30 PM

### Scenario 3: Admin Managing System
1. Login as `admin` / `admin123`
2. Navigate to Employees tab
3. Click "Manage Employees" to add/edit employees
4. View Compliance tab for violation monitoring
5. Check Reports tab for daily summaries
6. View Notifications tab for email alert settings

### Scenario 4: Testing Break Compliance
1. Login as manager
2. Add work hours for an employee (8+ hours)
3. Wait past 1:00 PM without assigning first break
4. Check compliance monitor for violations
5. Assign break and verify violation cleared

### Scenario 5: Testing Duplicate Prevention
1. Login as manager
2. Assign first break to Sarah Johnson
3. Try to assign first break again to same employee
4. System should prevent duplicate and show message:
   - "This employee has already had the first break today. Please give another employee a break."

---

## Role Permissions Matrix

| Feature | Employee | Manager | Admin |
|---------|----------|---------|-------|
| Add own work hours | ✓ | ✓ | ✓ |
| Assign breaks to others | ✗ | ✓ | ✓ |
| View all employees | ✗ | ✓ | ✓ |
| Add/remove employees | ✗ | ✗ | ✓ |
| View compliance reports | ✗ | Limited | ✓ |
| Access revenue analytics | ✗ | ✗ | ✓ |
| Configure notifications | ✗ | ✗ | ✓ |
| View audit trail | ✗ | ✗ | ✓ |

---

## Password Requirements

**Current Demo Setup:**
- Simple passwords for testing only
- Passwords stored with basic hashing
- **NOT PRODUCTION READY**

**For Production:**
- Minimum 12 characters
- Require uppercase, lowercase, number, symbol
- Use bcrypt or argon2 for hashing
- Implement password reset functionality
- Add multi-factor authentication (MFA)

---

## Session Management

- **Session Timeout**: 30 minutes of inactivity
- **Storage**: localStorage (browser-based)
- **Auto-logout**: Yes, on session expiration

---

## Troubleshooting

### "Invalid username or password"
- Check capitalization (usernames are case-sensitive)
- Verify you're using correct tab (Employee vs Admin)
- Clear browser cache and try again

### "Session expired"
- Login again (sessions expire after 30 minutes)
- Data is preserved in localStorage

### Can't see certain features
- Verify you're logged in with correct role
- Regular employees can't access admin features
- Check role permissions matrix above

---

## Creating Additional Test Accounts

### As Admin:
1. Login as admin
2. Navigate to Employees tab
3. Click "Manage Employees"
4. Add new employee with all details
5. Employee will need login credentials created separately
   (Future feature: automatic credential generation)

### Programmatically:
Open browser console and run:
```javascript
// Add new employee login
const { createEmployeeAccount } = await import('./lib/employee-auth')
createEmployeeAccount('6', 'new.employee', 'password123', 'employee')
```

---

## Security Notes

**This is a DEMO system using localStorage:**
- Data stored in browser only
- Not suitable for production use
- No encryption at rest
- Anyone with browser access can view/modify data

**For production deployment:**
- Migrate to Supabase or Neon database
- Implement proper authentication (Supabase Auth)
- Use server-side session management
- Add audit logging to database
- Encrypt sensitive data

---

## Next Steps

After testing with demo credentials:
1. Review the [SECURITY_IMPLEMENTATION_ROADMAP.md](./SECURITY_IMPLEMENTATION_ROADMAP.md) for production requirements
2. Review the [EMPLOYEE_BREAK_GUIDE.md](./EMPLOYEE_BREAK_GUIDE.md) for full feature documentation
3. Plan database migration from localStorage
4. Implement proper authentication system
5. Configure real email notifications

---

## Support

If you need to reset all demo data:
1. Open browser developer console (F12)
2. Go to Application → Local Storage
3. Clear all entries
4. Refresh the page
5. Demo accounts will be recreated automatically
