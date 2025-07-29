import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { image: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return the image as a base64 string
    return NextResponse.json({ image: dbUser.image })

  } catch (error) {
    console.error('Error fetching avatar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
