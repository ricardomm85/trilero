# Supabase Project Reactivation Guide

When a Supabase project is suspended and reactivated, the project URL changes. You must update the following configurations:

## 1. Google Cloud Console

Update the authorized redirect URI in your OAuth 2.0 Client:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs** with the new Supabase URL:
   ```
   https://YOUR_NEW_PROJECT_ID.supabase.co/auth/v1/callback
   ```

## 2. Vercel Environment Variables

Update the environment variables in your Vercel project:

1. Go to your project in [Vercel Dashboard](https://vercel.com/)
2. Navigate to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_SUPABASE_URL` with the new Supabase URL
4. Redeploy the application

## 3. Local Development

Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
```

## 4. Supabase Dashboard

Verify the redirect URLs in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **URL Configuration**
3. Ensure these URLs are in **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-production-domain.vercel.app/auth/callback` (for production)

## Checklist

- [ ] Google Cloud Console - Update authorized redirect URI
- [ ] Vercel - Update `NEXT_PUBLIC_SUPABASE_URL` environment variable
- [ ] Vercel - Redeploy application
- [ ] Local - Update `.env.local` with new Supabase URL
- [ ] Supabase - Verify redirect URLs are configured
