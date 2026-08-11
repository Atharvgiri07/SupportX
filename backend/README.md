# SupportX Backend

AI-powered ticket management system — REST API built with the MERN stack.

> Manage Smarter. Resolve Faster.

## Overview

SupportX is a smart help desk system. When a ticket is created, it's automatically assigned to whichever employee in the target department currently has the lightest workload. Employees earn performance points for resolving tickets, and admins can generate AI-written performance reports for any employee using Google Gemini.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini API (plain REST, no SDK) |
| Deployment | Render |

## Features

- JWT authentication with role-based access (admin / employee)
- Department management (CRUD)
- Ticket management with a **smart auto-assign algorithm**
- Comments, including a "this resolves the ticket" flag
- Points-based performance tracking
- Leaderboard and admin performance views
- Dashboard statistics and chart data
- AI-generated employee performance reports (Gemini)

## Folder Structure

```
backend/
├── config/
│   ├── db.js               # MongoDB connection (includes a DNS fix for Windows)
│   └── gemini.js            # Gemini API wrapper
├── controllers/
│   ├── aiReportController.js
│   ├── authController.js
│   ├── commentController.js
│   ├── dashboardController.js
│   ├── departmentController.js
│   ├── performanceController.js
│   └── ticketController.js
├── middleware/
│   ├── admin.js              # Admin-only route guard
│   └── auth.js               # JWT verification
├── models/
│   ├── Comment.js
│   ├── Department.js
│   ├── Ticket.js
│   └── User.js
├── routes/
│   ├── aiReportRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── dashboardRoutes.js
│   ├── departmentRoutes.js
│   ├── performanceRoutes.js
│   └── ticketRoutes.js
├── utils/
│   ├── autoAssign.js         # The smart-assignment algorithm
│   ├── calculatePoints.js    # Points-by-priority + speed bonus
│   └── generateToken.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your own values (see below)
3. `npm run dev` (or `npm start` for production)

## Environment Variables

| Key | Description |
|---|---|
| `PORT` | Port the server listens on (default 5000; Render sets its own automatically) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string, used to sign tokens |
| `JWT_EXPIRE` | Token lifetime (e.g. `7d`) |
| `GEMINI_API_KEY` | Free key from aistudio.google.com |
| `CLIENT_URL` | Deployed frontend URL, used for CORS |

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account |
| POST | `/login` | Public | Log in, get a JWT |
| GET | `/profile` | Private | Get your own profile |
| PUT | `/profile` | Private | Update your own profile |
| PUT | `/employees/:id/department` | Admin | Assign an employee's department |

### Departments — `/api/departments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a department |
| GET | `/` | Private | List departments (with live employee list) |
| PUT | `/:id` | Admin | Update a department |
| DELETE | `/:id` | Admin | Delete a department |

### Tickets — `/api/tickets`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a ticket (auto-assigns) |
| GET | `/` | Admin | Get all tickets |
| GET | `/my` | Private | Get tickets assigned to you |
| GET | `/:id` | Private | Get one ticket, with comments |
| PUT | `/:id/status` | Private | Update ticket status |
| PUT | `/:id/resolve` | Private | Resolve a ticket (awards points) |
| DELETE | `/:id` | Admin | Delete a ticket |
| POST | `/:id/comments` | Private | Add a comment |

### Comments — `/api/comments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| DELETE | `/:id` | Private | Delete your own comment (or any, as admin) |

### Performance — `/api/performance`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/my` | Private | Your own stats |
| GET | `/leaderboard` | Private | All employees, ranked |
| GET | `/all` | Admin | Full employee stats table |
| POST | `/ai-report/:id` | Admin | Generate a Gemini performance report |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Overview counts |
| GET | `/chart-data` | Admin | Tickets grouped by status/priority/department |

## The Auto-Assign Algorithm

When a ticket is created, `utils/autoAssign.js` finds every active employee in the target department, sorts them by fewest open tickets first (tie-broken by highest performance score), and assigns the ticket to whoever comes out on top — a single Mongoose query with a compound sort, not a manual comparison loop.

## Points System

| Priority resolved | Points |
|---|---|
| Low | +5 |
| Medium | +10 |
| High | +20 |
| Critical | +30 |
| Resolved within 2 hours | +5 bonus |

## Deployment

Deployed on **Render** as a Node web service, with **Root Directory** set to `backend` (this repo also contains a `frontend` folder as a sibling). MongoDB Atlas is used for the database. Render's free tier sleeps after 15 minutes of inactivity — the first request after a pause takes 30-60 seconds to wake up, which is expected, not a bug.
