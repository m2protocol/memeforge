# Quick Start Guide

## For Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
OPENAI_API_KEY=your-openai-api-key-here
JWT_SECRET=your-random-secret-string-here
```

**Note**: For local development, you can test WITHOUT a database first. The app will work for testing the UI, but database features (auth, saving memes) will not work until you set up Postgres.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Test Features

Without database (UI testing):
- ✅ Home page
- ✅ Generate page UI
- ✅ Community page UI
- ✅ Login/Register forms
- ❌ Actual generation (needs OpenAI key)
- ❌ Auth (needs database)
- ❌ Saving memes (needs database)

With OpenAI key only:
- ✅ Everything above
- ✅ Generate memes (as guest, stored in localStorage)
- ❌ Auth
- ❌ Saving to database

With database + OpenAI key:
- ✅ Full functionality

## For Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy to Vercel:

1. Push to GitHub:
```bash
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add Vercel Postgres database
6. Add environment variables
7. Deploy!

## Testing the Generator

### Test Prompts (without OpenAI key):
You can test the UI with these example prompts:
- "Pepe celebrating with rocket ship going to the moon"
- "Wojak panicking while watching red candles"
- "Happy frog holding a giant diamond"

### With OpenAI Key:
Actually generate images! The system will:
1. Clean your prompt
2. Enhance it with cartoon style rules
3. Generate via DALL-E 3
4. Return consistent cartoon crypto memes

## Project Structure

```
memeforge/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── generate/     # Image generation
│   │   ├── community/    # Community features
│   │   └── dashboard/    # User dashboard
│   ├── (pages)/          # Page components
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                   # Core functionality
│   ├── ai/               # AI/DALL-E integration
│   ├── auth/             # Authentication logic
│   └── db/               # Database helpers
├── public/               # Static files
│   └── logos/            # Brand assets
└── ...config files
```

## Common Issues

### Issue: "Module not found"
**Solution**: Run `npm install`

### Issue: Generation fails
**Solution**: Check your OpenAI API key is set correctly in `.env.local`

### Issue: Auth doesn't work
**Solution**: You need to set up Postgres database first (see DEPLOYMENT.md)

### Issue: Logo doesn't show
**Solution**: Make sure `public/logos/logo-horizontal.png` exists

### Issue: Styles look broken
**Solution**:
1. Delete `.next` folder
2. Run `npm run dev` again

## Development Tips

### Hot Reload
The app supports hot reload. Edit any file and see changes instantly.

### Testing Different Styles
In the Generate page, try different style options:
- General Crypto (default)
- Pepe Style
- Wojak Style
- Modern Cartoon

### Rate Limiting (Local)
Rate limiting is stored in localStorage for local testing:
- Clear localStorage to reset your daily count
- Default: 5 generations/day (guest mode)

### Database Development
For local database testing, you can use:
- Vercel Postgres (recommended)
- Local PostgreSQL
- Supabase
- Any Postgres provider

Just update the `POSTGRES_URL` in `.env.local`

## Next Steps

1. **Deploy to production**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Customize branding**: Update colors in `tailwind.config.ts`
3. **Add features**: Check [README.md](README.md) roadmap
4. **Join community**: Share your instance with the crypto community!

## Need Help?

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Open an issue on GitHub
- Check Vercel/Next.js documentation

---

Happy meme forging! 🚀🎨
