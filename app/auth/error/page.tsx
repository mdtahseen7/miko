'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthErrorPage() {
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Get error from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    setError(errorParam)
  }, [])

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          message: 'This Google account is not linked to your Nova account. Try signing in with email/password first, then link your Google account from your profile.',
          action: 'Sign in with email instead'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Configuration Error',
          message: 'There was a problem with Google OAuth. This is usually due to redirect URI mismatch in Google Cloud Console.',
          action: 'Try again or contact support'
        }
      case 'Signin':
        return {
          title: 'Sign In Error',
          message: 'Invalid email or password. Please check your credentials and try again.',
          action: 'Try again'
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You need to be signed in to access this page.',
          action: 'Sign in to continue'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'Something went wrong during authentication. Please try again.',
          action: 'Try again'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center space-x-3 mb-8">
          <Image src="/logo.png" alt="Nova" width={48} height={48} />
          <span className="text-3xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent tracking-wide">
            Nova
          </span>
        </Link>

        {/* Error Content */}
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">{errorInfo.title}</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">{errorInfo.message}</p>

          {/* Debug Info */}
          {error && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-400 mb-2">Error Code:</p>
              <code className="text-sm text-red-400 bg-gray-900 px-2 py-1 rounded">{error}</code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full py-3 px-4 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white font-semibold rounded-lg hover:from-[#7B1FA2] hover:to-[#E91E63] transition-all duration-200"
            >
              {errorInfo.action}
            </Link>
            
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Troubleshooting Tips:</h3>
            <ul className="text-xs text-gray-400 space-y-2 text-left">
              <li>• Clear your browser cookies and try again</li>
              <li>• Make sure you're using the correct email and password</li>
              <li>• Check if your account exists (try password reset)</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
