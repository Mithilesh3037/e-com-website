# NexShop - Full-Stack E-Commerce App

A production-ready e-commerce application built with React, Node.js, Express, and MySQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL + Sequelize ORM |
| Auth | JWT + bcryptjs |
| State | React Context API |

## Project Structure

```
ecommerce-app/
├── client/              # React Frontend
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar, ProductCard, Spinner, ProtectedRoute
│       ├── context/     # AuthContext, CartContext
│       └── pages/       # All page components
│           └── admin/   # Admin-only pages
└── server/              # Node.js Backend
    ├── config/          # Database connection
    ├── controllers/     # Route handlers
    ├── middleware/       # Auth & Admin middleware
    ├── models/          # Sequelize models
    ├── routes/          # Express routers
    └── seeders/         # Seed data
```

## Setup Instructions

### 1. MySQL Database

Create the database before running:
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Configure Environment

Edit `/server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword   ← change this!
DB_NAME=ecommerce_db
JWT_SECRET=supersecretjwtkey2024ecommerce
```

### 3. Install & Run Server

```bash
cd server
npm install
npm run seed     # Seeds DB with 12 products + 2 users
npm run dev      # Starts on http://localhost:5000
```

### 4. Install & Run Client

```bash
cd client
npm install
npm run dev      # Starts on http://localhost:5173
```

## Demo Accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@shop.com       | admin123  |
| User  | john@example.com     | user123   |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login & get JWT
- `GET  /api/auth/me` — Get current user (protected)

### Products
- `GET    /api/products` — List products (search, filter, paginate)
- `GET    /api/products/:id` — Get single product
- `POST   /api/products` — Create product (Admin)
- `PUT    /api/products/:id` — Update product (Admin)
- `DELETE /api/products/:id` — Delete product (Admin)

### Orders
- `POST /api/orders` — Place order (User)
- `GET  /api/orders/user` — Get my orders (User)
- `GET  /api/orders` — All orders (Admin)
- `PUT  /api/orders/:id` — Update order status (Admin)

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 🛒 Cart with localStorage persistence
- 📦 Order placement with stock deduction
- 👑 Admin dashboard with revenue stats
- 🔍 Product search & category filtering
- 📄 Pagination
- 🔔 Toast notifications
- 📱 Fully responsive design
- 🌙 Premium dark theme with glassmorphism
