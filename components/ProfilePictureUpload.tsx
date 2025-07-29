'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import Avatar from './Avatar'

interface ProfilePictureUploadProps {
  currentImage: string | null
  userName: string | null
  onImageUpdate: (imageUrl: string) => void
}

export default function ProfilePictureUpload({ 
  currentImage, 
  userName, 
  onImageUpdate 
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Convert to base64 for storage (in a real app, you'd upload to cloud storage)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        // In a real application, you would upload to a service like:
        // - Cloudinary
        // - AWS S3
        // - Vercel Blob
        // - Supabase Storage
        
        // For demo purposes, we'll store as base64 (not recommended for production)
        try {
          const response = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64,
              fileName: file.name,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            onImageUpdate(data.imageUrl)
            // Clerk automatically updates user data
          } else {
            throw new Error('Upload failed')
          }
        } catch (error) {
          console.error('Upload error:', error)
          alert('Failed to upload image. Please try again.')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('File processing error:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const removeProfilePicture = async () => {
    setUploading(true)
    try {
      const response = await fetch('/api/user/upload-avatar', {
        method: 'DELETE',
      })

      if (response.ok) {
        onImageUpdate('')
        // Clerk automatically updates user data
      } else {
        throw new Error('Failed to remove image')
      }
    } catch (error) {
      console.error('Remove image error:', error)
      alert('Failed to remove image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Current Profile Picture */}
      <div className="relative">
        <div className="relative group">
          <Avatar
            src={currentImage}
            alt={userName || 'Profile picture'}
            size={120}
            fallbackText={userName || 'U'}
            className="border-4 border-gray-600"
          />
          {currentImage && !uploading && (
            <button
              onClick={removeProfilePicture}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove profile picture"
            >
              ×
            </button>
          )}
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-purple-400 bg-purple-400/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-purple-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white font-medium rounded-lg hover:from-[#7B1FA2] hover:to-[#E91E63] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : currentImage ? 'Change Picture' : 'Upload Picture'}
      </button>
      
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Your profile picture will be visible to other users. Make sure it follows our community guidelines.
      </p>
    </div>
  )
}
