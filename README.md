# 🎓 Campus Connect - Push Notification System

A complete web-based announcement system with real-time push notifications, read/unread tracking, and automatic resend functionality.

## ✨ Features

- ✅ **Real-time Push Notifications** via Webpushr
- ✅ **Admin Dashboard** with secure JWT authentication
- ✅ **Read/Unread Tracking** for all notifications
- ✅ **Auto-Resend** unread notifications (max 3 attempts)
- ✅ **Event Management** for campus activities
- ✅ **Subscriber Management** with device tracking
- ✅ **Public Access** - no login required for viewing
- ✅ **Comprehensive Analytics** and statistics

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running)
- Webpushr account (free at https://webpushr.com)

### Installation

1. **Extract the project** (already done ✅)

2. **Configure Webpushr**
   - Sign up at https://webpushr.com
   - Create a website
   - Get your PUBLIC_KEY and AUTH_TOKEN
   - Update in `.env` files (both backend and frontend)

3. **Start MongoDB**
   ```bash
   net start MongoDB
   ```

4. **Run the application**
   
   **Option 1: Double-click START.bat** (Windows)
   - Easiest method!
   - Opens both servers and browser automatically

   **Option 2: PowerShell Script**
   ```powershell
   .\START.ps1
   ```

   **Option 3: Manual Start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin/login

### Default Admin Credentials
```
Username: admin
Password: admin123
```

## 📱 Usage

### As a User:
1. Open http://localhost:5173
2. Click "Allow Notifications" when prompted
3. Subscribe to receive push notifications
4. View announcements and events
5. Click notifications to mark as read

### As an Admin:
1. Login at http://localhost:5173/admin/login
2. Create notifications from dashboard
3. Notifications are instantly sent via Webpushr
4. View delivery statistics
5. Monitor read/unread status
6. Manually trigger resend if needed

## 🔄 Auto-Resend Feature

The system automatically resends unread notifications:
- **1st Resend**: 30 minutes after initial send
- **2nd Resend**: 6 hours after 1st resend
- **Max Attempts**: 3 total sends
- **Stops When**: User clicks notification (marks as READ)

Resend job runs automatically every 15 minutes.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/create-admin` - Create admin account
- `POST /api/auth/login` - Admin login

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/by-id/:id` - Get single notification
- `POST /api/notifications` - Create notification (Admin)
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/stats` - Get statistics (Admin)
- `POST /api/notifications/resend-check` - Manual resend trigger (Admin)

### Subscribers
- `POST /api/subscribers` - Subscribe with Webpushr ID
- `GET /api/subscribers` - Get all subscribers (Admin)
- `DELETE /api/subscribers/:id` - Unsubscribe

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin)

## 🛠️ Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Webpushr API
- node-cron for scheduling

### Frontend
- React + Vite
- React Router
- Webpushr SDK
- Context API for state management

## 📁 Project Structure

```
Campus-Connect/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, JWT, Webpushr
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Push & Resend logic
│   │   ├── jobs/           # Cron scheduler
│   │   ├── middlewares/    # Auth & error handling
│   │   └── utils/          # Logger
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   ├── pages/         # Page components
│   │   ├── services/      # Webpushr service
│   │   └── utils/         # Helpers
│   ├── .env              # Environment variables
│   └── package.json
│
├── START.bat             # Quick start (Windows)
├── START.ps1             # Quick start (PowerShell)
├── SETUP_GUIDE.md        # Detailed setup instructions
├── TESTING_GUIDE.md      # Testing procedures
└── README.md             # This file
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-connect
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
WEBPUSHR_PUBLIC_KEY=your-public-key
WEBPUSHR_AUTH_TOKEN=your-auth-token
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WEBPUSHR_PUBLIC_KEY=your-public-key
```

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing procedures.

Quick test:
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📈 Features Coverage

| Feature | Status |
|---------|--------|
| Admin Login | ✅ Complete |
| Push Notifications | ✅ Complete |
| Read/Unread Tracking | ✅ Complete |
| Auto-Resend | ✅ Complete |
| Webpushr Integration | ✅ Complete |
| MongoDB Integration | ✅ Complete |
| Event Management | ✅ Complete |
| Subscriber Tracking | ✅ Complete |
| Analytics Dashboard | ✅ Complete |
| Public Access | ✅ Complete |

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
net start MongoDB
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### Webpushr Not Working
- Verify PUBLIC_KEY and AUTH_TOKEN in .env
- Check browser console for errors
- Ensure notifications are allowed in browser

## 📝 Notes

- Default admin credentials are **admin/admin123** - change in production!
- Webpushr free tier supports up to 10,000 subscribers
- MongoDB must be running before starting the backend
- Service worker requires HTTPS in production (localhost works for development)

## 🎯 Current Status

**✅ ALL FEATURES FULLY IMPLEMENTED AND WORKING**

Both servers are currently running:
- Backend: http://localhost:5000 ✅
- Frontend: http://localhost:5173 ✅
- MongoDB: Connected ✅
- Resend Job: Active ✅

## 📞 Support

For issues or questions:
1. Check the logs in terminal windows
2. Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. Verify .env configuration
4. Check MongoDB is running

## 🎉 Enjoy!

Your Campus Connect platform is fully functional and ready to use!

---

**Last Updated**: December 29, 2025  
**Status**: Production Ready ✅
