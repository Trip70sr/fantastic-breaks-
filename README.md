# Employee Break Management System

A comprehensive Next.js application for managing employee break schedules, tracking compliance, and optimizing workforce productivity.

## 🚀 Features

- **Break Scheduling**: Intelligent break scheduling with conflict detection
- **Real-time Tracking**: Live break status monitoring and analytics
- **Compliance Management**: Automated compliance checking and reporting
- **Employee Management**: Complete employee profile and role management
- **Data Analytics**: Comprehensive reporting and insights dashboard
- **Email Integration**: Automated notifications and sharing capabilities
- **Responsive Design**: Mobile-first design with dark/light mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Date Handling**: date-fns + react-day-picker
- **State Management**: React hooks and context
- **Deployment**: GitHub Pages with GitHub Actions

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Trip70sr/fantastic-breaks-.git
cd fantastic-breaks-
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🌐 Deployment

This application is configured for deployment on GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Access your live site at: `https://trip70sr.github.io/fantastic-breaks-/`

## 📁 Project Structure

\`\`\`
fantastic-breaks-/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and data
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── .github/workflows/      # GitHub Actions workflows
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

\`\`\`env
NEXT_PUBLIC_APP_NAME="Employee Break Protocol"
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
\`\`\`

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The site will be available at your GitHub Pages URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Triptech-code**
- Website: [https://triptech.art](https://triptech.art)
- Email: contact@triptech.art
- GitHub: [@Trip70sr](https://github.com/Trip70sr)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [GitHub Pages](https://pages.github.com/)
