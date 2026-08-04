# 🚀 SupportX — Complete Project Explanation

## 1. Project Overview

**SupportX** is an **enterprise-level AI-powered Help Desk & Ticket Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

It enables organizations to manage customer/internal support tickets with features like:
- Smart auto-assignment of tickets to employees
- Gamified performance scoring system
- AI-powered employee reports using Google Gemini
- Role-based access control (Admin vs Employee)
- Real-time notifications
- SLA (Service Level Agreement) tracking
- Dark/Light theme

> **Think of it as a lightweight Jira + Zendesk + Linear combined into one system.**

---

## 2. Technology Stack

### Backend
| Technology | Purpose | Why Used |
|---|---|---|
| **Node.js** | Runtime environment | Non-blocking I/O, ideal for real-time apps |
| **Express.js** | Web framework | Fast, minimalist REST API framework |
| **MongoDB** | NoSQL Database | Flexible schema for tickets, users, departments |
| **Mongoose** | ODM (Object Data Modeling) | Schema validation, virtual fields, middleware hooks |
| **JWT (jsonwebtoken)** | Authentication | Stateless token-based auth, no server sessions needed |
| **bcryptjs** | Password hashing | One-way hash with salt, industry standard |
| **Helmet** | HTTP security headers | Prevents XSS, clickjacking, MIME sniffing |
| **express-rate-limit** | Rate limiting | Prevents brute-force login attacks |
| **Morgan** | HTTP logger | Logs all requests in development |
| **dotenv** | Environment config | Keeps secrets out of source code |
| **cors** | Cross-Origin Resource Sharing | Allows frontend (port 5173) to call backend (port 5000) |
| **@google/generative-ai** | Google Gemini AI | Generates AI-powered employee performance reports |

### Frontend
| Technology | Purpose | Why Used |
|---|---|---|
| **React 18** | UI library | Component-based, virtual DOM, fast rendering |
| **Vite** | Build tool | 10x faster than Webpack, instant HMR (Hot Module Replacement) |
| **React Router v6** | Client-side routing | SPA (Single Page Application) navigation |
| **Axios** | HTTP client | Promise-based, interceptors for JWT injection |
| **Recharts** | Data visualization | Bar charts, pie charts for dashboard analytics |
| **React Toastify** | Toast notifications | Success/error/warning pop-ups |
| **React Icons (Feather)** | Icon library | Consistent, lightweight SVG icons |
| **CSS Variables** | Theming | Dark/Light mode via `data-theme` attribute |

---

## 3. Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│  React + Vite (http://localhost:5173)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Pages   │ │Components│ │ Context  │ │  Utils   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ Axios (HTTP + JWT Bearer Token)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS API SERVER (Backend)                 │
│  Node.js + Express (http://localhost:5000)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Routes  │→│Controller│→│  Models  │→│   Utils  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐                               │
│  │Middleware│ │  Config  │                               │
│  └──────────┘ └──────────┘                               │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Database)              │
│  Collections: users, tickets, departments, comments,     │
│  notifications, tickethistories, activitylogs            │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              GOOGLE GEMINI AI (External API)             │
│  Generates employee performance analysis reports         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Database Models (MongoDB Collections)

### 4.1 User Model (`models/User.js`)
Stores all users — both admins and employees.

| Field | Type | Purpose |
|---|---|---|
| `name` | String | User's display name |
| `email` | String (unique) | Login email |
| `password` | String (hashed) | bcrypt-hashed password (select: false — never sent to client) |
| `role` | Enum: `admin` / `employee` | Controls what pages/features are accessible |
| `department` | ObjectId → Department | Which department the employee belongs to |
| `performanceScore` | Number | Gamified score based on ticket resolution speed |
| `totalResolved` | Number | Lifetime count of resolved tickets |
| `currentOpen` | Number | Current number of assigned open tickets |
| `isActive` | Boolean | Whether the employee is active |

**Key Feature — Password Hashing:**
```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```
This Mongoose **pre-save middleware** automatically hashes the password before storing it. The `isModified` check prevents re-hashing on non-password updates.

---

### 4.2 Ticket Model (`models/Ticket.js`) — The Core Model
The most complex model with **30+ fields** and **virtual computed properties**.

