# Backend Deployment Guide

## Deploy to Render (Recommended for Backend)

### Steps:

1. **Sign up/Login to Render**: https://render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `NaiduBugata/Campus-Connect`
   - Configure:
     - **Name**: campus-connect-api (or your choice)
     - **Environment**: Node
     - **Region**: Choose closest to your users
     - **Branch**: main
     - **Root Directory**: backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-secret-key>
   JWT_EXPIRE=7d
   FRONTEND_URL=<your-frontend-vercel-url>
   CLIENT_URL=<your-frontend-vercel-url>
   WEBPUSHR_PUBLIC_KEY=683978b545bedb748e1a5a1e5fdb0a79
   WEBPUSHR_AUTH_TOKEN=117308
   ```

4. **Create MongoDB Atlas Database** (Free):
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Create database user
   - Whitelist all IPs (0.0.0.0/0) for Render
   - Get connection string and add to MONGODB_URI

5. **Deploy**: Click "Create Web Service"

6. **Get Backend URL**: After deployment, copy your backend URL
   - Example: `https://campus-connect-api.onrender.com`

---

## Deploy to Vercel (Alternative)

### Steps:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd backend
   vercel
   ```

3. Set environment variables in Vercel dashboard

**Note**: Render is recommended for backend as it offers better support for long-running processes (cron jobs).

---

## After Backend Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Update Frontend**:
   - Update `frontend/.env` with your backend URL:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```

3. **Create Admin Account**:
   - The backend will auto-create admin on first run
   - Or use the register endpoint to create one

---

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create free cluster (M0)
3. Database Access → Add user (username/password)
4. Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/campus-connect?retryWrites=true&w=majority`

---

## Environment Variables Explained

- **MONGODB_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: Random secret key (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **FRONTEND_URL**: Your Vercel frontend URL
- **WEBPUSHR_PUBLIC_KEY**: Your Webpushr public key
- **WEBPUSHR_AUTH_TOKEN**: Your Webpushr auth token

---

## Troubleshooting

### Backend not starting:
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check Render logs for errors

### CORS errors:
- Ensure FRONTEND_URL matches your actual frontend URL
- Check CORS configuration in `src/app.js`

### Cron job not running:
- Verify NODE_ENV is set to production
- Check Render logs for cron scheduler messages
