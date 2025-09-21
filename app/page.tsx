import EmployeeBreakDashboard from "@/components/employee-break-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Break Management System</h1>
          <p className="text-gray-600">
            Track employee breaks, manage coverage, and ensure compliance with break policies.
          </p>
        </div>
        <EmployeeBreakDashboard />
      </div>
    </main>
  )
}