| Field Group | Fields | Purpose |
|---|---|---|
| **Basic** | title, description, category, priority | Ticket details |
| **Status** | status (Open → In Progress → Pending → Resolved → Closed) | Lifecycle tracking |
| **Assignment** | createdBy, assignedTo, department | Who created, who's working on it |
| **SLA** | dueDate, slaHours | Service Level Agreement tracking |
| **Resolution** | resolvedAt, closedAt, pointsAwarded | When resolved, points earned |
| **AI** | aiSummary, aiSuggestedPriority, aiSuggestedCategory | AI analysis fields |
| **Customer** | customerRating, customerFeedback | Customer satisfaction |
| **Meta** | source, tags, attachments, archived, deleted | Organization |

**Key Feature — Virtual Fields (computed on-the-fly, not stored in DB):**
```js
ticketSchema.virtual('isOverdue').get(function () {
  return this.dueDate && 
    ['Open', 'In Progress', 'Pending'].includes(this.status) && 
    new Date() > this.dueDate;
});
```
These virtual fields are **calculated every time the ticket is read** — they don't take up storage but appear in API responses.

---

### 4.3 Other Models

| Model | Purpose | Key Fields |
|---|---|---|
| **Department** | Organizes employees into teams | name, description |
| **Comment** | Discussion thread on each ticket | text, user, ticket, isResolution |
| **Notification** | In-app notification system | title, message, recipient, isRead, link |
| **TicketHistory** | Audit trail of all status changes | ticket, changedBy, oldStatus, newStatus, notes |
| **ActivityLog** | System-wide activity tracking | action, user, targetType, targetId, details |

---

## 5. Backend Architecture — How It Works

### 5.1 Request Flow
```
Client Request → Express Router → Middleware → Controller → Model → MongoDB
                                  ↓
                            auth.js (JWT verify)
                            admin.js (role check)
```

### 5.2 Middleware

**auth.js** — JWT Authentication:
1. Extracts the `Bearer` token from the `Authorization` header
2. Verifies the token using `jwt.verify()` with the secret key
3. Finds the user in MongoDB and attaches `req.user`
4. If token is invalid → returns 401 Unauthorized

**admin.js** — Role-Based Access:
1. Checks if `req.user.role === 'admin'`
2. If not → returns 403 Forbidden

### 5.3 API Endpoints

#### Auth Routes (`/api/auth`)
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/register` | Create new user | Public |
| POST | `/login` | Login, get JWT token | Public |
| GET | `/profile` | Get current user info | Protected |
| PUT | `/employees/:id/department` | Assign employee to department | Admin |

#### Ticket Routes (`/api/tickets`)
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/` | Create ticket (auto-assigns employee) | Admin |
| GET | `/` | Get all tickets | Protected |
| GET | `/:id` | Get single ticket with comments & history | Protected |
| PUT | `/:id/status` | Change ticket status | Protected |
| PUT | `/:id/resolve` | Resolve ticket (awards points) | Protected |
| PUT | `/:id/close` | Close a resolved ticket | Admin |
| PUT | `/:id/reopen` | Reopen a resolved/closed ticket (reverses points) | Admin |
| DELETE | `/:id` | Delete ticket | Admin |

#### Department Routes (`/api/departments`)
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/` | Create department | Admin |
| GET | `/` | List all departments | Protected |
| PUT | `/:id` | Update department | Admin |
| DELETE | `/:id` | Delete department | Admin |

#### Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/stats` | Get all dashboard statistics | Admin |
| GET | `/chart-data` | Get chart data (by status, priority, department) | Admin |

#### Other Routes
| Route | Purpose |
|---|---|
| `/api/notifications` | Get, mark-read, mark-all-read |
| `/api/performance` | Leaderboard, all employees, AI reports |
| `/api/activity-logs` | System activity feed |

---

## 6. Smart Algorithms

### 6.1 Auto-Assignment Engine (`utils/autoAssign.js`)

When an admin creates a ticket, the system automatically assigns it to the **best available employee** in that department:

```
Rule 1: Employee with LEAST open tickets wins
Rule 2: If tied → employee with HIGHER performance score wins
```

```js
const employees = await User.find({
  department: departmentId,
  role: 'employee',
  isActive: true,
}).sort({ currentOpen: 1, performanceScore: -1 });
```

