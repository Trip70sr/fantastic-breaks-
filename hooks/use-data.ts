"use client"

import { useCallback } from "react"
import useSWR, { mutate } from "swr"
import type { Employee, BreakEntry } from "@/lib/types"
import { initialEmployees } from "@/lib/data"

// Storage keys
const EMPLOYEES_KEY = "employees"
const BREAK_ENTRIES_KEY = "breakEntries"

// Async fetchers (non-blocking)
const fetchEmployees = async (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window === "undefined") {
        resolve([])
        return
      }
      const data = localStorage.getItem(EMPLOYEES_KEY)
      if (data) {
        resolve(JSON.parse(data))
      } else {
        localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initialEmployees))
        resolve(initialEmployees)
      }
    }, 0)
  })
}

const fetchBreakEntries = async (): Promise<BreakEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window === "undefined") {
        resolve([])
        return
      }
      const data = localStorage.getItem(BREAK_ENTRIES_KEY)
      resolve(data ? JSON.parse(data) : [])
    }, 0)
  })
}

// Debounced write to prevent excessive localStorage writes
let writeTimeout: NodeJS.Timeout | null = null
const debouncedWrite = (key: string, data: any, delay = 300) => {
  if (writeTimeout) clearTimeout(writeTimeout)
  writeTimeout = setTimeout(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }, delay)
}

// Hook for employees
export function useEmployees() {
  const { data, error, isLoading } = useSWR<Employee[]>(EMPLOYEES_KEY, fetchEmployees, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    fallbackData: [],
  })

  const updateEmployees = useCallback((employees: Employee[]) => {
    mutate(EMPLOYEES_KEY, employees, false)
    debouncedWrite(EMPLOYEES_KEY, employees)
  }, [])

  const addEmployee = useCallback(
    (employee: Employee) => {
      const current = data || []
      const updated = [...current, employee]
      updateEmployees(updated)
    },
    [data, updateEmployees],
  )

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      const current = data || []
      const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
      updateEmployees(updated)
    },
    [data, updateEmployees],
  )

  const deleteEmployee = useCallback(
    (id: string) => {
      const current = data || []
      const updated = current.filter((e) => e.id !== id)
      updateEmployees(updated)
    },
    [data, updateEmployees],
  )

  return {
    employees: data || [],
    isLoading,
    error,
    updateEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
}

// Hook for break entries
export function useBreakEntries() {
  const { data, error, isLoading } = useSWR<BreakEntry[]>(BREAK_ENTRIES_KEY, fetchBreakEntries, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    fallbackData: [],
  })

  const updateBreakEntries = useCallback((entries: BreakEntry[]) => {
    mutate(BREAK_ENTRIES_KEY, entries, false)
    debouncedWrite(BREAK_ENTRIES_KEY, entries)
  }, [])

  const addBreakEntry = useCallback(
    (entry: BreakEntry) => {
      const current = data || []
      const updated = [...current, entry]
      updateBreakEntries(updated)
    },
    [data, updateBreakEntries],
  )

  const updateBreakEntry = useCallback(
    (id: string, updates: Partial<BreakEntry>) => {
      const current = data || []
      const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
      updateBreakEntries(updated)
    },
    [data, updateBreakEntries],
  )

  const deleteBreakEntry = useCallback(
    (id: string) => {
      const current = data || []
      const updated = current.filter((e) => e.id !== id)
      updateBreakEntries(updated)
    },
    [data, updateBreakEntries],
  )

  return {
    breakEntries: data || [],
    isLoading,
    error,
    updateBreakEntries,
    addBreakEntry,
    updateBreakEntry,
    deleteBreakEntry,
  }
}
