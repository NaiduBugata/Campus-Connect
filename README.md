# 🎓 Campus Connect - Push Notification System

A complete web-based campus announcement and event management system with real-time push notifications, read/unread tracking, and automatic resend functionality.

---

## ✨ Features

- ✅ **Real-time Push Notifications** via Webpushr
- ✅ **Admin Dashboard** with secure JWT authentication
- ✅ **Event Management** for campus activities
- ✅ **Read/Unread Tracking** for all notifications
- ✅ **Auto-Resend** unread notifications (max 6 attempts)
- ✅ **Subscriber Management** with device tracking
- ✅ **Public Student Dashboard** - no login required
- ✅ **Comprehensive Analytics** and statistics
- ✅ **Custom Alert Components** - Beautiful UI with animations
- ✅ **Event Filtering** - Upcoming/Completed/All

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + Express 5.2.1
- **MongoDB** (Mongoose 9.0.2) - Atlas cloud database
- **JWT Authentication** - 7-day token expiry
- **Webpushr API** - Push notification delivery
- **node-cron** - Scheduled notification resends

### Frontend
- **React** 19.2.0
- **React Router DOM** 7.11.0
- **Vite** 7.2.4 - Lightning-fast build tool
- **Webpushr SDK** - Push notification subscription

### Deployment
- **Backend:** Render.com (Free tier)
- **Frontend:** Vercel (Free tier)
- **Database:** MongoDB Atlas (Free tier)

---

## 🚀 Deployment Guide

### Backend Deployment on Render

