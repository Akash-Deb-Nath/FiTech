# 📊 Financial Records API

### Role-Based Backend with Dashboard Analytics

A backend system to manage financial records (income & expenses) with role-based access and advanced dashboard summary APIs.

---

Live Link: https://y-khaki-one.vercel.app/

---

## 🚀 Overview

This project demonstrates backend architecture for managing financial data and generating aggregated insights for dashboards.

It focuses on:

- Clean API design
- Aggregation queries
- Role-based access control

---

## ✨ Features

### 🔐 Authentication & Authorization

- Better Auth (session-based authentication)
- JWT-based authorization for protected routes
- Role-based access control (Admin, Analyst, Viewer)

### 💰 Financial Management

- Income & Expense tracking
- Soft delete support
- Secure role-restricted operations

### 📊 Analytics & Dashboard

- Summary aggregation
- Category-wise insights
- Monthly & weekly trends
- Recent transaction tracking

### ⚡ Performance & Security

- Optimized queries using Prisma
- Rate limiting (login & API protection)
- Zod validation for request safety
- Global error handling

### 🛡 System Design

- Modular architecture
- Scalable query handling
- Clean separation of concerns

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

| Method | Endpoint            | Access         | Description                 |
| ------ | ------------------- | -------------- | --------------------------- |
| POST   | /api/v1/records     | Admin          | Create record               |
| GET    | /api/v1/records     | Admin, Analyst | Get user records            |
| PUT    | /api/v1/records/:id | Admin          | Update record               |
| PATCH  | /api/v1/records/:id | Admin          | Delete record (soft delete) |

---

## 💰 Dashboard APIs

| Method | Endpoint                        | Access | Description               |
| ------ | ------------------------------- | ------ | ------------------------- |
| GET    | /api/v1/dashboard/summary       | All    | Get summary of records    |
| GET    | /api/v1/dashboard/category-wise | All    | Get category wise records |
| GET    | /api/v1/dashboard/recent        | All    | Get recnet record          |
| GET    | /api/v1/dashboard/period        | All    | Get weekly wise records   |

---

## 👥 User Management APIs (Admin Only)

| Method | Endpoint          | Access | Description    |
| ------ | ----------------- | ------ | -------------- |
| GET    | /api/v1/users     | Admin  | Get all users  |
| GET    | /api/v1/users/:id | Admin  | Get user by ID |
| PUT    | /api/v1/users/:id | Admin  | Update user    |
| PATCH  | /api/v1/users/:id | Admin  | Delete user    |

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

## 🔑 Admin Credentials (Seeded)

> Public admin registration is disabled for security reasons.

- **Email:** admin@admin.com
- **Password:** Admin12345

---

## ⚙️ Middleware Used

- Authentication Middleware
- Rate Limiter (login + API)
- Zod Request Validation
- Global Error Handler

---

## ⚙️ Setup

```bash
git clone https://github.com/akash-deb-nath/FiTech.git
cd FiTech
npm install

```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:


