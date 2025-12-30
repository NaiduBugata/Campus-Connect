# 🚀 Render Deployment - Quick Start Guide

## ✅ Prerequisites
- GitHub account with Campus-Connect repository
- Render account (free) - [Sign up here](https://render.com)
- MongoDB Atlas database (already configured)
- Webpushr account credentials

---

## 📋 Step-by-Step Deployment

### 1️⃣ Deploy Backend on Render

#### A. Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub account"** (if not already connected)
4. Select repository: **Campus-Connect**

#### B. Configure Service
Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `campus-connect-backend` |
| **Region** | Oregon (US West) or nearest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

#### C. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these **10 variables**:

```plaintext
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://campusadmin:campusadmin@cluster0.tbwgttz.mongodb.net/campusdb?retryWrites=true&w=majority
JWT_SECRET=3d7a9039b7365478197b0f0d97f4d0de349f5996d1afdb6bc63de07649fa738b
JWT_EXPIRE=7d
FRONTEND_URL=https://campus-connect-cyan-seven.vercel.app
CLIENT_URL=https://campus-connect-cyan-seven.vercel.app
WEBPUSHR_PUBLIC_KEY=BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
WEBPUSHR_AUTH_TOKEN=117317
WEBPUSHR_REST_API_KEY=9a3985715a5e2089b2ab0a8c2e1fbef8
```

#### D. Create Service
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll see: **"Your service is live 🎉"**
4. **Copy your backend URL** (e.g., `https://campus-connect-backend.onrender.com`)

---

### 2️⃣ Update Frontend on Vercel

#### A. Set Backend URL
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **campus-connect-cyan-seven** project
3. Click **Settings** → **Environment Variables**
4. Find `VITE_API_URL` or add new:
   ```
   Name: VITE_API_URL
   Value: https://campus-connect-backend.onrender.com/api
   ```
   ⚠️ Replace with YOUR actual Render URL!
5. Select **Production, Preview, Development**
6. Click **Save**

#### B. Redeploy Frontend
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait ~2 minutes

---

### 3️⃣ Verify Deployment

#### Test Backend Health
Open in browser:
```
https://campus-connect-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T...",
  "version": "2.1.0-auth-fixed",
  "service": "Campus Connect API"
}
```

#### Test Database Connection
```
https://campus-connect-backend.onrender.com/api/db-test
```

**Expected Response:**
```json
{
  "status": "MongoDB Connected",
  "database": "campusdb",
  "dbState": 1
}
```

#### Test Frontend
1. Open: `https://campus-connect-cyan-seven.vercel.app`
2. Go to **Student Dashboard**
3. Click **"Subscribe to Notifications"**
4. Allow browser permission
5. Should see: ✅ **"Successfully subscribed to notifications!"**

---

## 🎯 Important Notes

### ⚠️ Render Free Tier Limitations
- **Sleeps after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free (sufficient for 1 service)
- Automatic deploys on git push

### 💡 To Prevent Sleep (Optional)
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 10 minutes:
```
URL to monitor: https://campus-connect-backend.onrender.com/api/health
Check interval: 10 minutes
```

### 🔄 Auto-Deploy
Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will automatically deploy! 🚀
```

---

## 🔍 Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Click on **campus-connect-backend**
3. Click **"Logs"** tab
4. See real-time server logs

### Check Build Status
- **Events** tab shows deployment history
- **Metrics** tab shows resource usage (CPU, Memory)

---

## 🐛 Troubleshooting

### Issue: "Service Failed to Start"
**Solution:**
1. Check **Logs** tab for errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB URI is correct
4. Check Start Command is `npm start`

### Issue: "502 Bad Gateway"
**Solution:**
1. Service might be sleeping (Render free tier)
2. Wait 30 seconds and refresh
3. Check Logs for crashes

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check MongoDB URI in environment variables
3. Ensure database user credentials are correct

### Issue: CORS errors on frontend
**Solution:**
1. Verify `FRONTEND_URL` and `CLIENT_URL` in Render environment variables
2. Must match exact Vercel frontend URL
3. Redeploy backend after changing

### Issue: Notifications not sending
**Solution:**
1. Check Webpushr credentials in Render environment variables
2. Test API endpoint: `POST /api/notifications` with admin token
3. Check Webpushr dashboard for delivery status

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] Backend service created with `backend` root directory
- [ ] All 10 environment variables added
- [ ] Backend deployed successfully (green checkmark)
- [ ] Backend URL copied
- [ ] Vercel `VITE_API_URL` updated with Render backend URL
- [ ] Frontend redeployed on Vercel
- [ ] `/api/health` endpoint returns 200 OK
- [ ] `/api/db-test` shows MongoDB connected
- [ ] Frontend can subscribe to notifications
- [ ] Admin login works
- [ ] Can create notifications from admin panel

---

## 🎉 Success!

Your Campus Connect app is now live!

**Backend:** `https://campus-connect-backend.onrender.com`  
**Frontend:** `https://campus-connect-cyan-seven.vercel.app`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Webpushr Dashboard](https://app.webpushr.com)

---

**Last Updated:** December 30, 2025  
**Commit:** a6a9b26  
**Status:** Ready to deploy! 🚀
