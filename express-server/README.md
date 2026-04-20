# Express Server (Backend)

A Node.js + Express backend with JWT authentication, PostgreSQL, and testing setup using Jest.

---

## Setup Instructions

### 1. Clone the repository

```bash
cd express-server
```

---

### 2. Install dependencies

```bash
npm install
```

---

## Environment Setup

Create a `.env` file in the root:

```
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=dev_db
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## Database Setup (Development)

### Create database

```bash
psql -U postgres -c "CREATE DATABASE dev_db;"
```

> On Ubuntu (if peer auth fails):

```bash
sudo -u postgres psql -c "CREATE DATABASE dev_db;"
```

---

### Load schema

```bash
psql -U postgres -d dev_db -f db/schema.sql
```

---

## Test Environment Setup

### Create test database

```bash
sudo -u postgres psql -c "CREATE DATABASE test_db;"
```

---

### Load schema into test DB

```bash
sudo -u postgres psql -d test_db -f db/schema.sql
```

---

### Create `.env.test`

```
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=test_db
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=test_secret
JWT_EXPIRES_IN=1h
```

---

## ▶Run the Server

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## Run Tests

```bash
npm test
```

Tests use:

* separate database (`test_db`)
* clean state before execution

---

## API Endpoints

### Auth

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | /auth/signup    | Register new user       |
| POST   | /auth/login     | Login and get JWT token |
| GET    | /auth/protected | Protected test route    |

---

```

---

## Notes

* `.env` and `.env.test` are ignored (not committed)
* Use `.env.example` as a template
* Always update `db/schema.sql` when DB changes
* Tests run in isolation using `test_db`

---