This uses **MongoDB sorting** instead of JavaScript loops — much more efficient.

### 6.2 Gamified Points System (`utils/calculatePoints.js`)

Points are awarded based on **ticket priority** and **resolution speed**:

| Priority | Base Points |
|---|---|
| Low | 5 |
| Medium | 10 |
| High | 20 |
| Critical | 30 |

**Speed Bonuses:**
| Resolution Speed | Bonus |
|---|---|
| Under 1 hour | +15 |
| Under 2 hours | +10 |
| Under 4 hours | +5 |
| Under SLA deadline | +3 |
| **Over SLA deadline** | **−5 penalty** |

> Total never drops below 1 point. This gamification motivates employees to resolve tickets faster.

### 6.3 SLA Tracking

Each ticket has a `dueDate` (default: 24 hours from creation) and `slaHours`. The virtual field `isOverdue` automatically calculates whether the ticket has breached its SLA.

---

## 7. AI Integration — Google Gemini

### How It Works
1. Admin clicks "Generate AI Report" for an employee
2. Backend fetches the employee's data and resolved tickets
3. Constructs a **prompt** with the employee's stats
4. Sends the prompt to **Google Gemini API**
5. Gemini returns a structured report with:
   - Performance summary
   - Strengths (bullet points)
   - Areas for improvement
   - Rating (Excellent / Good / Average / Needs Improvement)

### The Prompt Engineering:
```
Analyze this employee's ticket data:
Name: John Doe, Department: Engineering
Tickets Resolved: 47
Avg Resolution Time: 3.2 hours
Points: 850

Generate:
1. Performance summary (2-3 sentences)
2. Strengths (3 bullet points)
3. Areas for improvement (2 bullet points)
4. Rating: Excellent / Good / Average / Needs Improvement
```

---

## 8. Frontend Architecture

### 8.1 Component Tree
```
App.jsx
├── ThemeProvider (Dark/Light mode context)
├── AuthProvider (User session context)
├── BrowserRouter
│   └── AppShell (Navbar + Sidebar + Content)
│       ├── Navbar
│       │   ├── Brand Logo
│       │   ├── NotificationBell (dropdown with unread count)
│       │   ├── Theme Toggle (🌙/☀️)
│       │   └── Logout
│       ├── Sidebar (collapsible, responsive)
│       │   ├── Dashboard
│       │   ├── Create Ticket
│       │   ├── All Tickets
│       │   ├── Departments
│       │   ├── Employees
│       │   ├── AI Reports
│       │   └── Leaderboard
│       └── Pages (routed content)
```

### 8.2 Pages Overview

#### Public Pages
| Page | Purpose |
|---|---|
| **Landing** | Marketing page with call-to-action |
| **Login** | Email + password login form |
| **Register** | Name, email, password, role selection |

#### Employee Pages
| Page | Purpose |
|---|---|
| **My Tickets** | List of tickets assigned to the logged-in employee |
| **Ticket Detail** | Full ticket view with comments, history, SLA info, admin controls |
| **My Performance** | Personal stats — score, resolved count, open count |
| **Leaderboard** | All employees ranked by performance score with medals |

#### Admin Pages
| Page | Purpose |
|---|---|
| **Dashboard** | Overview cards (total, open, resolved, overdue, avg time, today) + charts + top performers |
| **Create Ticket** | Form to create a new ticket (auto-assigns to best employee) |
| **All Tickets** | Full table with search, filters, overdue indicators, quick actions |
| **Departments** | CRUD for departments |
| **Employees** | Table showing all employees, assign departments, view performance |
| **AI Reports** | Generate Gemini-powered AI performance reports |

### 8.3 Reusable Components
| Component | Purpose |
|---|---|
| **Navbar** | Top navigation bar with brand, notifications, theme toggle, logout |
| **Sidebar** | Collapsible side navigation with role-based links |
| **NotificationBell** | Bell icon with unread count badge, dropdown panel, auto-refresh |
| **StatusBadge** | Colored pill showing ticket status (Open, In Progress, Pending, Resolved, Closed, Rejected) |
| **PriorityBadge** | Colored pill showing priority (Low, Medium, High, Critical) |
| **TicketCard** | Card component for displaying ticket in a list |
| **Loader** | Loading spinner/skeleton |
| **ProtectedRoute** | Route guard — redirects to login if not authenticated |

