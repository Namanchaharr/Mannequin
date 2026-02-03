# Mannequin

A minimalist 3D mannequin product showcase.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Go, Gorilla Mux
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose

## Quick Start (Pre-requisite: Docker)

1.  **Clone and Start**
    ```bash
    git clone https://github.com/Namanchaharr/mannequin.git
    cd mannequin
    docker-compose up --build
    ```

    *This starts PostgreSQL, Go API server, and React frontend.*

2.  **View Access**
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **API**: [http://localhost:8080](http://localhost:8080)
    - **Products Endpoint**: [http://localhost:8080/api/products](http://localhost:8080/api/products)

## Manual Setup (Without Docker)

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 16+

### Backend
```bash
cd go-server
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/mannequin?sslmode=disable"
go run main.go
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/products` | Get all products |
| GET | `/images/{filename}` | Static image serving |
