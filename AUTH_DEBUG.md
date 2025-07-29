# Authentication Debug Guide

## Current Issues Troubleshooting

### 1. "Something Went Wrong" Error

This usually occurs due to one of these issues:

#### A. Google OAuth Redirect URI Mismatch
**Problem**: App is on `localhost:3003` but Google OAuth is configured for different port.

**Solution**: Add this to Google Cloud Console:
```
http://localhost:3003/api/auth/callback/google
```

#### B. Database Connection Issues
**Problem**: NextAuth can't connect to database or tables don't exist.

**Check**: 
```bash
# Verify database exists
ls -la dev.db

# Check Prisma connection
npx prisma studio
```

#### C. Environment Variables
**Problem**: Missing or incorrect environment variables.

**Verify your `.env.local`**:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="vpIs87Z4ZIv32rG/9D+351MY+yOchUcw5G6D4w/COWQ="
GOOGLE_CLIENT_ID="515103855979-g7qq42q37nrig8b445cla85n3d2nfvm3.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_DEBUG=true
NODE_ENV=development
```

### 2. Testing Steps

#### Step 1: Test Email/Password Authentication
1. Go to `/auth/signup`
2. Create a new account with email/password
3. Try to sign in with those credentials

#### Step 2: Test Google OAuth
1. Make sure redirect URI is added to Google Cloud Console
2. Clear browser cookies
3. Try Google sign-in

#### Step 3: Check Database
```bash
# See if user was created
npx prisma studio

# Check tables exist
sqlite3 dev.db ".tables"
```

### 3. Common Error Messages

| Error | Cause | Solution |
|-------|--------|----------|
| OAuthAccountNotLinked | Google account not linked to existing user | Create account with email first, then link Google |
| OAuthCallback | Redirect URI mismatch | Add correct URI to Google Cloud Console |
| Signin | Invalid credentials | Check email/password |
| Configuration | NextAuth setup issue | Check environment variables |

### 4. Force Fix Steps

If all else fails:

```bash
# 1. Stop the server
Ctrl+C

# 2. Clear Next.js cache
rm -rf .next

# 3. Reset database
npx prisma db push --force-reset

# 4. Restart server
npm run dev
```

### 5. Quick Test Account

Create a test account:
- Email: `test@example.com`
- Password: `password123`
- Name: `Test User`

This will help isolate if the issue is with Google OAuth or general authentication.

### 6. Error Debugging

I've created a custom error page at `/auth/error` that will show specific error codes and messages. Check there for detailed error information.

### 7. Terminal Debugging

Look for these patterns in your terminal:
- `[next-auth][error]` - NextAuth errors
- `POST /api/auth/signin` - Sign-in attempts
- `GET /api/auth/callback` - OAuth callback
- Database connection errors
- Prisma errors
