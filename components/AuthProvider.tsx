'use client'

import { ClerkProvider } from '@clerk/nextjs'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <ClerkProvider>{children}</ClerkProvider>
}
