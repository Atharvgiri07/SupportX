# 🚀 SupportX — Enterprise AI-Powered Help Desk & Ticket Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-8E75B2?style=for-the-badge&logo=google)

SupportX is a modern, enterprise-ready Help Desk application built with the **MERN Stack**. It provides automated ticket creation, intelligent workload auto-assignment, real-time SLA tracking, gamified performance leaderboard, and AI-driven performance reports using Google Gemini.

---

## 🌟 Key Features

### 👨‍💼 For Admins
- **Interactive Dashboard:** Monitor total tickets, open/in-progress count, resolved tickets, overdue tickets, average resolution time, and today's tickets.
- **Smart Auto-Assignment:** Automatically assigns new tickets to the least-busy employee in the relevant department.
- **Full Ticket Lifecycle Management:** Change status, close tickets, or reopen tickets (with automatic points reversal).
- **Department & Employee CRUD:** Manage departments and assign employees.
- **AI Performance Reports:** Generate comprehensive performance reports for employees using **Google Gemini AI**.
- **Real-Time Analytics & Charts:** Visual bar/pie charts for tickets by status, priority, and department powered by `Recharts`.
- **Export & Print:** One-click CSV exports for tickets, employees, and leaderboard data.

### 👷 For Employees
- **My Tickets View:** Filter assigned tickets by priority, status, or search terms.
- **Interactive Ticket Resolution:** Resolve tickets to earn performance points based on priority and resolution speed.
- **SLA & Overdue Tracking:** Visual badges and countdown timers for SLA hours and overdue items.
- **Interactive Discussion & AI Reply Chips:** Comment on tickets with quick AI-suggested responses (*Investigating*, *Fix Deployed*, *Resolution Note*).
- **Gamified Leaderboard:** Compare scores with colleagues featuring 🥇 Gold, 🥈 Silver, and 🥉 Bronze badges.
- **Personal Performance Analytics:** Detailed breakdown of base points, speed bonuses, and SLA breach penalties.

### 🎨 General UX/UI
- **Dark & Light Mode:** Seamless theming powered by CSS Custom Properties and persistent state.
- **Real-Time Notification Bell:** Auto-refreshing notification center with unread badges and one-click navigation.
- **Full Responsiveness:** Optimized for Mobile, Tablet, Laptop, and Ultra-Wide displays.

---

## 🏗️ Tech Stack & Architecture

### Frontend (`D:\project\SupportX\frontend`)
- **Core:** React 18, Vite 5, JavaScript (ES6+)
- **Routing:** React Router DOM v6
- **Styling:** CSS3 Custom Variables, CSS Modules, Flexbox/Grid
- **Icons:** React Icons (`Fi` Feather Icons)
- **Charts:** Recharts
- **HTTP Client:** Axios (with request & response interceptors)
- **Notifications:** React Toastify

### Backend (`D:\project\SupportX\backend\backend4`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs` password hashing
- **Security:** Helmet.js, CORS, `express-rate-limit`
- **AI Integration:** `@google/generative-ai` (Google Gemini SDK)

---

## 📂 Project Structure

```
SupportX/
├── backend/
│   └── backend4/
│       ├── config/          # Database connection & Gemini API config
│       ├── controllers/     # Request handler logic (Tickets, Auth, AI, Dashboard, etc.)
│       ├── middleware/      # Authentication (JWT) & Admin Authorization
│       ├── models/          # Mongoose Schemas (User, Ticket, Department, Comment, Notification, etc.)
│       ├── routes/          # API Route Definitions
│       ├── utils/           # Auto-assign algorithm, points calculation, logger
│       ├── .env             # Environment configuration file
│       ├── server.js        # Express app entry point
│       └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, NotificationBell, Badges, etc.
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── pages/           # Admin & Employee Page components
│   │   │   ├── admin/       # Dashboard, AllTickets, CreateTicket, Employees, AIReports
│   │   │   └── employee/    # MyTickets, TicketDetail, MyPerformance, Leaderboard
│   │   ├── utils/           # API Axios client, export utilities, custom hooks
│   │   ├── App.jsx          # Routes & layout shell
│   │   ├── index.css        # Design tokens & global CSS
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database account or local MongoDB instance

---

### Step 1: Clone & Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd D:\project\SupportX\backend\backend4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create/update the `.env` file in `D:\project\SupportX\backend\backend4\.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   GEMINI_API_KEY=your_google_gemini_api_key
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm start
   # Or for development with nodemon:
   npm run dev
   ```
   > Backend will run at: **`http://localhost:5000`**

---

### Step 2: Configure & Start Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd D:\project\SupportX\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > Frontend will run at: **`http://localhost:5173`**

---

## 📡 API Endpoint Overview

### 🔐 Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new admin or employee |
| POST | `/api/auth/login` | Public | Authenticate user & return JWT token |
| GET | `/api/auth/profile` | Private | Fetch logged-in user profile |
| PUT | `/api/auth/employees/:id/department` | Admin | Assign employee to a department |

### 🎫 Ticket Routes (`/api/tickets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tickets` | Private | Fetch all tickets or filtered by user |
| GET | `/api/tickets/:id` | Private | Fetch detailed single ticket view |
| POST | `/api/tickets` | Admin | Create ticket (triggers auto-assign) |
| PUT | `/api/tickets/:id/status` | Private | Update ticket status |
| PUT | `/api/tickets/:id/resolve` | Private | Mark ticket as resolved & calculate points |
| PUT | `/api/tickets/:id/close` | Admin | Mark resolved ticket as closed |
| PUT | `/api/tickets/:id/reopen` | Admin | Reopen ticket & reverse points |
| DELETE | `/api/tickets/:id` | Admin | Permanently delete ticket |

### 📊 Dashboard & Performance (`/api/dashboard`, `/api/performance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Admin | Fetch summary metrics & top performers |
| GET | `/api/dashboard/chart-data` | Admin | Fetch status, priority & dept distribution |
| GET | `/api/performance/leaderboard` | Private | Fetch ranked leaderboard |
| POST | `/api/performance/ai-report/:id` | Admin | Generate AI performance evaluation |

---

## 🧮 Smart Point Calculation Algorithm

SupportX awards points based on ticket priority and resolution speed:

```
Base Points:
  - Low Priority: 5 pts
  - Medium Priority: 10 pts
  - High Priority: 20 pts
  - Critical Priority: 30 pts

Speed Bonus / Penalty:
  - Resolved < 1 hour:   +15 pts
  - Resolved < 2 hours:  +10 pts
  - Resolved < 4 hours:  +5 pts
  - Resolved < SLA:      +3 pts
  - Resolved > SLA:      -5 pts (penalty)
```

---

## 📝 License & Author

Created as an Enterprise MERN Stack Project for SupportX.
- **License:** MIT
