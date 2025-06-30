# Employee Break Protocol App

A comprehensive web application for managing employee breaks, schedules, and coverage assignments. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- 👥 **Employee Management**: Add, edit, and organize employee information
- ⏰ **Break Scheduling**: Create and manage break schedules with conflict detection
- 📊 **Coverage Assignment**: Automatically assign coverage for breaks
- 📈 **Analytics Dashboard**: Track break patterns and employee availability
- 📧 **Email Sharing**: Share schedules and reports via email
- 💾 **Data Management**: Export, backup, and restore data

### Privacy & Analytics
- 🔒 **Privacy-First**: GDPR compliant with user consent management
- 📊 **Google Analytics 4**: Track app usage while respecting privacy
- 🛡️ **Data Protection**: No personal employee data tracked
- ⏱️ **Data Retention**: Analytics data auto-deleted after 2 months

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Analytics 4 property (optional)
- SendGrid account (optional, for email features)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd employee-break-protocol-app
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
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@yourcompany.com
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Google Analytics Setup

### 1. Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Copy your Measurement ID (G-XXXXXXXXXX)
4. Add it to your `.env.local` file

### 2. Configure Privacy Settings
In your GA4 property:
- **Data Retention**: Set to 2 months
- **Google Signals**: Disable for privacy
- **IP Anonymization**: Enabled automatically
- **Consent Mode**: Configured in the app

### 3. Custom Dimensions (Optional)
Set up these custom dimensions in GA4:
- `app_version` - Track app version usage
- `user_type` - Distinguish user roles
- `feature_name` - Track feature usage
- `error_type` - Categorize errors

## Email Configuration (SendGrid)

### 1. Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your sender identity
3. Create an API key with Mail Send permissions

### 2. Configure Environment Variables
\`\`\`env
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=noreply@yourcompany.com
\`\`\`

### 3. Test Email Functionality
- Use the "Share via Email" feature in the app
- Check SendGrid dashboard for delivery status

## Features That Work Without Setup

The app is designed to work immediately without any configuration:

✅ **Core Features (No Setup Required)**
- Employee management
- Break scheduling
- Coverage assignment
- Data export (CSV)
- Local data storage
- Responsive design

⚙️ **Enhanced Features (Require Setup)**
- Email sharing (needs SendGrid)
- Analytics tracking (needs GA4)
- Error monitoring (needs GA4)

## Development

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with analytics
│   ├── page.tsx           # Main dashboard page
│   └── shared/            # Shared access pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── employee-break-dashboard.tsx
│   ├── google-analytics.tsx
│   └── privacy-banner.tsx
├── hooks/                # Custom React hooks
│   └── use-analytics.ts  # Analytics tracking hooks
├── lib/                  # Utility functions
│   ├── gtag.ts          # Google Analytics utilities
│   ├── data.ts          # Data management
│   └── types.ts         # TypeScript types
└── types/               # Global type definitions
\`\`\`

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

### Analytics Events Tracked

The app tracks these events (with user consent):
- **Employee Actions**: Add, edit, delete employees
- **Break Management**: Schedule, modify breaks
- **Data Operations**: Export, backup, restore
- **User Engagement**: Feature usage, session duration
- **Error Tracking**: Application errors (anonymized)

## Privacy & Compliance

### GDPR Compliance
- ✅ **Consent Required**: Users must opt-in to analytics
- ✅ **Data Minimization**: Only necessary data collected
- ✅ **Right to Withdraw**: Users can disable tracking anytime
- ✅ **Data Retention**: Automatic deletion after 2 months
- ✅ **Transparency**: Clear explanation of data usage

### Data Protection
- **No Personal Data**: Employee names/info not tracked
- **IP Anonymization**: All IP addresses anonymized
- **Secure Storage**: Local data stays in browser
- **No Cross-Site Tracking**: Analytics limited to this app

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted

## Troubleshooting

### Common Issues

**Analytics not working?**
- Check if `NEXT_PUBLIC_GA_ID` is set correctly
- Verify user has accepted analytics consent
- Check browser console for errors

**Email sharing not working?**
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Review SendGrid activity dashboard

**Build errors?**
- Run `npm run type-check` to find TypeScript issues
- Clear `.next` folder and rebuild
- Check all environment variables are set

### Debug Mode
Enable debug logging in development:
\`\`\`env
NEXT_PUBLIC_ANALYTICS_DEBUG=true
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
