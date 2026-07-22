# Express Server (Backend)

A Node.js + Express backend featuring JWT authentication, PostgreSQL, relational post management, and integration testing with Jest and Supertest.

---

# Features

* JWT Authentication
* PostgreSQL Database
* RESTful API with Express
* User Registration and Login
* Post Creation
* Post Updates
* Individual Post Fetching
* User-based Post Fetching
* Post Links Support
* Relational Post Aggregation with User and Link Data
* Integration Testing with Jest + Supertest
* Separate Development and Test Databases
* Structured Controller / Service Architecture

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* Jest
* Supertest

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone <repository-url>
cd express-server
```

---

## 2. Install Dependencies

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

## Create Development Database

```bash
sudo -u postgres psql -c "CREATE DATABASE dev_db;"
```

## Load Schema

```bash
sudo -u postgres psql -d dev_db -f db/schema.sql
```

---

# Test Environment Setup

## Create Test Database

```bash
sudo -u postgres psql -c "CREATE DATABASE test_db;"
```

## Load Schema into Test Database

```bash
sudo -u postgres psql -d test_db -f db/schema.sql
```

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

# Running the Server

Start the development server:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

---

# Running Tests

```bash
npm test
```

Tests use:

* An isolated PostgreSQL test database (`test_db`)
* A clean database state before execution
* Real HTTP requests through Supertest
* End-to-end API integration testing

---

# Database Relationships

```text
users (1) ────< posts (1) ────< post_links
```

Current tables:

* users
* posts
* post_links

---

# API Endpoints

## Authentication

| Method | Endpoint          | Description                 | Protected |
| ------ | ----------------- | --------------------------- | --------- |
| POST   | `/auth/signup`    | Register a new user         | No        |
| POST   | `/auth/login`     | Login and receive JWT token | No        |
| GET    | `/auth/protected` | Protected test route        | Yes       |

---

## Posts

| Method | Endpoint              | Description                     | Protected |
| ------ | --------------------- | ------------------------------- | --------- |
| POST   | `/posts`              | Create a new post               | Yes       |
| GET    | `/posts`              | Get all posts                   | No        |
| GET    | `/posts/:id`          | Get a single post by ID         | No        |
| GET    | `/posts/user/:userId` | Get all posts created by a user | No        |
| PUT    | `/posts/:id`          | Update a post (owner only)      | Yes       |

---

# Authentication

Protected routes require a valid JWT token.

Example request header:

```http
Authorization: Bearer <jwt_token>
```

---

# Example Create Post Request

### Request

```http
POST /posts
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Body

```json
{
  "image_url": "https://example.com/image.jpg",
  "caption": "My first post",
  "links": [
    {
      "text": "@john",
      "url": "/users/john"
    },
    {
      "text": "GitHub",
      "url": "https://github.com/gariman"
    }
  ]
}
```

Notes:

* `links` is optional
* A post can contain zero or more links
* Each link contains display text and a destination URL

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
  "profile_pic": null,
  "links": [
    {
      "text": "@john",
      "url": "/users/john"
    },
    {
      "text": "GitHub",
      "url": "https://github.com/gariman"
    }
  ]
}
```

---

# Testing

Current integration tests cover:

* User signup
* Duplicate signup validation
* Login flow
* Invalid login attempts
* JWT-protected routes
* Post creation
* Post creation with links
* Post updates
* Post fetching by ID
* User-specific post fetching
* Post aggregation with links
* Edge case validation

Testing stack:

* Jest
* Supertest
* PostgreSQL (`test_db`)

---

# Project Structure

```text
express-server/
├── config/
├── controllers/
├── db/
├── middlewares/
├── routes/
├── services/
├── tests/
│   └── helpers/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# Notes

* `.env` and `.env.test` are excluded from Git
* Always update `db/schema.sql` when schema changes
* Tests run with `NODE_ENV=test`
* PostgreSQL foreign keys enforce relational integrity
* Controllers use structured error handling
* Authentication is handled through middleware
* Database access is separated into service-layer functions

---

# Future Improvements

Planned features:

* Delete posts with ownership authorization
* Pagination
* Image uploads (Cloudinary / S3)
* Role-based authorization
* Notifications
* Automatic user mention parsing
* Comments
* Likes
* Bookmarks
* Follow system





sudo -u postgres psql -c "DROP DATABASE IF EXISTS dev_db;" && \
sudo -u postgres psql -c "DROP DATABASE IF EXISTS test_db;" && \
sudo -u postgres psql -c "CREATE DATABASE dev_db;" && \
sudo -u postgres psql -c "CREATE DATABASE test_db;" && \
sudo -u postgres psql -d dev_db -f db/schema.sql && \
sudo -u postgres psql -d test_db -f db/schema.sql