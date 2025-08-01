'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  // Auto-detect route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
