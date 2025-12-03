# Netlify Deployment Guide - Clinic Pulse

## Prerequisites

- Node.js 18+ installed
- A [Netlify account](https://netlify.com) (free tier available)
- GitHub account with your repository

## Step-by-Step Deployment

### 1. **Prepare Your Repository**

```bash
# Make sure all files are committed
git add .
git commit -m "Setup Netlify deployment"
git push origin main
```

### 2. **Connect to Netlify**

**Option A: Using Netlify UI (Easiest)**

1. Go to [netlify.com](https://netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize Netlify
4. Choose your `clinic-pulse` repository
5. Select **main** branch
6. Click **Deploy site**

**Option B: Using Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. **Configure Environment Variables**

1. In your Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
2. Add the following variables:

```
VITE_API_URL=/.netlify/functions/api
DATABASE_URL=postgresql://user:password@host/database
NODE_ENV=production
```

Replace the database credentials with your actual PostgreSQL connection string.

### 4. **Update Frontend API Configuration**

Your frontend should use the environment variable to call the backend:

In `project/src/lib/api.ts`, make sure you're using:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "/api";
```

### 5. **Deploy**

- Just push to your main branch - Netlify will automatically build and deploy!
- Every git push triggers a new deployment
- Preview deployments are created for pull requests

## File Structure After Setup

```
.
├── netlify.toml              ← Build configuration
├── netlify/
│   └── functions/
│       └── api.js            ← Serverless backend
├── project/                  ← React frontend
├── backend/                  ← Backend source code
└── package.json
```

## Environment Variables Needed

| Variable       | Value                             | Where                 |
| -------------- | --------------------------------- | --------------------- |
| `DATABASE_URL` | Your PostgreSQL connection string | Netlify Site Settings |
| `VITE_API_URL` | `/.netlify/functions/api`         | Netlify Site Settings |
| `NODE_ENV`     | `production`                      | Netlify Site Settings |

## Troubleshooting

### Build fails

- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `netlify.toml` paths are correct

### API calls fail

- Check that `VITE_API_URL` is set correctly
- Verify database connection string is valid
- Check function logs in Netlify dashboard

### Database connection errors

- Verify `DATABASE_URL` environment variable is set
- Ensure your database accepts connections from Netlify
- Check that database is running and accessible

## Next Steps

1. Push your code to GitHub
2. Follow "Option A" or "Option B" above to deploy
3. Test your deployed site at the Netlify URL
4. Configure custom domain (optional) in Site settings

---

Need help? Check [Netlify Docs](https://docs.netlify.com) or contact Netlify Support.
