# 🚀 QUICK DEPLOYMENT GUIDE

## Backend is ready to deploy! Follow these steps:

### Option 1: RENDER (Recommended - Takes 5 minutes)

1. **Sign up**: Visit https://render.com/signup (opened in your browser)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub Repository: `NaiduBugata/Campus-Connect`

3. **Configure**:
   - Name: `campus-connect-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. **Environment Variables** (Add these in Render dashboard):

```
MONGODB_URI=<GET_FROM_MONGODB_ATLAS>
JWT_SECRET=3d7a9039b7365478197b0f0d97f4d0de349f5996d1afdb6bc63de07649fa738b
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app
WEBPUSHR_PUBLIC_KEY=683978b545bedb748e1a5a1e5fdb0a79
WEBPUSHR_AUTH_TOKEN=117308
NODE_ENV=production
PORT=5000
```

5. **MongoDB Atlas** (Free):
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create M0 Free Cluster
   - Database Access → Add User (save password!)
   - Network Access → Add IP → 0.0.0.0/0 (Allow All)
   - Connect → Application → Copy connection string
   - Replace `<password>` in connection string
   - Paste as MONGODB_URI in Render

6. **Deploy**: Click "Create Web Service"

7. **Get Backend URL**: After deployment, copy URL
   - Example: `https://campus-connect-backend.onrender.com`

8. **Update Frontend**: Update frontend/.env:
   ```
   VITE_API_URL=https://campus-connect-backend.onrender.com
   ```

---

## Links Opened:
- Render Signup: https://render.com/signup
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

## Your Generated Secrets:
- JWT_SECRET: `3d7a9039b7365478197b0f0d97f4d0de349f5996d1afdb6bc63de07649fa738b`

⚠️ SAVE THIS SECRET - You'll need it for deployment!

---

## After Backend Deployment:

Test your backend:
```bash
curl https://your-render-url.onrender.com/api/health
```

Expected response:
```json
{"success":true,"message":"Server is running"}
```

---

## Need Help?
- Render Docs: https://render.com/docs
- MongoDB Docs: https://www.mongodb.com/docs/atlas/
