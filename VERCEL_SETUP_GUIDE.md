# 🚀 Vercel Deployment Setup Guide

## ❌ Current Issue: "Failed to subscribe"

**Root Cause:** Frontend on Vercel is trying to connect to `http://localhost:5000/api` which doesn't exist in production.

---

## ✅ Solution: Configure Environment Variables on Vercel

### Step 1: Deploy Backend First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your backend repository or redeploy existing backend
3. Note your backend URL: `https://your-backend-name.vercel.app`

### Step 2: Set Backend Environment Variables

In your **Backend** Vercel project settings:

**Navigate to:** Project → Settings → Environment Variables

Add these variables:

```plaintext
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://campusadmin:campusadmin@cluster0.tbwgttz.mongodb.net/campusdb?retryWrites=true&w=majority
JWT_SECRET=3d7a9039b7365478197b0f0d97f4d0de349f5996d1afdb6bc63de07649fa738b
JWT_EXPIRE=7d
FRONTEND_URL=https://campus-connect-cyan-seven.vercel.app
CLIENT_URL=https://campus-connect-cyan-seven.vercel.app
WEBPUSHR_PUBLIC_KEY=BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
WEBPUSHR_AUTH_TOKEN=117317
WEBPUSHR_REST_API_KEY=9a3985715a5e2089b2ab0a8c2e1fbef8
```

**Important:** Make sure all variables are set for **Production**, **Preview**, and **Development** environments.

### Step 3: Set Frontend Environment Variables

In your **Frontend** Vercel project (campus-connect-cyan-seven):

**Navigate to:** Project → Settings → Environment Variables

Add these variables:

```plaintext
VITE_API_URL=https://your-backend-name.vercel.app/api
VITE_WEBPUSHR_PUBLIC_KEY=BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
```

**⚠️ CRITICAL:** Replace `https://your-backend-name.vercel.app` with your actual deployed backend URL!

### Step 4: Redeploy Frontend

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** → **Redeploy**

---

## 🔍 How to Find Your Backend URL

### Option 1: Check Backend Deployment
1. Go to Vercel Dashboard
2. Select your backend project
3. Click on the latest deployment
4. Copy the URL (e.g., `https://campus-connect-backend-xyz.vercel.app`)

### Option 2: Check Your Repository
- Look for previous deployment URLs in your Vercel project

---

## 🧪 Testing After Deployment

### 1. Check Environment Variables Loaded
Open browser console on `https://campus-connect-cyan-seven.vercel.app`:

```javascript
// In browser console
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Webpushr Key:', import.meta.env.VITE_WEBPUSHR_PUBLIC_KEY);
```

**Expected output:**
```
API URL: https://your-backend-name.vercel.app/api
Webpushr Key: BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
```

### 2. Test Backend Connectivity
Open: `https://your-backend-name.vercel.app/api/health`

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T...",
  "version": "2.1.0-auth-fixed",
  "service": "Campus Connect API"
}
```

### 3. Test Subscription
1. Visit `https://campus-connect-cyan-seven.vercel.app`
2. Click on Student Dashboard
3. Click "Subscribe to Notifications"
4. Allow browser permission
5. Should see: ✅ "Successfully subscribed to notifications!"

---

## 🛠️ Alternative: Quick Fix with Hardcoded URL (Not Recommended)

If you need an immediate fix, you can hardcode the backend URL temporarily:

**File:** `frontend/src/services/webpushr.js` (Line 77)

```javascript
// Change this:
const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscribers`, {

// To this:
const response = await fetch(`https://your-backend-name.vercel.app/api/subscribers`, {
```

**⚠️ WARNING:** This is NOT recommended! Use environment variables instead.

---

## 📋 Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured with correct backend URL
- [ ] FRONTEND_URL in backend matches actual frontend URL
- [ ] CLIENT_URL in backend matches actual frontend URL
- [ ] Frontend redeployed after setting environment variables
- [ ] Tested `/api/health` endpoint
- [ ] Tested subscription flow
- [ ] Webpushr notifications working

---

## 🐛 Common Issues

### Issue 1: CORS Error
**Error:** `Access to fetch at 'https://backend.vercel.app/api/subscribers' from origin 'https://frontend.vercel.app' has been blocked by CORS`

**Solution:** Make sure `FRONTEND_URL` and `CLIENT_URL` in backend environment variables match your exact frontend URL.

### Issue 2: 404 Not Found on /api/subscribers
**Error:** `POST https://backend.vercel.app/api/subscribers 404 (Not Found)`

**Solution:** Backend routes might not be configured for serverless. Check `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### Issue 3: Environment Variables Not Working
**Solution:**
1. Make sure variable names start with `VITE_` for frontend (Vite requirement)
2. Redeploy after adding variables
3. Clear build cache if needed

---

## 💡 Pro Tips

1. **Always use environment variables** - Never hardcode URLs
2. **Test locally first** - Make sure everything works on localhost
3. **Check Vercel logs** - Go to Deployments → Click deployment → Function Logs
4. **Monitor Webpushr dashboard** - Check subscribers at https://app.webpushr.com
5. **Use different MongoDB databases** - Consider separate DBs for dev/staging/production

---

## 📞 Need Help?

If subscription still fails after following this guide:

1. Check browser console for errors (F12 → Console tab)
2. Check Network tab (F12 → Network) to see API request failures
3. Check Vercel Function Logs for backend errors
4. Verify Webpushr credentials are correct
5. Make sure service worker is accessible: `https://campus-connect-cyan-seven.vercel.app/webpushr-sw.js`

---

**Last Updated:** December 30, 2025  
**Status:** Ready for deployment ✅
