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
* Post Deletion
* Individual Post Fetching
* User-based Post Fetching
* Ownership Authorization
* Post Links Support
* Relational Post Aggregation with User and Link Data
* Integration Testing with Jest + Supertest
* Separate Development and Test Databases
* Layered Route → Middleware → Controller → Model Architecture

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

# Reset Databases

If you need to recreate both development and test databases:

```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS dev_db;" && \
sudo -u postgres psql -c "DROP DATABASE IF EXISTS test_db;" && \
sudo -u postgres psql -c "CREATE DATABASE dev_db;" && \
sudo -u postgres psql -c "CREATE DATABASE test_db;" && \
sudo -u postgres psql -d dev_db -f db/schema.sql && \
sudo -u postgres psql -d test_db -f db/schema.sql
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

| Method | Endpoint | Description | Protected |
| ------ | -------- | ----------- | --------- |
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |
| GET | `/auth/protected` | Protected test route | Yes |

---

## Posts

| Method | Endpoint | Description | Protected |
| ------ | -------- | ----------- | --------- |
| POST | `/posts` | Create a new post | Yes |
| GET | `/posts` | Get all posts | No |
| GET | `/posts/:id` | Get a single post by ID | No |
| GET | `/posts/user/:userId` | Get all posts created by a user | No |
| PATCH | `/posts/:id` | Update a post (owner only) | Yes |
| DELETE | `/posts/:id` | Delete a post (owner only) | Yes |

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

# Middleware

### authMiddleware

- Verifies JWT tokens
- Attaches the authenticated user to `req.user`

### validatePostOwnership

- Ensures a post exists
- Ensures only the owner can update or delete a post

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
* Post deletion
* Post fetching by ID
* User-specific post fetching
* Post aggregation with links
* Ownership validation
* Delete authorization
* Database cascade deletion
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
├── models/
├── routes/
├── tests/
│   └── helpers/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# Architecture

```text
HTTP Request
      │
      ▼
Routes
      │
      ▼
Middleware
(Authentication / Authorization)
      │
      ▼
Controllers
(Request Handling)
      │
      ▼
Models
(Database Queries)
      │
      ▼
PostgreSQL
```

Responsibilities:

* **Routes** define API endpoints and middleware chains.
* **Middleware** handles authentication and ownership validation.
* **Controllers** process requests and return HTTP responses.
* **Models** encapsulate all PostgreSQL database queries.

---

# Notes

* `.env` and `.env.test` are excluded from Git
* Always update `db/schema.sql` when schema changes
* Tests run with `NODE_ENV=test`
* PostgreSQL foreign keys enforce relational integrity
* Controllers use structured error handling
* Authentication is handled through middleware
* Database access is separated into reusable model functions
* Ownership validation is shared between update and delete endpoints

---

# Future Improvements

Planned features:

* Pagination
* Image uploads (Cloudinary / S3)
* Notifications
* Automatic user mention parsing
* Comments
* Likes
* Bookmarks
* Follow system
* User profiles
* Search
* Admin moderation tools
* CI/CD (GitHub Actions / Jenkins)


sudo -u postgres psql -c "DROP DATABASE IF EXISTS dev_db;" && \
sudo -u postgres psql -c "DROP DATABASE IF EXISTS test_db;" && \
sudo -u postgres psql -c "CREATE DATABASE dev_db;" && \
sudo -u postgres psql -c "CREATE DATABASE test_db;" && \
sudo -u postgres psql -d dev_db -f db/schema.sql && \
sudo -u postgres psql -d test_db -f db/schema.sql