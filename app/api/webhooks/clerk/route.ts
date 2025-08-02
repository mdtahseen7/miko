import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ''

// Define the Clerk webhook event types
interface ClerkWebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    email_addresses?: { email_address: string }[]
    first_name?: string
    last_name?: string
    image_url?: string
  }
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: ClerkWebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      // Create user in database
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses?.[0]?.email_address || null,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          image: image_url || null,
        },
      })

      console.log('User created in database:', id)
    } catch (error) {
      console.error('Error creating user in database:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      // Update user in database
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses?.[0]?.email_address || null,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          image: image_url || null,
        },
      })

      console.log('User updated in database:', id)
    } catch (error) {
      console.error('Error updating user in database:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      // Delete user from database
      await prisma.user.delete({
        where: { clerkId: id },
      })

      console.log('User deleted from database:', id)
    } catch (error) {
      console.error('Error deleting user from database:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
