package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// Product represents a mannequin product
type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Category    string  `json:"category"`
}

// User represents a user account
type User struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	PasswordHash string `json:"-"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents successful login response
type LoginResponse struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}

var db *sql.DB
var jwtSecret = []byte(getJWTSecret())

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "mannequin-secret-key-change-in-production"
	}
	return secret
}

func main() {
	// Connect to PostgreSQL
	initDB()
	defer db.Close()

	r := mux.NewRouter()

	// CORS middleware
	r.Use(corsMiddleware)

	// Auth routes
	r.HandleFunc("/api/login", login).Methods("POST", "OPTIONS")

	// API routes
	r.HandleFunc("/api/products", getProducts).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/products/category/{category}", getProductsByCategory).Methods("GET", "OPTIONS")

	// Static file serving for images
	imagesDir := filepath.Join(".", "images")
	r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir(imagesDir))))

	// Health check
	r.HandleFunc("/", healthCheck).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Go server starting on port %s", port)
	log.Printf("📦 Products API: http://localhost:%s/api/products", port)
	log.Printf("🔐 Login API: http://localhost:%s/api/login", port)
	log.Printf("🖼️  Images served from: http://localhost:%s/images/", port)

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

func initDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres@localhost:5432/mannequin?sslmode=disable"
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL")

	// Create tables if they don't exist
	createTables()
}

func createTables() {
	// Products table
	productQuery := `
	CREATE TABLE IF NOT EXISTS products (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		description TEXT,
		image VARCHAR(500) NOT NULL,
		category VARCHAR(100) DEFAULT ''
	);
	`
	if _, err := db.Exec(productQuery); err != nil {
		log.Fatalf("Error creating products table: %v", err)
	}

	// Add category column if it doesn't exist (for existing DBs)
	addCategoryCol := `ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT '';`
	if _, err := db.Exec(addCategoryCol); err != nil {
		log.Fatalf("Error adding category column: %v", err)
	}

	// Users table
	userQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(100) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL
	);
	`
	if _, err := db.Exec(userQuery); err != nil {
		log.Fatalf("Error creating users table: %v", err)
	}

	// Seed products if empty
	var productCount int
	db.QueryRow("SELECT COUNT(*) FROM products").Scan(&productCount)
	if productCount == 0 {
		seedProducts()
	}

	// Seed users if empty
	var userCount int
	db.QueryRow("SELECT COUNT(*) FROM users").Scan(&userCount)
	if userCount == 0 {
		seedUsers()
	}
}

func seedProducts() {
	baseURL := os.Getenv("IMAGE_BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	products := []struct {
		Product
		Cat string
	}{
		{Product{Name: "Oversized Trench", Price: 129.99, Description: "A structural masterpiece defined by its exaggerated proportions and sharp tailoring. Crafted from premium bonded cotton, this trench features a storm flap and belted waist for a commanding silhouette.", Image: baseURL + "/images/mannequin1.png"}, "outerwear"},
		{Product{Name: "Minimalist Blazer", Price: 89.99, Description: "Stripped back to the essentials. This collarless blazer offers a clean, architectural line that frames the body without restriction. Essential wear for the modern purist.", Image: baseURL + "/images/mannequin2.png"}, "outerwear"},
		{Product{Name: "Textured Knit", Price: 59.99, Description: "Tactile luxury. A heavy-gauge knit with a unique raised pattern that catches the light. Designed for warmth without compromising on a sleek, fitted profile.", Image: baseURL + "/images/mannequin3.png"}, "tops"},
		{Product{Name: "Silk Slip Dress", Price: 110.00, Description: "Fluidity in motion. Bias-cut silk that drapes effortlessly over the form. A timeless piece that transitions seamlessly from day into the deepest night.", Image: baseURL + "/images/mannequin4.png"}, "dresses"},
		{Product{Name: "Structured Coat", Price: 180.00, Description: "Rigid meets refined. Featuring strong shoulders and a nipped-in waist, this coat creates a powerful visual statement. The matte finish adds a touch of understated drama.", Image: baseURL + "/images/mannequin1.png"}, "outerwear"},
		{Product{Name: "Leather Jacket", Price: 250.00, Description: "Rebellious elegance. Soft, buttery leather cut in a moto style but stripped of excessive hardware. The focus is entirely on the quality of material and the precision of the fit.", Image: baseURL + "/images/mannequin2.png"}, "outerwear"},
		{Product{Name: "Black Denim", Price: 60.00, Description: "The foundation of the wardrobe. High-waisted, straight-leg denim in an intense, true black wash. Rigid construction that softens perfectly with wear.", Image: baseURL + "/images/mannequin3.png"}, "bottoms"},
	}

	for _, p := range products {
		_, err := db.Exec(
			"INSERT INTO products (name, price, description, image, category) VALUES ($1, $2, $3, $4, $5)",
			p.Name, p.Price, p.Description, p.Image, p.Cat,
		)
		if err != nil {
			log.Printf("Error seeding product: %v", err)
		}
	}

	log.Println("🌱 Seeded products table")
}

func seedUsers() {
	users := []struct {
		Username string
		Password string
	}{
		{"demo", "demo123"},
		{"admin", "admin123"},
	}

	for _, u := range users {
		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Error hashing password: %v", err)
			continue
		}
		_, err = db.Exec(
			"INSERT INTO users (username, password_hash) VALUES ($1, $2)",
			u.Username, string(hash),
		)
		if err != nil {
			log.Printf("Error seeding user: %v", err)
		}
	}

	log.Println("👤 Seeded users table")
}

func login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Find user
	var user User
	err := db.QueryRow(
		"SELECT id, username, password_hash FROM users WHERE username = $1",
		req.Username,
	).Scan(&user.ID, &user.Username, &user.PasswordHash)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		Token:    tokenString,
		Username: user.Username,
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, price, description, image, category FROM products ORDER BY id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Description, &p.Image, &p.Category); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func getProductsByCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	category := vars["category"]

	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 10
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	// First get all products in this category
	rows, err := db.Query("SELECT id, name, price, description, image, category FROM products WHERE category = $1 ORDER BY id", category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var allProducts []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Description, &p.Image, &p.Category); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		allProducts = append(allProducts, p)
	}

	if len(allProducts) == 0 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]Product{})
		return
	}

	// Cycle products to simulate infinite scroll
	offset := (page - 1) * limit
	result := make([]Product, 0, limit)
	for i := 0; i < limit; i++ {
		idx := (offset + i) % len(allProducts)
		p := allProducts[idx]
		// Give each item a unique virtual ID for frontend keying
		p.ID = offset + i + 1
		result = append(result, p)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Total-Pages", strconv.Itoa(int(math.Max(float64(page+5), 20)))) // Always signal more pages
	json.NewEncoder(w).Encode(result)
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "Mannequin Go API is running",
	})
}
