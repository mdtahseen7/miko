# Profile Picture Upload Implementation

## Current Implementation (Development)
- Stores images as base64 in database (SQLite)
- Works for development and testing
- Not recommended for production due to database size

## Production Recommendations

### 1. Cloudinary (Recommended)
```bash
npm install cloudinary
```

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'miko_avatars') // Create preset in Cloudinary

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  return response.json()
}
```

### 2. Vercel Blob Storage
```bash
npm install @vercel/blob
```

```typescript
// api/user/upload-avatar/route.ts
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const file = form.get('file') as File
  
  const blob = await put(`avatars/${user.id}-${Date.now()}.jpg`, file, {
    access: 'public',
  })
  
  // Store blob.url in database
}
```

### 3. Supabase Storage
```bash
npm install @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export const uploadAvatar = async (file: File, userId: string) => {
  const fileName = `avatar-${userId}-${Date.now()}`
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file)
    
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
    
  return publicUrl
}
```

## Environment Variables for Production

Add to your `.env.local` or Vercel environment:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Features Implemented

### UI Components
- ✅ Drag and drop upload area
- ✅ File validation (type, size)
- ✅ Loading states
- ✅ Preview with remove option
- ✅ Fallback avatar with initials

### Security Features
- ✅ File type validation (images only)
- ✅ File size limits (5MB)
- ✅ Authentication required
- ✅ User can only update own avatar

### User Experience
- ✅ Immediate preview after upload
- ✅ Smooth animations and transitions
- ✅ Clear upload instructions
- ✅ Error handling with user feedback

## Migration Path

To switch from base64 to cloud storage:

1. **Choose a provider** (Cloudinary recommended)
2. **Update the upload API** to use cloud storage
3. **Migrate existing avatars** (if any)
4. **Update image URLs** in database
5. **Test thoroughly** before deploying

The current implementation will work perfectly for development and can be easily upgraded for production!
