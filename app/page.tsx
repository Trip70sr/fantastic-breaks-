import EmployeeBreakDashboard from "@/components/employee-break-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employee Break Management System</h1>
          <p className="text-lg text-gray-600">Track employee breaks, manage coverage, and ensure compliance</p>
        </div>
        <EmployeeBreakDashboard />
      </div>
    </main>
  )
}
