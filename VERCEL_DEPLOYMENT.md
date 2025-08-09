# Vercel Deployment Guide for Miko

## Quick Start Deployment

### 1. Pre-deployment Setup

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login to Vercel:**
```bash
vercel login
```

### 2. Environment Variables (Critical!)

In your Vercel dashboard, add these environment variables:

#### Required Variables:
```env
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-chars
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 3. Generate NEXTAUTH_SECRET

**Option A: OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option B: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Online Generator**
Visit: https://generate-secret.vercel.app/32

### 4. Database Setup

#### Option A: Vercel Postgres (Easiest)
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy the connection string to `DATABASE_URL`
4. Run migration:
```bash
npx prisma db push
```

#### Option B: Supabase (Free Tier)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?sslmode=require`

#### Option C: PlanetScale (Serverless MySQL)
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update `prisma/schema.prisma` to use MySQL instead of SQLite

### 5. Google OAuth Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project:**
   - Create new project or use existing

3. **Enable APIs:**
   - Navigate to "APIs & Services" → "Library"
   - Search and enable "Google+ API" or "Google Identity"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"

5. **Configure Redirect URIs:**
   ```
   Authorized JavaScript origins:
   https://your-app-name.vercel.app
   
   Authorized redirect URIs:
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

6. **Copy Credentials:**
   - Copy Client ID and Client Secret
   - Add to Vercel environment variables

### 6. Deploy to Vercel

**Option A: Git Integration (Recommended)**
1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Vercel will auto-deploy on push

**Option B: CLI Deployment**
```bash
# From your project directory
vercel

# Follow prompts and deploy
```

### 7. Post-Deployment Checklist

1. **Test Authentication:**
   - Try Google OAuth login
   - Try email/password registration
   - Test profile page access

2. **Database Verification:**
   ```bash
   # Check if tables exist
   npx prisma studio
   ```

3. **Environment Check:**
   ```bash
   # Verify all env vars are set in Vercel dashboard
   ```

## Troubleshooting

### Common Deployment Issues:

#### 1. Build Errors
```bash
# If build fails due to TypeScript errors
npm run build

# Fix any TypeScript issues locally first
```

#### 2. Database Connection Issues
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Test connection string locally first
- Check database is accessible from external connections

#### 3. NextAuth Issues
- Verify `NEXTAUTH_URL` exactly matches your Vercel domain (no trailing slash)
- Ensure `NEXTAUTH_SECRET` is set and secure
- Check Google OAuth redirect URIs match production domain

#### 4. API Route Timeouts
- Vercel has 10s timeout for hobby plan
- Optimize database queries
- Consider upgrading to Pro plan for 60s timeouts

### Environment Variables Template

Copy this to your Vercel dashboard:

```env
# Required for Authentication
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-32-char-secret

# Database (Choose one)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Debug mode (remove in production)
NEXTAUTH_DEBUG=false
```

### Performance Optimization

1. **Database Optimization:**
   ```prisma
   // Add indexes for better performance
   @@index([email])
   @@index([createdAt])
   ```

2. **API Route Optimization:**
   ```typescript
   // Use connection pooling
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
   })
   ```

### Security Best Practices

1. **Environment Variables:**
   - Never commit `.env.local` to git
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security:**
   - Use connection pooling
   - Enable SSL mode
   - Regular backups

3. **Authentication Security:**
   - HTTPS only (automatic with Vercel)
   - Secure session configuration
   - Regular dependency updates

## Success Checklist ✅

- [ ] Environment variables set in Vercel
- [ ] Database created and connected
- [ ] Google OAuth configured for production
- [ ] Application deployed successfully
- [ ] Authentication flows tested
- [ ] Database tables created
- [ ] Profile page accessible
- [ ] Sign in/out working
- [ ] Google OAuth working

Your Miko app should now be live at: `https://your-app-name.vercel.app`
