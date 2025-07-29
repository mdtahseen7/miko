# 🗄️ Database Setup Guide - Supabase (Recommended)

## Why Supabase?
- ✅ **Free tier**: 500MB storage, 2 projects
- ✅ **PostgreSQL** (same as Prisma setup)
- ✅ **Reliable** and fast
- ✅ **Easy setup** (5 minutes)
- ✅ **Great dashboard** for viewing data

## Step-by-Step Setup

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 2. Create New Project
1. Click "New Project"
2. **Organization**: Choose your personal org
3. **Name**: `nova-streaming`
4. **Database Password**: Create a strong password (save it!)
5. **Region**: Choose closest to your users
6. Click "Create new project"

*Wait 2-3 minutes for project to be ready*

### 3. Get Database Connection String
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** → **URI**
3. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the password you created

### 4. Update Your Environment
Add this to your Vercel environment variables:
```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

# 🗄️ Alternative: PlanetScale (MySQL)

## If you prefer MySQL:

### 1. Create PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create database: `nova-streaming`

### 2. Get Connection String
1. Go to your database dashboard
2. Click "Connect"
3. Select "Prisma"
4. Copy the DATABASE_URL

### 3. Update Prisma Schema
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

---

# 🗄️ Alternative: Railway (Simple)

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 2. Create PostgreSQL Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Copy the DATABASE_URL from the dashboard

---

# 🚀 Quick Deployment with Supabase

Once you have your Supabase connection string:

1. **Update Vercel Environment Variables**:
   ```bash
   DATABASE_URL=your-supabase-connection-string-here
   NEXTAUTH_SECRET=vpIs87Z4ZIv32rG/9D+351MY+yOchUcw5G6D4w/COWQ=
   GOOGLE_CLIENT_ID=515103855979-g7qq42q37nrig8b445cla85n3d2nfvm3.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   NODE_ENV=production
   ```

2. **Deploy to Vercel** (will automatically run database migration)

3. **Test your app** - everything should work perfectly!

## Troubleshooting

### Issue: "Can't connect to database"
- Double-check your connection string
- Make sure password is correct
- Verify the database is running in Supabase dashboard

### Issue: "Tables don't exist"
- Prisma will automatically create tables on first deploy
- Check Supabase dashboard → Table Editor to see your tables

### Issue: "SSL connection error"
- Supabase requires SSL (this is automatic with our setup)
- Make sure you're using the full connection string

## Next Steps

After setting up your database:
1. Get your connection string
2. Add it to Vercel environment variables
3. Deploy your app
4. Your Nova streaming app will be live! 🎉

**Recommended**: Use Supabase for the easiest setup experience.
