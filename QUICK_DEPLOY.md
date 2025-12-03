# Quick Start: Deploy on Netlify in 5 Minutes

## What We've Set Up

✅ `netlify.toml` - Build configuration  
✅ `netlify/functions/api.js` - Serverless backend wrapper  
✅ Environment variables guide

## Deploy Now!

### 1. Commit and Push

```bash
git add .
git commit -m "Setup Netlify deployment"
git push origin main
```

### 2. Go to netlify.com

- Click **"Add new site"** → **"Import an existing project"**
- Select GitHub → Choose your repository
- Click **Deploy**

### 3. Add Environment Variables (IMPORTANT!)

In Netlify dashboard → **Site settings** → **Build & deploy** → **Environment**:

```
DATABASE_URL = postgresql://...your-connection-string...
VITE_API_URL = /.netlify/functions/api
NODE_ENV = production
```

### 4. Done! 🎉

Your site will be live at: `https://[random-name].netlify.app`

---

**Need details?** Read `NETLIFY_DEPLOYMENT.md`
