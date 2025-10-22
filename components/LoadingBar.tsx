'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LoadingBar() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    
    // Simulate loading time with realistic timing
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div className="h-full bg-gradient-to-r from-[#8A2BE2] via-[#FF6EC4] to-[#8A2BE2] animate-loading-bar shadow-lg shadow-purple-500/30"></div>
    </div>
  )
}
