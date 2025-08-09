'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LoadingBar() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Start loading when pathname changes
    setLoading(true)
    
    // Simulate loading time with realistic timing
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800) // Slightly longer for a more premium feel

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <>
      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
        <div className="h-full bg-gradient-to-r from-[#8A2BE2] via-[#FF6EC4] to-[#8A2BE2] animate-loading-bar shadow-lg shadow-purple-500/30"></div>
      </div>

      {/* Full Screen Overlay with Logo */}
      <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md flex items-center justify-center">
        <div className="text-center">
          {/* Animated Logo Container */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-[#8A2BE2] border-r-[#FF6EC4] rounded-full animate-spin"></div>
              {/* Inner counter-rotating ring */}
              <div className="absolute inset-3 border-4 border-transparent border-b-[#FF6EC4] border-l-[#8A2BE2] rounded-full animate-spin-reverse"></div>
              {/* Innermost pulsing ring */}
              <div className="absolute inset-6 border-2 border-purple-400/50 rounded-full animate-pulse"></div>
              
              {/* Miko Logo Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <span className="text-white font-bold text-lg tracking-wider">M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Text with enhanced styling */}
          <div className="text-white">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent mb-3 tracking-wide">
              Miko
            </h3>
            <p className="text-gray-300 text-sm mb-4 font-medium">Loading your content...</p>
            
            {/* Bouncing dots */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#8A2BE2] rounded-full animate-bounce shadow-lg"></div>
              <div className="w-2.5 h-2.5 bg-[#FF6EC4] rounded-full animate-bounce animation-delay-200 shadow-lg"></div>
              <div className="w-2.5 h-2.5 bg-[#8A2BE2] rounded-full animate-bounce animation-delay-400 shadow-lg"></div>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2]/10 via-transparent to-[#FF6EC4]/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </>
  )
}
