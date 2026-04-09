# 📊 Financial Records API

### Role-Based Backend with Dashboard Analytics

A robust backend system built with Express.js, PostgreSQL, and Prisma to manage financial records (income & expenses) with granular Role-Based Access Control (RBAC) and real-time dashboard analytics.

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

### 🔐 Security & Access Control

- RBAC (Admin, Analyst, Viewer): Strict access control based on user roles.

- Better Auth & JWT: Secure session management and stateless authorization.

- Rate Limiting: Protects against brute-force attacks on login and API endpoints.

- Admin Seeding: Public admin registration is disabled; access is managed via secure seeding.

### 💰 Financial & Analytics

- Record Management: Full CRUD for income/expenses with Soft Delete support.

- Advanced Aggregations: Prisma-optimized queries for category-wise insights, monthly/weekly trends, and summaries.

- Zod Validation: Type-safe request validation for all incoming data.

### 🛡 System Architecture

- Modular Design: Clean separation of concerns (Controllers, Services, Middlewares).

- Global Error Handling: Consistent API response structure for all error types.

### 🛠 Tech Stack

- Runtime: Node.js

- Framework: Express.js

- Database: PostgreSQL

- ORM: Prisma

- Validation: Zod

- Auth: Better Auth / JWT

---

### 📄 API Documentation

- Full Postman / API docs for this project can be accessed here:

🔗 [View API Docs](https://documenter.getpostman.com/view/15110840/2sBXitBS4a)

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
| GET    | /api/v1/dashboard/recent        | All    | Get recent record         |
| GET    | /api/v1/dashboard/period        | All    | Get period wise records   |

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

| Feature               | Viewer | Analyst | Admin |
| --------------------- | :----: | :-----: | :---: |
| View Dashboard        |   ✅   |   ✅    |  ✅   |
| View Detailed Records |   ❌   |   ✅    |  ✅   |
| Create/Edit Records   |   ❌   |   ❌    |  ✅   |
| Manage Users          |   ❌   |   ❌    |  ✅   |

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
