# 🔧 Google OAuth Configuration Fix

## Issue: Google Sign-In Redirects to Login Page

### Root Cause
Your app is running on `localhost:3003` but Google OAuth is configured for other ports, causing redirect URI mismatches.

### Quick Fix Steps

#### 1. Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, add ALL these:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google
   http://localhost:3003/api/auth/callback/google
   ```
5. Click **Save**

#### 2. Verify Current Configuration
Your current app is on: **http://localhost:3003**
Required redirect URI: `http://localhost:3003/api/auth/callback/google`

#### 3. Test the Fix
1. Clear your browser cookies for `localhost:3003`
2. Try Google sign-in again
3. Check the terminal for any remaining errors

### Common "Something Went Wrong" Errors

#### A. Google OAuth Issues
- **Missing redirect URI**: Add `http://localhost:3003/api/auth/callback/google`
- **Invalid credentials**: Double-check Client ID and Secret
- **API not enabled**: Enable Google+ API in Google Cloud Console

#### B. Database Issues
- **Database not accessible**: Run `npx prisma db push`
- **Missing tables**: Check if User, Account, Session tables exist
- **Connection error**: Verify DATABASE_URL in .env.local

#### C. Environment Issues
- **Wrong NEXTAUTH_URL**: Should be `http://localhost:3003`
- **Missing NEXTAUTH_SECRET**: Must be set and secure
- **Port mismatch**: App vs environment variable

### Quick Debug Steps
```bash
# 1. Check database
npx prisma studio

# 2. Reset database if needed
npx prisma db push --force-reset

# 3. Verify environment
echo $NEXTAUTH_URL
```

### Alternative: Force Port 3000
If you prefer to use port 3000, kill the process using it:

```bash
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <process_id> /F

# Restart your app
npm run dev
```

### Debug Information
I've added debug mode to your `.env.local`:
- `NEXTAUTH_DEBUG=true`
- Enhanced error logging
- Better cookie configuration
- More detailed OAuth flow logging

### Expected Behavior After Fix
1. Click "Sign in with Google"
2. Google OAuth popup opens
3. Select your Google account
4. Grant permissions
5. Redirect back to your app
6. Automatically signed in and redirected to profile page

### Still Having Issues?
If the problem persists, check:
1. **Browser Console** for JavaScript errors
2. **Network Tab** for failed requests
3. **Terminal Output** for NextAuth debug logs
4. **Google Cloud Console** for API quotas/limits

The main error `OAuthAccountNotLinked` suggests the OAuth flow is starting but failing during the callback phase due to the redirect URI mismatch.
