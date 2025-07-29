'use client'

import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  src: string | null | undefined
  alt: string
  size: number
  fallbackText: string
  className?: string
}

export default function Avatar({ src, alt, size, fallbackText, className = '' }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  // Handle image load errors
  const handleImageError = () => {
    setImageError(true)
  }

  // Check if it's a base64 image
  const isBase64 = src && src.startsWith('data:image')
  
  if (!src || imageError) {
    // Show fallback with initials
    return (
      <div 
        className={`bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-full flex items-center justify-center text-white font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {fallbackText.charAt(0)?.toUpperCase() || 'U'}
      </div>
    )
  }

  if (isBase64) {
    // For base64 images, use regular img tag
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        onError={handleImageError}
        style={{ width: size, height: size }}
      />
    )
  }

  // For URL images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={handleImageError}
      unoptimized={!!isBase64} // Disable optimization for base64
    />
  )
}
