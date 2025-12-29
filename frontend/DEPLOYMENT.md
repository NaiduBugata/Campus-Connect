# Vercel Deployment Guide for Campus Connect Frontend

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Backend API deployed and accessible

## Deployment Steps

### 1. Prepare Environment Variables
Before deploying, make sure you have your backend API URL ready.

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository: `NaiduBugata/Campus-Connect`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

5. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure Environment Variables in Vercel
After deployment, go to:
1. Project Settings → Environment Variables
2. Add the following:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

### 4. Update API Configuration
Make sure your frontend API calls use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 5. Redeploy
After adding environment variables, trigger a new deployment from Vercel dashboard or run:
```bash
vercel --prod
```

## Important Notes

### CORS Configuration
Make sure your backend allows requests from your Vercel domain:
```javascript
// In backend/src/app.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
};
```

### Backend Deployment
Your backend needs to be deployed separately. Recommended platforms:
- Render (https://render.com)
- Railway (https://railway.app)
- Heroku (https://heroku.com)
- DigitalOcean (https://digitalocean.com)

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check if all dependencies are in package.json
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### API Calls Failing
- Verify VITE_API_URL is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

### 404 Errors on Refresh
- The `vercel.json` file handles this with rewrites
- Make sure vercel.json is in the frontend root

## Post-Deployment Checklist
- ✅ Frontend loads successfully
- ✅ API calls work correctly
- ✅ Login functionality works
- ✅ Environment variables are set
- ✅ CORS is configured properly
- ✅ All routes work (no 404s on refresh)

## Useful Commands
```bash
# View deployment logs
vercel logs

# List all deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]

# Check project info
vercel inspect
```

## Support
For Vercel-specific issues, check:
- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
