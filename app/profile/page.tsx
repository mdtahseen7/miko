'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'

interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio: string | null
  location: string | null
  website: string | null
  watchLater: any[]
  preferences: any
  createdAt: string
}

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
  }, [isLoaded, isSignedIn, router])

  // Fetch user profile
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpdate = (imageUrl: string) => {
    if (profile) {
      setProfile({
        ...profile,
        image: imageUrl || null
      })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleSignOut = () => {
    // Clerk handles sign out through UserButton component
    router.push('/')
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Miko" width={32} height={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent">
                Miko
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-8 border border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0 flex flex-col items-center lg:items-start space-y-4">
              <ProfilePictureUpload
                currentImage={profile.image}
                userName={profile.name}
                onImageUpdate={handleImageUpdate}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-center lg:text-left">{profile.name || 'User'}</h1>
                  <p className="text-gray-400 text-center lg:text-left">{profile.email}</p>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors self-center sm:self-auto"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      placeholder="Your location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white font-semibold rounded-lg hover:from-[#7B1FA2] hover:to-[#E91E63] transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.bio && (
                    <p className="text-gray-300">{profile.bio}</p>
                  )}
                  {profile.location && (
                    <p className="text-gray-400 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </p>
                  )}
                  {profile.website && (
                    <p className="text-gray-400 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                        {profile.website}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Watch Later</h3>
            <p className="text-3xl font-bold text-purple-400">{profile.watchLater?.length || 0}</p>
            <p className="text-gray-400 text-sm">Saved items</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Account Type</h3>
            <p className="text-2xl font-bold text-green-400">Free</p>
            <p className="text-gray-400 text-sm">Plan</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Member Since</h3>
            <p className="text-xl font-bold text-blue-400">
              {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
            <p className="text-gray-400 text-sm">Join date</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/watch"
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
            >
              <div className="text-purple-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">Watch Movies</p>
            </Link>
            
            <Link
              href="/livesports"
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
            >
              <div className="text-green-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="font-medium">Live Sports</p>
            </Link>
            
            <Link
              href="/watch-sports"
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
            >
              <div className="text-orange-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">Sports Replays</p>
            </Link>
            
            <Link
              href="/settings"
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
            >
              <div className="text-gray-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium">Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
