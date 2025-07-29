import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { image, fileName } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // In a production app, you would:
    // 1. Upload to cloud storage (Cloudinary, AWS S3, Vercel Blob, etc.)
    // 2. Get the public URL
    // 3. Store only the URL in the database
    
    // For demo purposes, we'll store the base64 directly (not recommended for production)
    // This is just for development - in production, use proper image hosting
    
    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        image: image, // In production, this would be the cloud storage URL
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    })

    return NextResponse.json({
      success: true,
      imageUrl: updatedUser.image,
      message: 'Profile picture updated successfully'
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        image: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile picture removed successfully'
    })
  } catch (error) {
    console.error('Avatar removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    )
  }
}
