# Miko Authentication System

## Overview
Complete user authentication system built with NextAuth.js, supporting both Google OAuth and traditional email/password authentication.

## Features

### Authentication Methods
- **Google OAuth**: One-click sign-in with Google account
- **Email/Password**: Traditional registration and login
- **Session Management**: Persistent login sessions with JWT

### User Features
- **User Registration**: Create account with name, email, and password
- **User Profile**: Editable profile with bio, location, and website
- **Profile Picture**: Google profile picture or custom avatar
- **Account Management**: View account details and statistics

### Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **Session Protection**: JWT-based authentication
- **Database Security**: Prisma ORM with type safety
- **API Protection**: Protected routes for user data

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?   // For email/password auth
  emailVerified DateTime?
  image         String?
  bio           String?
  location      String?
  website       String?
  watchLater    Json      @default("[]")
  preferences   Json      @default("{}")
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handler
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Authentication Pages
- `/auth/signin` - Sign in page
- `/auth/signup` - Registration page
- `/profile` - User profile and dashboard

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# View database (optional)
npx prisma studio
```

### 3. Environment Setup
1. Copy `.env.local` and update values
2. Generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

## Usage

### Client-Side Authentication
```tsx
import { useSession, signIn, signOut } from 'next-auth/react'

function Component() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <p>Loading...</p>
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

### Server-Side Authentication
```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Protected route logic
}
```

## Components

### Navbar Integration
- Shows sign in/sign up buttons when not authenticated
- Displays user avatar and dropdown menu when authenticated
- Profile link and sign out option in dropdown

### Profile Page
- Editable user information
- Account statistics
- Quick action buttons
- Responsive design

## Features Integration

### Watch Later
- User-specific watch later lists stored in database
- Persistent across sessions
- Accessible from profile page

### Preferences
- User preferences stored as JSON
- Customizable viewing settings
- Theme and display preferences

## Security Considerations

1. **Password Security**: All passwords hashed with bcryptjs
2. **Session Security**: JWT tokens with configurable expiration
3. **API Protection**: All user routes require authentication
4. **Database Security**: Prisma prevents SQL injection
5. **Environment Variables**: Sensitive data in environment files

## Deployment Notes

### Vercel Deployment

#### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

**Required Variables:**
```env
# NextAuth.js (CRITICAL - Update these!)
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-production-secret-here"

# Database (Use Vercel Postgres or external DB)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Google OAuth (Update for production domain)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### 2. Database Setup for Vercel

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Update DATABASE_URL in Vercel dashboard
# Format: postgresql://default:password@host:5432/verceldb?sslmode=require
```

**Option B: External Database (Supabase/PlanetScale)**
```env
# Example for Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?sslmode=require"

# Example for PlanetScale
DATABASE_URL="mysql://[username]:[password]@[host]/[database]?sslmode=require"
```

#### 3. Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Add production redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
3. Update authorized JavaScript origins:
   ```
   https://your-app-name.vercel.app
   ```

#### 4. Build Configuration
Create `vercel.json` in your project root:
```json
{
  "build": {
    "env": {
      "SKIP_ENV_VALIDATION": "1"
    }
  },
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  }
}
```

#### 5. Pre-deployment Steps
```bash
# Generate Prisma client for production
npx prisma generate

# Create database migration (if using Prisma Migrate)
npx prisma migrate dev --name init

# Deploy database schema
npx prisma db push
```

### Production Environment Checklist
1. ✅ Update `NEXTAUTH_URL` to production domain
2. ✅ Generate strong `NEXTAUTH_SECRET` (32+ characters)
3. ✅ Configure Google OAuth for production domain  
4. ✅ Setup production database (Vercel Postgres recommended)
5. ✅ Enable HTTPS (automatic with Vercel)
6. ✅ Test authentication flows after deployment

### Database Migration
```bash
# For production deployment
npx prisma migrate deploy

# Or for schema-only updates
npx prisma db push
```

## Troubleshooting

### Common Issues
1. **Google OAuth not working**: Check redirect URIs and credentials
2. **Database errors**: Ensure Prisma client is generated
3. **Session issues**: Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
4. **TypeScript errors**: Check type definitions in `types/next-auth.d.ts`

### Vercel-Specific Issues
1. **Build failures**: Check environment variables are set correctly
2. **Database connection**: Ensure DATABASE_URL includes `sslmode=require`
3. **NextAuth errors**: Verify `NEXTAUTH_URL` matches your Vercel domain
4. **Function timeouts**: API routes may need optimization for serverless

### Debug Mode
Enable NextAuth.js debugging:
```env
NEXTAUTH_DEBUG=true
NODE_ENV=development
```

## File Structure
```
app/
  api/
    auth/
      [...nextauth]/route.ts     # NextAuth configuration
      register/route.ts          # User registration
    user/
      profile/route.ts           # Profile management
  auth/
    signin/page.tsx             # Sign in page
    signup/page.tsx             # Sign up page
  profile/page.tsx              # User profile
components/
  AuthProvider.tsx              # Session provider
  Navbar.tsx                    # Updated with auth
lib/
  prisma.ts                     # Prisma client
  types.ts                      # Type definitions
prisma/
  schema.prisma                 # Database schema
types/
  next-auth.d.ts               # NextAuth types
```

## Next Steps
1. Add email verification
2. Implement password reset
3. Add user roles and permissions
4. Create admin dashboard
5. Add social login providers (GitHub, Discord, etc.)
6. Implement rate limiting
7. Add audit logging
