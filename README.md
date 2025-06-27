# Employee Break Protocol App

A comprehensive employee break management system built with Next.js, TypeScript, and Tailwind CSS. This application helps manage employee schedules, break assignments, and coverage tracking for healthcare and service organizations.

## 🚀 Features

### Core Functionality
- **Employee Management**: Add, edit, and delete employee records with department assignments
- **Break Scheduling**: Schedule and track employee breaks with coverage assignments
- **Shift Management**: Manage work shifts with automatic break eligibility calculation
- **Coverage Tracking**: Assign coverage employees for breaks to ensure continuous service
- **Time Tracking**: Track time outside therapy for comprehensive scheduling

### Advanced Features
- **Management Dashboard**: Real-time analytics and compliance monitoring
- **Data Export**: Export schedules and reports to CSV format
- **Backup & Restore**: Complete data backup and restoration capabilities
- **Email Sharing**: Share app access with team members via secure links
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Management Controls
- **Break Compliance Monitoring**: Track break compliance rates and identify issues
- **Coverage Analytics**: Monitor coverage assignments and gaps
- **Notification System**: Configurable alerts for compliance thresholds
- **Department Filtering**: Filter and analyze data by department
- **Real-time Updates**: Live updates of schedules and assignments

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React hooks with localStorage persistence
- **Form Handling**: Native React forms with validation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Quick Start

1. **Clone or download the project files**

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   Edit `.env.local` with your configuration:
   \`\`\`env
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@yourcompany.com
   DIRECTOR_EMAIL=manager@yourcompany.com
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
employee-break-app/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── shared/[token]/          # Shared access pages
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── employee-break-dashboard.tsx
│   ├── employee-management.tsx
│   ├── break-timesheet-table.tsx
│   ├── management-access.tsx
│   ├── data-backup-restore.tsx
│   ├── email-sharing.tsx
│   └── test-share-demo.tsx
├── lib/                         # Utility functions
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils.ts                 # Utility functions
│   └── data.ts                  # Initial data
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies
\`\`\`

## 🎯 Usage Guide

### Getting Started
1. **Add Employees**: Use the "Manage Employees" button to add your team members
2. **Create Schedules**: Select employees and create work schedules for specific dates
3. **Assign Breaks**: Add break times and assign coverage employees
4. **Monitor Compliance**: Use the management dashboard to track compliance

### Key Workflows

#### Daily Schedule Management
1. Select the date using the calendar
2. View employees working that day
3. Add or modify break schedules
4. Assign coverage for each break
5. Export daily reports as needed

#### Employee Management
1. Click "Manage Employees"
2. Add new employees with department assignments
3. Edit existing employee information
4. Create work schedules for multiple employees

#### Data Management
1. Use "Backup & Restore" to save your data
2. Export CSV reports for external analysis
3. Share app access with team members via email

## 🔧 Configuration

### Environment Variables
- `SENDGRID_API_KEY`: For email notifications (optional)
- `FROM_EMAIL`: Sender email address
- `DIRECTOR_EMAIL`: Recipient for break alerts
- `NEXTAUTH_SECRET`: Security key for authentication
- `NEXTAUTH_URL`: Application URL

### Customization
- **Departments**: Modify department types in `lib/types.ts`
- **Break Rules**: Adjust break eligibility rules in utility functions
- **Styling**: Customize colors and themes in `tailwind.config.ts`
- **Notifications**: Configure alert thresholds in management settings

## 📊 Features Deep Dive

### Break Management
- **Automatic Eligibility**: Second breaks automatically available for 6.5+ hour shifts
- **Coverage Assignment**: Ensure continuous service with coverage tracking
- **Time Validation**: Prevent scheduling conflicts and invalid time ranges
- **Outside Therapy Tracking**: Track time away from direct patient care

### Management Analytics
- **Compliance Rates**: Monitor break and coverage compliance percentages
- **Department Breakdown**: Analyze staffing by department
- **Overtime Tracking**: Identify employees working extended hours
- **Real-time Alerts**: Configurable notifications for compliance issues

### Data Security
- **Local Storage**: Data persists locally in browser storage
- **Secure Sharing**: Time-limited, permission-based access links
- **Data Export**: Complete data portability with CSV exports
- **Backup System**: Full data backup and restoration capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Works with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔄 Updates

### Version 1.0.0
- Initial release with core functionality
- Employee and break management
- Management dashboard and analytics
- Email sharing capabilities
- Data backup and restore

### Planned Features
- Database integration
- Advanced reporting
- Mobile app
- API endpoints
- Multi-tenant support

---

**Built with ❤️ by Trip-tech.art**

*Empowering healthcare teams with better break management*
