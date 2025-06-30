# Employee Break Protocol App

A comprehensive employee break management system designed for healthcare and service organizations to efficiently manage employee breaks, schedules, and coverage assignments.

## Features

### 🏥 Employee Management
- Add, edit, and remove employees
- Organize by departments and roles
- Track employee availability and preferences
- Bulk import/export employee data

### ⏰ Break Scheduling
- Schedule breaks for individuals or groups
- Automatic coverage assignment
- Conflict detection and resolution
- Multiple break types (lunch, coffee, personal, etc.)

### 📊 Analytics & Reporting
- Real-time dashboard with key metrics
- Break coverage statistics
- Employee utilization reports
- Export data to CSV/Excel

### 📧 Collaboration
- Share schedules via email
- Generate shareable links
- Real-time updates across devices
- Notification system

### 🔒 Privacy & Security
- GDPR-compliant analytics
- No personal data tracking
- Secure data handling
- Privacy-first design

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Analytics**: Google Analytics 4 (privacy-compliant)
- **Email**: SendGrid integration
- **Deployment**: GitHub Pages
- **Storage**: Local storage (with backup/restore)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/YOUR_Trip70sr/fantastic-breaks.git
   cd fantastic-breaks
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` with your configuration:
   \`\`\`env
   # Google Analytics (optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   
   # SendGrid (optional - for email features)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourcompany.com
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### GitHub Pages (Automatic)

The app is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - triggers automatic deployment
2. **Monitor deployment** - check the Actions tab
3. **Access your site** - `https://YOUR_Trip70sr.github.io/fantastic-breaks/`

### Manual Build

\`\`\`bash
# Build for production
npm run build

# Test the build locally
npm run start
\`\`\`

## Configuration

### Google Analytics Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (G-XXXXXXXXXX)
3. Add it to your `.env.local` file
4. The app includes privacy-compliant tracking with user consent

### Email Integration

1. Sign up for [SendGrid](https://sendgrid.com)
2. Create an API key
3. Add your API key and sender email to `.env.local`
4. Email sharing features will be automatically enabled

## Privacy & Compliance

### GDPR Compliance
- ✅ User consent required before any tracking
- ✅ Clear privacy information displayed
- ✅ Data minimization - only necessary data collected
- ✅ Right to withdraw consent
- ✅ Automatic data deletion (2-month retention)

### Data Protection
- 🔒 No employee personal data tracked in analytics
- 🔒 IP addresses anonymized
- 🔒 No cross-site tracking
- 🔒 Secure data handling practices

## Usage Guide

### Adding Employees
1. Click "Add Employee" button
2. Fill in employee details
3. Assign to department/role
4. Set availability preferences

### Scheduling Breaks
1. Select employee(s) from the list
2. Choose break type and duration
3. System automatically suggests coverage
4. Confirm and save schedule

### Generating Reports
1. Use the Analytics tab
2. Select date range and filters
3. Export data in preferred format
4. Share reports via email

### Sharing Schedules
1. Click "Share" button
2. Enter recipient email addresses
3. Add optional message
4. Send invitation with secure link

## Troubleshooting

### Common Issues

**Build Errors**
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Environment Variables Not Working**
- Ensure `.env.local` is in the root directory
- Restart development server after changes
- Check variable names have `NEXT_PUBLIC_` prefix for client-side access

**GitHub Pages 404 Error**
- Verify GitHub Pages is enabled in repository settings
- Check that GitHub Actions workflow completed successfully
- Ensure `basePath` in `next.config.mjs` matches repository name

### Support

For technical support or feature requests:
1. Check existing [GitHub Issues](https://github.com/YOUR_Trip70sr/fantastic-breaks/issues)
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Analytics by [Google Analytics 4](https://analytics.google.com/)
- Email service by [SendGrid](https://sendgrid.com/)

---

**Employee Break Protocol App** - Streamlining break management for healthcare and service organizations.

For more information, visit our [GitHub repository](https://github.com/YOUR_Trip70sr/fantastic-breaks).