### 8.4 State Management
| Context | Purpose |
|---|---|
| **AuthContext** | Stores user session (user object, JWT token, login/logout functions) |
| **ThemeContext** | Stores theme preference (light/dark), persisted in localStorage |

### 8.5 API Integration (`utils/api.js`)
A pre-configured Axios instance that:
1. Sets base URL to `http://localhost:5000/api`
2. **Request interceptor**: Automatically attaches JWT token from localStorage to every request
3. **Response interceptor**: If any API returns 401 (Unauthorized), automatically clears the token and redirects to login

---

## 9. Security Features

| Feature | Implementation | Protection Against |
|---|---|---|
| **Password Hashing** | bcrypt with salt rounds (10) | Rainbow table attacks |
| **JWT Authentication** | Token-based, 7-day expiry | Session hijacking |
| **Rate Limiting** | 100 requests per 15 min on login/register | Brute force attacks |
| **Helmet** | Sets security HTTP headers | XSS, clickjacking, MIME sniffing |
| **CORS** | Restricts to allowed origins | Cross-site request forgery |
| **Input Validation** | Mongoose schema validators | SQL/NoSQL injection |
| **Password select: false** | Password never returned in API responses | Data leakage |

---

## 10. Dark Mode Implementation

```css
:root {
  --color-bg: #f8fafc;        /* Light background */
  --color-text: #0f172a;      /* Dark text */
}

[data-theme='dark'] {
  --color-bg: #0f172a;        /* Dark background */
  --color-text: #f1f5f9;      /* Light text */
}
```

All components use **CSS variables** instead of hardcoded colors. When the user toggles the theme:
1. `ThemeContext` updates the state
2. `document.documentElement.setAttribute('data-theme', 'dark')` is called
3. All CSS variables automatically switch
4. Preference is saved in `localStorage`

---

## 11. Complete User Workflow

### Admin Flow:
```
Register (role=admin) → Login → Dashboard (see stats & charts)
  ↓
Create Department → Assign Employees to Department
  ↓
Create Ticket → System auto-assigns to least-busy employee
  ↓
Monitor in All Tickets (filter by status, search, view overdue)
  ↓
Change Status → Close Ticket → Reopen if needed
  ↓
View Leaderboard → Generate AI Reports for employees
```

### Employee Flow:
```
Register (role=employee) → Login → My Tickets
  ↓
Click Ticket → Read details → Add Comments
  ↓
Use AI Suggestions ("Investigating", "Fix Deployed", "Resolution Note")
  ↓
Mark as Resolved → Earn Points (speed bonus!)
  ↓
Check My Performance → See rank on Leaderboard
```

---

## 12. File-by-File Summary

### Backend Files

| File | Purpose |
|---|---|
| `server.js` | Entry point — connects DB, registers middleware, mounts routes |
| `config/db.js` | MongoDB Atlas connection using Mongoose |
| `config/gemini.js` | Google Gemini AI API client configuration |
| `models/User.js` | User schema with password hashing hooks |
| `models/Ticket.js` | Ticket schema with 30+ fields and virtual computed properties |
| `models/Department.js` | Department schema (name, description) |
| `models/Comment.js` | Comment schema linked to ticket and user |
| `models/Notification.js` | In-app notification schema |
| `models/TicketHistory.js` | Audit trail for status changes |
| `models/ActivityLog.js` | System-wide activity logger |
| `middleware/auth.js` | JWT token verification middleware |
| `middleware/admin.js` | Admin-only role check middleware |
| `controllers/authController.js` | Register, login, profile, assign department |
| `controllers/ticketController.js` | CRUD + resolve/close/reopen (13KB — biggest file) |
| `controllers/dashboardController.js` | Stats aggregation with Promise.all |
| `controllers/commentController.js` | Add and delete comments |
| `controllers/departmentController.js` | Department CRUD |
| `controllers/performanceController.js` | Leaderboard and employee performance data |
| `controllers/aiReportController.js` | Gemini AI report generation |
| `controllers/notificationController.js` | Get, mark-read, mark-all-read |
| `controllers/activityController.js` | Activity log queries |
| `utils/autoAssign.js` | Smart least-busy assignment algorithm |
| `utils/calculatePoints.js` | Gamified scoring with speed bonuses and SLA penalty |
| `utils/generateToken.js` | JWT token generation utility |
| `utils/logger.js` | Activity logging utility |

