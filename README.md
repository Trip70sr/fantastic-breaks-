# Employee Break Protocol App

A comprehensive employee break management system built with Next.js, featuring scheduling, tracking, compliance monitoring, and analytics.

## 🚀 Features

### Core Functionality
- **Employee Management**: Add, edit, and organize employee information
- **Break Scheduling**: Create and manage break schedules with conflict detection
- **Real-time Tracking**: Monitor break status and compliance
- **Coverage Assignment**: Automatically assign coverage for breaks
- **Data Export**: Export schedules and reports in multiple formats
- **Email Sharing**: Share schedules and reports via email

### Analytics & Privacy
- **Google Analytics 4**: Privacy-first analytics with GDPR compliance
- **Consent Management**: User-controlled analytics consent
- **Performance Tracking**: Monitor app usage and performance
- **Error Tracking**: Automatic error reporting for debugging

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Data Persistence**: Local storage with backup/restore
- **Static Export**: Optimized for GitHub Pages deployment
- **TypeScript**: Full type safety throughout the application

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Google Analytics 4
- **Deployment**: GitHub Pages
- **Language**: TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Triptech-code/Employee-Breaks.git
   cd Employee-Breaks
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` and add your configuration:
   \`\`\`env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional: Your Google Analytics ID
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### GitHub Pages (Automatic)

This app is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Deployment triggers automatically
2. **Monitor deployment** - Check the Actions tab in your repository
3. **Access your site** - Available at `https://triptech-code.github.io/Employee-Breaks/`

### Manual Deployment

\`\`\`bash
# Build the static site
npm run build

# The built files will be in the 'out' directory
# Upload the contents to your web server
\`\`\`

## 📊 Google Analytics Setup

### 1. Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Copy your Measurement ID (G-XXXXXXXXXX)

### 2. Configure Environment Variables
Add your GA4 ID to your repository secrets:
1. Go to your GitHub repository Settings
2. Navigate to Secrets and variables → Actions
3. Add `NEXT_PUBLIC_GA_ID` with your measurement ID

### 3. Privacy Compliance
The app includes:
- ✅ GDPR-compliant consent banner
- ✅ IP anonymization
- ✅ No cross-site tracking
- ✅ 2-month data retention
- ✅ User consent management

## 🎯 Usage

### Employee Management
1. **Add Employees**: Click "Add Employee" to create new employee records
2. **Edit Information**: Click on any employee to modify their details
3. **Import Data**: Use CSV import for bulk employee addition
4. **Export Data**: Download employee lists in various formats

### Break Scheduling
1. **Create Schedules**: Set up break times for employees
2. **Assign Coverage**: Automatically assign coverage for breaks
3. **Monitor Compliance**: Track break adherence and violations
4. **Generate Reports**: Create detailed break reports

### Data Management
1. **Backup Data**: Export all data for backup purposes
2. **Restore Data**: Import previously backed up data
3. **Share Reports**: Email reports to stakeholders
4. **Analytics**: View usage analytics (with consent)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID | Optional |
| `SENDGRID_API_KEY` | SendGrid API key for email features | Optional |
| `FROM_EMAIL` | Email address for sending reports | Optional |
| `NEXTAUTH_SECRET` | Secret for authentication (future) | Optional |

### Customization

The app can be customized by modifying:
- **Colors**: Update `tailwind.config.ts`
- **Components**: Modify files in `/components`
- **Data Structure**: Update types in `/lib/types.ts`
- **Analytics**: Configure tracking in `/lib/gtag.ts`

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the Issues** - Look for existing solutions
2. **Create an Issue** - Report bugs or request features
3. **Documentation** - Review this README and code comments
4. **Community** - Ask questions in Discussions

## 🎉 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Lucide** - Comprehensive icon library
- **Next.js** - Powerful React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Hosting and deployment platform

---

**Built with ❤️ by Triptech-code**

For more information, visit: [https://triptech-code.github.io/Employee-Breaks/](https://triptech-code.github.io/Employee-Breaks/)
