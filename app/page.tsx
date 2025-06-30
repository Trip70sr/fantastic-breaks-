import EmployeeBreakDashboard from "@/components/employee-break-dashboard"
import PrivacyBanner from "@/components/privacy-banner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <EmployeeBreakDashboard />
      <PrivacyBanner />
    </main>
  )
}
