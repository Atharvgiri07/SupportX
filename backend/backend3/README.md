# SupportX Backend — Phase 1 (Foundation)

This is the working starting point for the SmartDesk backend, built from the implementation plan.

## What's included
- Express server + MongoDB connection (`server.js`, `config/db.js`)
- All 4 database models: `User`, `Department`, `Ticket`, `Comment`
- JWT authentication: register, login, get profile, update profile
- Auth middleware: `protect` (must be logged in) and `admin` (must be admin)

## Setup

1. Open a terminal in this `backend` folder and run:
   ```
   npm install
   ```
2. Copy `.env.example` to a new file called `.env`:
   ```
   cp .env.example .env
   ```
3. Fill in `.env`:
   - `MONGO_URI` — get a free cluster at https://www.mongodb.com/cloud/atlas, create a database user, and copy the connection string.
   - `JWT_SECRET` — any long random string (e.g. mash your keyboard).
4. Start the server:
   ```
   npm run dev
   ```
   You should see `MongoDB Connected` and `SupportX server running on port 5000`.

## Test it (Postman, Thunder Client, or curl)

**Register (creates an admin):**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Admin User",
  "email": "admin@smartdesk.com",
  "password": "admin123",
  "role": "admin"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@smartdesk.com",
  "password": "admin123"
}
```
Copy the `token` from the response.

**Get profile (protected route):**
```
GET http://localhost:5000/api/auth/profile
Header: Authorization: Bearer <paste token here>
```

If that returns your user info, auth is fully working end-to-end.

## What's next (in order)
1. Department controller + routes (simple CRUD)
2. Ticket controller + routes, including the **auto-assign algorithm**
3. Comment controller + routes
4. Points system (`utils/calculatePoints.js`) wired into ticket resolution
5. Dashboard stats + chart-data endpoints
6. Gemini AI performance reports (`config/gemini.js`)
7. Frontend (React + Vite)

Ask for any of these next and it'll be built the same way — working code, verified before delivery.