### Frontend Files

| File | Purpose |
|---|---|
| `main.jsx` | React entry point, renders App |
| `App.jsx` | Routes, providers, layout shell |
| `index.css` | Design system — colors, typography, buttons, cards, responsive |
| `context/AuthContext.jsx` | User login state, JWT persistence |
| `context/ThemeContext.jsx` | Dark/Light mode toggle and persistence |
| `utils/api.js` | Axios instance with auth interceptors |
| `utils/useCountUp.js` | Animated number counting hook for dashboard stats |
| `utils/exportUtils.js` | CSV export and print utilities |
| `components/Navbar.jsx` | Top bar with brand, notifications, theme, logout |
| `components/Sidebar.jsx` | Collapsible navigation with role-based links |
| `components/NotificationBell.jsx` | Bell icon with dropdown, auto-refresh every 30s |
| `components/StatusBadge.jsx` | Colored status pills |
| `components/PriorityBadge.jsx` | Colored priority pills |
| `components/TicketCard.jsx` | Reusable ticket card component |
| `components/Loader.jsx` | Loading spinner |
| `components/ProtectedRoute.jsx` | Auth guard wrapper |
| `pages/Landing.jsx` | Public marketing page |
| `pages/Login.jsx` | Login form |
| `pages/Register.jsx` | Registration form |
| `pages/Home.jsx` | Employee home page |
| `pages/admin/Dashboard.jsx` | Stats, charts, top performers |
| `pages/admin/CreateTicket.jsx` | Ticket creation form |
| `pages/admin/AllTickets.jsx` | Full ticket table with filters and quick actions |
| `pages/admin/Departments.jsx` | Department management |
| `pages/admin/Employees.jsx` | Employee management with department assignment |
| `pages/admin/AIReports.jsx` | AI-powered employee performance reports |
| `pages/employee/MyTickets.jsx` | Employee's assigned tickets |
| `pages/employee/TicketDetail.jsx` | Full ticket view with comments, history, admin controls |
| `pages/employee/MyPerformance.jsx` | Personal performance stats |
| `pages/employee/Leaderboard.jsx` | Ranked employee list with medals |

---

## 13. Key Technical Concepts Used

| Concept | Where Used | Explanation |
|---|---|---|
| **REST API** | All routes | Stateless HTTP methods (GET, POST, PUT, DELETE) |
| **JWT Auth** | middleware/auth.js | Token-based stateless authentication |
| **Mongoose Virtuals** | Ticket.js | Computed fields that don't occupy DB storage |
| **Pre-save Hooks** | User.js | Middleware that runs before saving (password hashing) |
| **Promise.all** | dashboardController.js | Runs multiple DB queries in parallel for performance |
| **React Context API** | AuthContext, ThemeContext | Global state without prop drilling |
| **Protected Routes** | ProtectedRoute.jsx | Component that redirects unauthenticated users |
| **Axios Interceptors** | api.js | Automatically attaches JWT and handles 401 errors |
| **CSS Custom Properties** | index.css | CSS variables for dynamic theming |
| **Responsive Design** | All CSS files | Media queries for mobile/tablet/desktop |
| **Rate Limiting** | server.js | Prevents API abuse on auth endpoints |
| **Aggregation** | dashboardController.js | MongoDB aggregate pipeline for chart data |
| **Population** | Multiple controllers | Mongoose `.populate()` to join related documents |
| **Prompt Engineering** | aiReportController.js | Structured prompts for consistent AI output |

---

## 14. How to Run the Project

```bash
# 1. Start Backend
cd D:\project\SupportX\backend\backend4
npm install
node server.js
# → Backend runs on http://localhost:5000

# 2. Start Frontend  
cd D:\project\SupportX\frontend
npm install
npm run dev
# → Frontend runs on http://localhost:5173
```

### Environment Variables (`.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_key
CLIENT_URL=http://localhost:5173
```
