# Employee Break Management System

A comprehensive web application for tracking employee breaks and managing coverage assignments.

## Features

- **Break Timesheet Management**: Track employee break schedules with start/end times
- **Coverage Assignment**: Assign coverage for employee breaks to ensure continuous operations
- **Employee Management**: Add, edit, and manage employee information and departments
- **Coverage Alerts**: Visual alerts for breaks missing coverage assignments
- **Data Persistence**: Local storage for data persistence across sessions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Theme switching support
- **Data Export**: Backup and restore functionality

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd employee-break-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
\`\`\`

### Deployment

This app is configured for static export and can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- Any static hosting service

## Usage

### Managing Employees

1. Click "Manage Employees" to open the employee management dialog
2. Add new employees with their name and department
3. Edit existing employee information
4. Delete employees (this will also remove their break entries)

### Break Timesheet

1. Navigate to the "Break Timesheet" tab
2. Click "Add Entry" to create a new break schedule
3. Select employee, date, and break times
4. Assign coverage employees for each break
5. Add notes if needed

### Coverage Alerts

- Breaks missing coverage are highlighted in red
- Alert badges show missing coverage status
- Coverage alerts appear at the top of the dashboard

### Data Management

1. Go to Settings tab
2. Use "Data Backup & Restore" to:
   - Download backup files
   - Restore from previous backups
   - Import/export data

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── break-timesheet-table.tsx
│   ├── employee-management.tsx
│   ├── employee-break-dashboard.tsx
│   └── ...
├── lib/                  # Utility functions
│   ├── data.ts          # Mock data and helpers
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
└── public/              # Static assets
\`\`\`

## Key Components

- **EmployeeBreakDashboard**: Main dashboard with stats and navigation
- **BreakTimesheetTable**: Table view for managing break schedules
- **EmployeeManagement**: Dialog for managing employee data
- **DataBackupRestore**: Backup and restore functionality
- **EmailSharing**: Email and link sharing features

## Data Structure

### Employee
\`\`\`typescript
interface Employee {
  id: string
  name: string
  department: Department
  isActive: boolean
  workingToday: boolean
}
\`\`\`

### Break Entry
\`\`\`typescript
interface BreakEntry {
  id: string
  employeeId: string
  date: string
  break1Start: string
  break1End: string
  break1Coverage: string
  break2Start: string
  break2End: string
  break2Coverage: string
  notes: string
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
