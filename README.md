# 📊 Financial Records API

### Role-Based Backend with Dashboard Analytics

A backend system to manage financial records (income & expenses) with role-based access and advanced dashboard summary APIs.

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

## 🔐 Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

## 💰 Financial Records

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| POST   | /api/records     | Create record    |
| GET    | /api/records     | Get user records |
| PATCH  | /api/records/:id | Update record    |
| DELETE | /api/records/:id | Delete record    |

---

## 📊 Dashboard APIs

Provides aggregated data for analytics:

- Total Income
- Total Expenses
- Net Balance
- Category-wise Totals
- Recent Activity
- Monthly / Weekly Trends

### Example Endpoint

---

## 💰 Financial Records APIs

| Method | Endpoint         | Access         | Description   |
| ------ | ---------------- | -------------- | ------------- |
| POST   | /api/records     | Admin          | Create record |
| GET    | /api/records     | Admin, Analyst | Get records   |
| PUT    | /api/records/:id | Admin          | Update record |
| DELETE | /api/records     | Admin          | Delete record |

---

---

## 💰 Financial Records APIs

| Method | Endpoint         | Access         | Description   |
| ------ | ---------------- | -------------- | ------------- |
| POST   | /api/records     | Admin          | Create record |
| GET    | /api/records     | Admin, Analyst | Get records   |
| PUT    | /api/records/:id | Admin          | Update record |
| DELETE | /api/records     | Admin          | Delete record |

---

## 👥 User Management APIs (Admin Only)

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| GET    | /api/users     | Get all users  |
| GET    | /api/users/:id | Get user by ID |
| PUT    | /api/users/:id | Update user    |
| DELETE | /api/users/:id | Delete user    |

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
