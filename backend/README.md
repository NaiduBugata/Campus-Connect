# CSE-Web Backend API

## Setup Instructions

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system.

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Check if MongoDB is running:**
```bash
mongod --version
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Configuration
The `.env` file is already created with default values:
- MongoDB URI: `mongodb://localhost:27017/cse-web`
- Port: `5000`
- JWT Secret: (change in production!)

### 4. Create Initial Admin Account
Before starting the frontend, create an admin account:

**Method 1: Using Postman/Thunder Client**
- POST `http://localhost:5000/api/auth/create-admin`
- Body (JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Method 2: Using curl**
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/create-admin` - Create admin (use once for setup)

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/stats` - Get notification stats (protected)
- `POST /api/notifications` - Create notification (protected)
- `PUT /api/notifications/:id` - Update notification (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Subscribers
- `GET /api/subscribers` - Get all subscribers (protected)
- `POST /api/subscribers` - Subscribe to notifications
- `DELETE /api/subscribers/:email` - Unsubscribe

### Health Check
- `GET /api/health` - Check if server is running

## Protected Routes
Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change these credentials in production!**

## Testing the API

### 1. Check if server is running:
```bash
curl http://localhost:5000/api/health
```

### 2. Create admin:
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 3. Login and get token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### 4. Use token for protected routes:
```bash
curl http://localhost:5000/api/notifications/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MongoDB URI in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using port 5000

### CORS Errors
- Verify CLIENT_URL in `.env` matches your frontend URL
- Default is `http://localhost:5173`

## Next Steps
1. Start MongoDB
2. Start backend server: `npm run dev`
3. Create admin account
4. Start frontend: `cd ../frontend && npm run dev`
5. Login with admin credentials
