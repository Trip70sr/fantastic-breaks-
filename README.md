# Employee Break Protocol App

A comprehensive web application for managing employee break schedules, tracking time, and ensuring proper coverage in healthcare and service organizations.

## 🚀 Features

### Core Functionality
- **Employee Management**: Add, edit, and organize employee information
- **Break Scheduling**: Schedule and manage employee breaks with conflict detection
- **Coverage Tracking**: Ensure adequate staffing during break periods
- **Time Management**: Track break durations and compliance
- **Data Export**: Export schedules and reports in multiple formats

### Advanced Features
- **Email Sharing**: Share schedules and updates via email
- **Real-time Updates**: Live synchronization across devices
- **Data Backup/Restore**: Secure data management
- **Analytics Dashboard**: Usage insights and reporting
- **Mobile Responsive**: Works on all devices

### Privacy & Compliance
- **GDPR Compliant**: Full privacy controls and consent management
- **Data Protection**: Anonymized analytics and secure data handling
- **User Consent**: Transparent privacy banner with detailed information

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Analytics**: Google Analytics 4 with privacy controls
- **Email**: SendGrid integration
- **Deployment**: GitHub Pages with automated CI/CD
- **Data Storage**: Local storage with backup/restore capabilities

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

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
   
   Edit `.env.local` with your configuration:
   \`\`\`env
   # Google Analytics (optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   
   # SendGrid for email sharing (optional)
   SENDGRID_API_KEY=SG.your_api_key_here
   SENDGRID_FROM_EMAIL=your-email@example.com
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## 🚀 Deployment

This app is configured for automatic deployment to GitHub Pages.

### GitHub Pages Setup

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the source

2. **Add Environment Variables** (optional)
   - Go to Settings → Secrets and variables → Actions
   - Add `NEXT_PUBLIC_GA_ID` for Google Analytics

3. **Deploy**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Site will be available at: `https://triptech-code.github.io/Employee-Breaks/`

## 📊 Analytics & Privacy

### Privacy-First Approach
- **Consent Required**: Users must explicitly opt-in to analytics
- **Data Minimization**: Only essential usage data is collected
- **IP Anonymization**: All IP addresses are anonymized
- **No Personal Data**: Employee information never leaves the device
- **Transparent Tracking**: Clear information about what's tracked

### What We Track (with consent)
- Page views and navigation patterns
- Feature usage (anonymized)
- Error reports (no sensitive data)
- Performance metrics
- Session duration

### Privacy Controls
- 26-month automatic data deletion
- No cross-site tracking
- No advertising or remarketing
- User can withdraw consent anytime

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | No |
| `SENDGRID_API_KEY` | SendGrid API key for email features | No |
| `SENDGRID_FROM_EMAIL` | From email address for notifications | No |
| `NEXTAUTH_SECRET` | Secret for future authentication features | No |

### Customization

The app can be customized by modifying:
- **Colors**: Update `tailwind.config.ts`
- **Branding**: Modify headers and footers in components
- **Features**: Enable/disable features in component files
- **Analytics**: Configure tracking in `lib/gtag.ts`

## 📱 Usage

### Getting Started
1. **Add Employees**: Start by adding your team members
2. **Schedule Breaks**: Create break schedules with proper coverage
3. **Monitor Coverage**: Ensure adequate staffing at all times
4. **Export Data**: Generate reports and schedules as needed

### Key Features
- **Drag & Drop**: Intuitive schedule management
- **Conflict Detection**: Automatic overlap prevention
- **Mobile Support**: Full functionality on mobile devices
- **Data Export**: CSV, PDF, and email formats
- **Real-time Sync**: Changes update across all devices

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🏗️ Development

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── .github/workflows/    # CI/CD configuration
\`\`\`

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🔄 Updates

The app automatically updates when deployed to GitHub Pages. For local development:

\`\`\`bash
git pull origin main
npm install
npm run dev
\`\`\`

## 📈 Roadmap

- [ ] User authentication and roles
- [ ] Database integration
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API endpoints
- [ ] Multi-language support

---

**Built with ❤️ by Trip-tech.art**

For more information, visit our [GitHub repository](https://github.com/Triptech-code/Employee-Breaks).
