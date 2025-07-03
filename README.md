# Employee Break Protocol App

A comprehensive employee break management system built with Next.js, featuring scheduling, tracking, and compliance tools for modern workplaces.

## 🚀 Features

- **Employee Management**: Add, edit, and manage employee information
- **Break Scheduling**: Schedule and track employee breaks with coverage assignments
- **Time Tracking**: Monitor break durations and compliance
- **Data Export**: Export schedules and reports in multiple formats (CSV, PDF)
- **Email Sharing**: Share schedules and reports via email
- **Privacy-First Analytics**: GDPR-compliant Google Analytics integration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on user preference

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Google Analytics 4 (privacy-compliant)
- **Deployment**: GitHub Pages with automated CI/CD
- **TypeScript**: Full type safety throughout the application

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

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
   - `NEXT_PUBLIC_GA_ID`: Your Google Analytics 4 Measurement ID
   - `SENDGRID_API_KEY`: Your SendGrid API key (optional, for email features)
   - `NEXTAUTH_SECRET`: A secure random string for authentication

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### GitHub Pages (Automated)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Deployment triggers automatically
2. **GitHub Actions** builds and deploys the static site
3. **Live site** available at: `https://triptech-code.github.io/Employee-Breaks/`

### Manual Deployment

\`\`\`bash
# Build the static site
npm run build

# The built files will be in the 'out' directory
# Upload the contents to your hosting provider
\`\`\`

## 📊 Analytics Setup

### Google Analytics 4 Configuration

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property
   - Copy your Measurement ID (format: G-XXXXXXXXXX)

2. **Configure Privacy Settings**
   - Set data retention to 2 months
   - Disable Google Signals
   - Enable IP anonymization
   - Disable advertising features

3. **Add to Environment**
   \`\`\`bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   \`\`\`

### Privacy Compliance

- ✅ GDPR compliant consent banner
- ✅ IP address anonymization
- ✅ No cross-site tracking
- ✅ User consent required before tracking
- ✅ Data retention limited to 2 months
- ✅ No personal employee data tracked

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | No |
| `SENDGRID_API_KEY` | SendGrid API key for email features | No |
| `FROM_EMAIL` | Email address for sending notifications | No |
| `NEXTAUTH_SECRET` | Secret for authentication (future use) | No |

### Feature Flags

Control which features are enabled:

\`\`\`env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SHARING=true
NEXT_PUBLIC_ENABLE_EXPORT=true
\`\`\`

## 📱 Usage

### Employee Management

1. **Add Employees**: Click "Add Employee" to register new team members
2. **Edit Information**: Update employee details, departments, and roles
3. **Bulk Import**: Import employee data from CSV files

### Break Scheduling

1. **Schedule Breaks**: Assign break times and durations
2. **Coverage Assignment**: Ensure adequate coverage during breaks
3. **Conflict Detection**: Automatic detection of scheduling conflicts

### Data Management

1. **Export Data**: Download schedules in CSV or PDF format
2. **Backup/Restore**: Save and restore application data
3. **Email Sharing**: Send schedules to managers and employees

## 🔒 Privacy & Security

### Data Protection

- **Local Storage**: All employee data stored locally in browser
- **No Server Storage**: No sensitive data sent to external servers
- **Privacy-First**: Analytics only with explicit user consent
- **GDPR Compliant**: Full compliance with privacy regulations

### Security Features

- **Input Validation**: All user inputs validated and sanitized
- **XSS Protection**: Content Security Policy headers
- **Secure Headers**: Security headers for production deployment

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Build Errors**
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Environment Variables**
- Ensure `.env.local` exists and contains required variables
- Restart development server after changing environment variables

**Analytics Not Working**
- Verify `NEXT_PUBLIC_GA_ID` is set correctly
- Check browser console for errors
- Ensure user has accepted analytics consent

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/Triptech-code/Employee-Breaks/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Triptech-code/Employee-Breaks/discussions)
- **Email**: support@triptech.art

## 🎯 Roadmap

### Upcoming Features

- [ ] **Authentication System**: User login and role-based access
- [ ] **Database Integration**: PostgreSQL/MySQL support
- [ ] **API Endpoints**: REST API for external integrations
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Reporting**: Detailed analytics and insights
- [ ] **Notifications**: Email and push notifications
- [ ] **Multi-language**: Internationalization support

### Version History

- **v1.0.0** - Initial release with core features
- **v0.9.0** - Beta release with Google Analytics
- **v0.8.0** - Alpha release with basic functionality

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment platform

---

**Built with ❤️ by [Triptech-code](https://github.com/Triptech-code)**

For more information, visit our [website](https://triptech.art) or follow us on [GitHub](https://github.com/Triptech-code).
