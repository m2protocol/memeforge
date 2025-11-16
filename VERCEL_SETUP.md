# Vercel Setup - Step by Step

## 🚀 Deploy MemeForge to Vercel

### Step 1: Go to Vercel
1. Open: https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"

### Step 2: Import Repository
1. Find "m2protocol/memeforge" in the list
2. Click "Import"

### Step 3: Configure Project
Leave everything as default:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: .next

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

**OPENAI_API_KEY**
```
your-openai-api-key-here
```
(Use your actual OpenAI API key from https://platform.openai.com/api-keys)

**JWT_SECRET**
```
memeforge-production-secret-2025-v1-crypto
```

### Step 5: Create Postgres Database

BEFORE clicking "Deploy", set up the database:

1. In Vercel dashboard, go to "Storage" tab (top menu)
2. Click "Create Database"
3. Select "Postgres"
4. Name it: `memeforge-db`
5. Select region: Choose closest to you
6. Click "Create"

### Step 6: Connect Database to Project

1. Go to your project settings
2. Click "Storage" tab
3. Click "Connect Store"
4. Select your `memeforge-db`
5. This will automatically add all Postgres environment variables:
   - POSTGRES_URL
   - POSTGRES_PRISMA_URL
   - POSTGRES_URL_NON_POOLING
   - POSTGRES_USER
   - POSTGRES_HOST
   - POSTGRES_PASSWORD
   - POSTGRES_DATABASE

### Step 7: Run Database Schema

1. In Vercel Postgres dashboard, go to "Query" tab
2. Copy the entire content from `lib/db/schema.sql` in your project
3. Paste it in the query editor
4. Click "Execute"
5. You should see: "Successfully created tables"

### Step 8: Deploy!

1. Go back to your project deployment settings
2. Click "Deploy"
3. Wait 2-3 minutes
4. Your app will be live! 🎉

### Step 9: Get Your URL

Vercel will give you a URL like:
```
https://memeforge-xyz.vercel.app
```

### Step 10: Update Environment Variable (Optional)

Add one more environment variable:

**NEXT_PUBLIC_APP_URL**
```
https://your-actual-vercel-url.vercel.app
```

Then redeploy (it will auto-deploy when you add variables).

---

## ✅ Verification Checklist

After deployment, test:
- [ ] Homepage loads
- [ ] Can register new account
- [ ] Can login
- [ ] Can generate a meme (uses your OpenAI key)
- [ ] Meme appears in dashboard
- [ ] Can make meme public
- [ ] Appears in community gallery

---

## 🐛 Troubleshooting

### Build fails
- Check the build logs in Vercel
- Verify all environment variables are set
- Make sure Postgres database is connected

### Database connection fails
- Make sure you ran the schema.sql in the Query tab
- Verify database is in the same region as deployment
- Check all POSTGRES_* variables are set

### Generation fails
- Verify OPENAI_API_KEY is correct
- Check you have credits in OpenAI account
- Look at Function Logs in Vercel

### Images don't load
- Check NEXT_PUBLIC_APP_URL is set correctly
- Verify OpenAI DALL-E is returning URLs

---

## 🎉 You're Done!

Your MemeForge is now live and ready to use!

Share it with the crypto community! 🚀
