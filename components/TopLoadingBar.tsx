'use client'

import { useEffect, useState } from 'react'

interface TopLoadingBarProps {
  isLoading: boolean;
}

export default function TopLoadingBar({ isLoading }: TopLoadingBarProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
      // Auto hide after a short duration
      const timer = setTimeout(() => {
        setShow(false)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div className="h-full bg-gradient-to-r from-[#8A2BE2] via-[#FF6EC4] to-[#8A2BE2] animate-loading-bar shadow-lg shadow-purple-500/30"></div>
    </div>
  )
}
