# 🚀 Miko Streaming App - Vercel Deployment Guide

## Prerequisites
1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Cloud Database** - We'll set up a PostgreSQL database

## Step 1: Prepare for Production Database

Since SQLite doesn't work on Vercel, we need to use a cloud database. I recommend **Supabase** (free PostgreSQL):

### 1.1 Set up Supabase Database (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create a new project: "miko-streaming"
4. Set a strong database password
5. Copy the connection string from Settings → Database → Connection string → URI
6. Replace `[YOUR-PASSWORD]` with your actual password

**Alternative options:**
- **PlanetScale**: [planetscale.com](https://planetscale.com) (MySQL)
- **Railway**: [railway.app](https://railway.app) (PostgreSQL)

See `DATABASE_SETUP.md` for detailed instructions on all options.

### 1.2 Update Prisma Schema
Update your `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Miko streaming app"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it "miko-streaming" or similar
4. Don't initialize with README (since you already have files)
5. Click "Create repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/miko-streaming.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

### 3.2 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://username:password@hostname/database
NEXTAUTH_SECRET=vpIs87Z4ZIv32rG/9D+351MY+yOchUcw5G6D4w/COWQ=
GOOGLE_CLIENT_ID=515103855979-g7qq42q37nrig8b445cla85n3d2nfvm3.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NODE_ENV=production
```

**Note:** NEXTAUTH_URL will be automatically set by Vercel.

## Step 4: Update Google OAuth

### 4.1 Add Production URLs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
5. Add these Authorized JavaScript origins:
   ```
   https://your-app-name.vercel.app
   ```

## Step 5: Database Migration

### 5.1 Generate Prisma Client for PostgreSQL
After deploying, Vercel will automatically run:
```bash
npx prisma generate
npx prisma db push
```

If you need to run migrations manually:
```bash
npx prisma migrate deploy
```

## Step 6: Test Your Deployment

1. **Visit your app** at `https://your-app-name.vercel.app`
2. **Test authentication** - sign up and sign in
3. **Test profile picture upload**
4. **Verify all features work**

## Common Issues & Solutions

### Issue 1: Database Connection Error
- Make sure your DATABASE_URL is correct
- Ensure your Neon database is running
- Check Vercel function logs

### Issue 2: Google OAuth Not Working
- Verify redirect URIs in Google Cloud Console
- Make sure NEXTAUTH_URL is set correctly
- Check that your domain is added to authorized origins

### Issue 3: Profile Pictures Not Saving
- This should work fine with our current setup
- Check Vercel function logs if issues persist

## Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Sign up works
- [ ] Sign in works
- [ ] Profile picture upload works
- [ ] All pages render correctly
- [ ] No console errors

## Performance Optimization

### Custom Domain (Optional)
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel dashboard → Settings → Domains
3. Add your custom domain
4. Update Google OAuth settings with new domain

### Database Optimization
- Monitor your Neon database usage
- Consider upgrading if you hit limits
- Set up database connection pooling if needed

## Security Notes

1. **Environment Variables**: Never commit sensitive data to GitHub
2. **HTTPS**: Vercel automatically provides SSL certificates
3. **CORS**: NextAuth handles CORS automatically
4. **Rate Limiting**: Consider adding rate limiting for auth endpoints

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test locally first before deploying

---

**Your Miko streaming app will be live at: `https://your-app-name.vercel.app`**

🎉 Congratulations on deploying your streaming app!
