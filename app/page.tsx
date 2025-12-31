"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/employee-auth"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (isAdminAuthenticated()) {
      router.push("/admin")
    } else if (isAuthenticated()) {
      router.push("/employee-dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-blue-700">Loading...</p>
      </div>
    </div>
  )
}
