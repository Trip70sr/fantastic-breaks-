import EmployeeBreakDashboard from "@/components/employee-break-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Employee Break Protocol</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <EmployeeBreakDashboard />
      </main>
      <footer className="bg-gray-100 py-4 px-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Trip-tech.art
        </div>
      </footer>
    </div>
  )
}
