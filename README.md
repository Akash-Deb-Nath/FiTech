# 📊 Financial Records API

### Role-Based Backend with Dashboard Analytics

A backend system to manage financial records (income & expenses) with role-based access and advanced dashboard summary APIs.

---

** Live Link: https://y-khaki-one.vercel.app/ **

---

## 🚀 Overview

This project demonstrates backend architecture for managing financial data and generating aggregated insights for dashboards.

It focuses on:

- Clean API design
- Aggregation queries
- Role-based access control

---

## ✨ Features

- 🔐 Authentication & Authorization (Role-Based)
- 💰 Income & Expense Management
- 📊 Dashboard Summary APIs
- 📈 Trends (Monthly / Weekly)
- 🧾 Category-wise Aggregation
- ⚡ Optimized Queries with Prisma

---

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Zod (Validation)

---

### Example Endpoint

---

## 🔐 Authentication

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | /api/v1/auth/register | Register user |
| POST   | /api/v1/auth/login    | Login user    |

---

## 💰 Financial Records

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /api/v1/records     | Create record    |
| GET    | /api/v1/records     | Get user records |
| PUT    | /api/v1/records/:id | Update record    |
| PATCH  | /api/v1/records/:id | Delete record    |

---

## 💰 Dashboard APIs

| Method | Endpoint                        | Access         | Description   |
| ------ | ------------------------------- | -------------- | ------------- |
| GET    | /api/v1/dashboard/summary       | Admin          | Create record |
| GET    | /api/v1/dashboard/category-wise | Admin, Analyst | Get dashboard |
| GET    | /api/v1/dashboard/recent        | Admin          | Update record |
| GET    | /api/v1/dashboard/period        | Admin          | Delete record |

---

## 👥 User Management APIs (Admin Only)

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/v1/users     | Get all users  |
| GET    | /api/v1/users/:id | Get user by ID |
| PUT    | /api/v1/users/:id | Update user    |
| PATCH  | /api/v1/users/:id | Delete user    |

---

---

## 🔐 Roles & Permissions

### 👤 Viewer

- Can view dashboard summary only

### 📊 Analyst

- Can view records
- Can access insights

### 🛡 Admin

- Full access
- Manage users
- Create, update, delete records

---

## ⚙️ Middleware Used

- Authentication Middleware
- Rate Limiter (login + API)
- Zod Request Validation
- Global Error Handler

---

## ⚙️ Setup

````bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install


---

## 👥 Roles & Permissions

### 👤 Viewer
- Manage own financial records
- View dashboard

### 📊 Analyst (Optional)
- View aggregated data

### 🛡 Admin
- Manage users
- Access all data

---

## ⚙️ Setup

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
````

DATABASE_URL=your_db_url
PORT=5000
SESSION_SECRET=your_secret
