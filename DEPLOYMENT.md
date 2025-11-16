# Deployment Guide for MemeForge

## Quick Start - Deploy to Vercel

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: MemeForge v1.0"
```

2. Add your GitHub repository:
```bash
git remote add origin https://github.com/m2protocol/memeforge.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., "memeforge-db")
6. Select region (choose closest to your users)
7. Click "Create"

### Step 3: Run Database Schema

1. In Vercel Postgres dashboard, go to "Query" tab
2. Copy the entire content from `lib/db/schema.sql`
3. Paste and click "Execute"
4. Verify tables are created successfully

### Step 4: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (m2protocol/memeforge)
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add these variables:

   ```
   OPENAI_API_KEY=your-openai-api-key-here
   JWT_SECRET=your-random-secret-key-here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **IMPORTANT**: The Postgres variables will be automatically added when you connect the database!

6. Connect Postgres Database:
   - In the Environment Variables section, find "Postgres" option
   - Click "Connect Store"
   - Select your created database
   - This will automatically add all required Postgres environment variables

7. Click "Deploy"

### Step 5: Verify Deployment

1. Wait for deployment to complete (usually 1-2 minutes)
2. Click on the deployment URL
3. Test the following:
   - Home page loads correctly
   - Can register new account
   - Can login
   - Can generate a meme (test your OpenAI API key)
   - Community page works
   - Dashboard works

## Environment Variables Explained

### Required Variables

- `OPENAI_API_KEY`: Your OpenAI API key for DALL-E 3
  - Get it from: https://platform.openai.com/api-keys
  - Required for image generation

- `JWT_SECRET`: Secret key for JWT token encryption
  - Generate a random string (32+ characters)
  - NEVER share this publicly
  - Use different secrets for dev/production

### Auto-Generated (by Vercel Postgres)

- `POSTGRES_URL`: Main connection string
- `POSTGRES_PRISMA_URL`: Prisma-compatible URL
- `POSTGRES_URL_NON_POOLING`: Non-pooling connection
- `POSTGRES_USER`: Database user
- `POSTGRES_HOST`: Database host
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DATABASE`: Database name

### Optional

- `NEXT_PUBLIC_APP_URL`: Your app's public URL
  - Development: http://localhost:3000
  - Production: https://your-app.vercel.app

## Post-Deployment Checklist

- [ ] Home page loads correctly
- [ ] Logo displays properly
- [ ] Registration works
- [ ] Login works
- [ ] Generate page works (test with a simple prompt)
- [ ] Generated images display correctly
- [ ] Community gallery works
- [ ] Dashboard displays user stats
- [ ] Rate limiting works (5 for guests, 50 for registered)
- [ ] Public/private meme toggle works
- [ ] Delete meme works

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed":
1. Verify all Postgres env variables are set
2. Check database is in same region as deployment
3. Try re-deploying

### OpenAI API Errors

If generation fails:
1. Verify `OPENAI_API_KEY` is correct
2. Check your OpenAI account has credits
3. Test the key with OpenAI Playground

### Build Failures

If build fails:
1. Check build logs in Vercel
2. Verify all dependencies are in package.json
3. Try building locally first: `npm run build`

### Image Not Loading

If logo doesn't show:
1. Verify `public/logos/logo-horizontal.png` exists
2. Check file is committed to git
3. Clear browser cache

## Custom Domain (Optional)

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_APP_URL` environment variable

## Monitoring & Maintenance

### Check Usage

- Monitor OpenAI API usage: https://platform.openai.com/usage
- Monitor Vercel analytics: Project → Analytics
- Check database storage: Storage → Your DB → Usage

### Database Maintenance

Run these queries periodically to clean up:

```sql
-- Delete old guest generations (older than 30 days)
DELETE FROM generations
WHERE user_id IS NULL
AND created_at < NOW() - INTERVAL '30 days';

-- Find top memes
SELECT prompt, likes, views
FROM memes
WHERE is_public = true
ORDER BY likes DESC
LIMIT 10;
```

## Scaling Considerations

### If you get high traffic:

1. **Database**: Upgrade Vercel Postgres plan
2. **API Limits**: Monitor OpenAI rate limits
3. **Rate Limiting**: Adjust daily limits if needed
4. **Caching**: Consider implementing Redis for rate limiting

## Support

If you need help:
- Check Vercel logs: Project → Deployments → View Logs
- Check GitHub issues: https://github.com/m2protocol/memeforge/issues
- Vercel docs: https://vercel.com/docs

---

Happy deploying! 🚀