#### 1. Prepare Your Repository
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Create Render Account
- Go to [Render.com](https://render.com)
- Sign up with GitHub account

#### 3. Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `campus-connect-backend`
   - **Region:** Oregon (or nearest)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

#### 4. Set Environment Variables
In Render dashboard, add these environment variables:

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

#### 5. Deploy
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://campus-connect-backend.onrender.com`

### Frontend Deployment on Vercel

#### 1. Update Frontend Environment Variable
Go to [Vercel Dashboard](https://vercel.com/dashboard):
1. Select **campus-connect-cyan-seven** project
2. **Settings** → **Environment Variables**
3. Update or add:
   ```
   VITE_API_URL=https://campus-connect-backend.onrender.com/api
   ```
4. Select all environments (Production, Preview, Development)
5. Click **Save**

#### 2. Redeploy Frontend
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait for completion (~2 minutes)

### Verify Deployment

#### Test Backend
Visit: `https://campus-connect-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "version": "2.1.0-auth-fixed",
  "service": "Campus Connect API"
}
```

#### Test Frontend
1. Visit: `https://campus-connect-cyan-seven.vercel.app`
2. Go to Student Dashboard
3. Click "Subscribe to Notifications"
4. Should see: ✅ "Successfully subscribed!"

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ 
- Git
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NaiduBugata/Campus-Connect.git
   cd Campus-Connect
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```plaintext
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://campusadmin:campusadmin@cluster0.tbwgttz.mongodb.net/campusdb?retryWrites=true&w=majority
   JWT_SECRET=3d7a9039b7365478197b0f0d97f4d0de349f5996d1afdb6bc63de07649fa738b
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   CLIENT_URL=http://localhost:5173
   WEBPUSHR_PUBLIC_KEY=BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
   WEBPUSHR_AUTH_TOKEN=117317
   WEBPUSHR_REST_API_KEY=9a3985715a5e2089b2ab0a8c2e1fbef8
   ```

   Start backend:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file:
   ```plaintext
   VITE_API_URL=http://localhost:5000/api
   VITE_WEBPUSHR_PUBLIC_KEY=BPYbXahYivwtjJc8HGLaGRpjFcFXSQ-nuzORUSo_oA5mx2Dm-7zDLVJlbumRE4VCbuh6ABa_HRw-BzyWrxc3OsE
   ```

   Start frontend:
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Admin Login: http://localhost:5173/admin/login

### Default Admin Credentials
```
Username: admin
Password: admin123
```

---

## 📱 Usage Guide

### Student Dashboard
1. Visit the homepage
2. Allow notification permission when prompted
3. View all announcements and events
4. Filter events by status (Upcoming/Completed/All)
5. Receive push notifications for new announcements/events

### Admin Dashboard
1. Login at `/admin/login`
2. **Create Notifications:**
   - Fill in title and message
   - Select category (Academic/Event/Technical/General)
   - Notifications are instantly sent to all subscribers
3. **Manage Events:**
   - Create events with date, time, location
   - Events automatically trigger notifications
   - View all events in one place
4. **View Analytics:**
   - Total notifications sent
   - Read/Unread statistics
   - Active/Inactive status
   - Resend attempt tracking

---

## 🔄 Auto-Resend Feature

Unread notifications are automatically resent:
- **Schedule:** Every 15 minutes
- **Max Attempts:** 6 total sends
- **Intervals:**
  - 1st resend: 30 minutes after initial
  - 2nd resend: 6 hours after 1st
  - Subsequent: 24 hours apart
- **Stops When:** User clicks notification (marks as READ)

---

## 🏗️ Project Structure

```
Campus-Connect/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, JWT, Webpushr config
│   │   ├── controllers/     # Request handlers
│   │   ├── jobs/            # Cron jobs (auto-resend)
│   │   ├── middlewares/     # Auth, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Push notification services
│   │   ├── utils/           # Logger, helpers
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── webpushr-sw.js   # Service worker
│   ├── src/
│   │   ├── api/             # API integration
│   │   ├── components/      # React components
│   │   │   ├── admin/       # Admin components
│   │   │   ├── common/      # Shared components
│   │   │   └── user/        # Student components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # Webpushr integration
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Helpers, constants
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── routes.jsx       # Route definitions
│   ├── .env                 # Environment variables
│   ├── index.html           # HTML template
│   ├── package.json
│   └── vite.config.js       # Vite config
│
└── README.md                # This file
```

---

## 📊 API Documentation

### Public Endpoints (No Auth Required)

#### GET /api/health
Health check endpoint
```bash
curl https://campus-connect-backend.onrender.com/api/health
```

#### GET /api/notifications
Get all notifications
```bash
curl https://campus-connect-backend.onrender.com/api/notifications
```

#### GET /api/notifications/by-id/:id
Get notification by ID
```bash
curl https://campus-connect-backend.onrender.com/api/notifications/by-id/N1767084587908669
```

#### PUT /api/notifications/:id/read
Mark notification as read
```bash
curl -X PUT https://campus-connect-backend.onrender.com/api/notifications/NOTIFICATION_ID/read
```

#### GET /api/events
Get all events
```bash
curl https://campus-connect-backend.onrender.com/api/events
```

### Protected Endpoints (JWT Required)

#### POST /api/auth/login
Admin login
```bash
curl -X POST https://campus-connect-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### POST /api/notifications
Create notification
```bash
curl -X POST https://campus-connect-backend.onrender.com/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"Test message","category":"general"}'
```

#### POST /api/events
Create event
```bash
curl -X POST https://campus-connect-backend.onrender.com/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Event","description":"Description","date":"2025-12-31","time":"18:00","location":"Campus","category":"seminar"}'
```

---

## 🧪 Testing

Comprehensive test report available at [TEST_REPORT.md](TEST_REPORT.md)

### Manual API Testing

**Backend Tests:**
```bash
# Health check
curl http://localhost:5000/api/health

# Get notifications
curl http://localhost:5000/api/notifications

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🔧 Configuration

### Webpushr Setup
1. Sign up at [Webpushr](https://app.webpushr.com)
2. Create a website
3. Get credentials:
   - **Public Key** (VAPID)
   - **Auth Token**
   - **REST API Key**
4. Update in `.env` files

### MongoDB Atlas Setup
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

---

## 🐛 Troubleshooting

### Issue: Notifications not sending
**Solution:** Check Webpushr credentials in backend `.env`

### Issue: CORS errors
**Solution:** Ensure `FRONTEND_URL` in backend matches your actual frontend URL

### Issue: Database connection failed
**Solution:** Verify MongoDB Atlas IP whitelist and connection string

### Issue: Render deployment fails
**Solution:** 
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### Issue: Frontend can't connect to backend
**Solution:** Update `VITE_API_URL` in Vercel environment variables

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👥 Contributors

- **Developer:** Campus Connect Team
- **Repository:** [GitHub - Campus-Connect](https://github.com/NaiduBugata/Campus-Connect)

---

## 📞 Support

For issues and questions:
1. Check [TEST_REPORT.md](TEST_REPORT.md) for test results
2. Review deployment logs on Render/Vercel
3. Check browser console for frontend errors
4. Review backend logs for API errors

---

## 🎯 Roadmap

- [ ] Email notifications as backup
- [ ] SMS notifications integration
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard with charts
- [ ] User roles (Admin, Moderator, Student)
- [ ] Event RSVP functionality
- [ ] Notification scheduling
- [ ] Rich media attachments

---

**Last Updated:** December 30, 2025  
**Version:** 2.1.0  
**Status:** Production Ready ✅
