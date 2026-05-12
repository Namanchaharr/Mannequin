# Express Server (Backend)

A Node.js + Express backend with JWT authentication, PostgreSQL, and integration testing using Jest + Supertest.

---

# Features

- JWT Authentication
- PostgreSQL Database
- REST API with Express
- Post Creation System
- User-based Post Fetching
- SQL JOIN queries for enriched post responses
- Integration Testing with Jest + Supertest
- Separate development and test databases
- Structured controller/model architecture

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Jest
- Supertest

---

# Setup Instructions

## 1. Clone the repository

```bash
cd express-server
```

---

## 2. Install dependencies

```bash
npm install
```

---

# Environment Setup

Create a `.env` file in the project root:

```env
PORT=5000

DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=dev_db
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

# Database Setup (Development)

## Create development database

```bash
sudo -u postgres psql -c "CREATE DATABASE dev_db;"
```

---

## Load schema

```bash
sudo -u postgres psql -d dev_db -f db/schema.sql
```

---

# Test Environment Setup

## Create test database

```bash
sudo -u postgres psql -c "CREATE DATABASE test_db;"
```

---

## Load schema into test database

```bash
sudo -u postgres psql -d test_db -f db/schema.sql
```

---

## Create `.env.test`

```env
PORT=5000

DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=test_db
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=test_secret
JWT_EXPIRES_IN=1h
```

---

# Run the Server

```bash
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

---

# Run Tests

```bash
npm test
```

Tests use:

- isolated PostgreSQL test database (`test_db`)
- clean database state before execution
- integration testing with real API requests

---

# API Endpoints

## Authentication

| Method | Endpoint          | Description             | Protected |
| ------ | ----------------- | ----------------------- | ---------- |
| POST   | `/auth/signup`    | Register new user       | No |
| POST   | `/auth/login`     | Login and get JWT token | No |
| GET    | `/auth/protected` | Protected test route    | Yes |

---

## Posts

| Method | Endpoint         | Description                  | Protected |
| ------ | ---------------- | ---------------------------- | ---------- |
| POST   | `/posts`         | Create a new post            | Yes |
| GET    | `/posts`         | Get all posts                | No |
| GET    | `/posts/:userId` | Get all posts from one user  | No |

---

# Authentication

Protected routes require a JWT token.

Example request header:

```http
Authorization: Bearer <jwt_token>
```

---

# Example Create Post Request

## Request

```http
POST /posts
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Body

```json
{
  "image_url": "https://example.com/image.jpg",
  "caption": "My first post"
}
```

---

# Example Post Response

```json
{
  "id": 1,
  "image_url": "https://example.com/image.jpg",
  "caption": "My first post",
  "created_at": "2026-05-13T12:00:00.000Z",
  "user_id": 1,
  "username": "testuser",
  "profile_pic": null
}
```

---

# Testing

Current integration tests cover:

- User signup
- Duplicate signup validation
- Login flow
- Invalid login attempts
- JWT protected routes
- Post creation
- Post fetching
- User-specific post fetching
- Edge case validation

Testing stack:

- Jest
- Supertest
- PostgreSQL (`test_db`)

---

# Project Structure

```bash
express-server/
├── config/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── tests/
│   └── helpers/
├── app.js
├── server.js
└── package.json
```

---

# Notes

- `.env` and `.env.test` are ignored from git
- Always update `db/schema.sql` when schema changes
- Tests run with `NODE_ENV=test`
- PostgreSQL foreign keys enforce relational integrity
- Controllers use structured error handling
- JWT authentication is handled through middleware

---

# Future Improvements

Planned features:

- Delete posts with ownership authorization
- Update posts
- Tags system
- Pagination
- Image uploads (S3 / Cloudinary)
- Nested API responses
- Role-based authorization

---