package handlers

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/dgrijalva/jwt-go"
    "github.com/your-username/admin-dashboard-backend/models"
)

// Change this to a strong secret key
var jwtKey = []byte("my_secret_key")

// Hardcoded admin user for now
var adminUser = models.User{
    Email:    "admin@example.com",
    Password: "admin123",
}

// JWT Claims structure
type Claims struct {
    Email string `json:"email"`
    jwt.StandardClaims
}

// Login Handler
func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var user models.User

    // Decode request body
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    // Check email and password
    if user.Email != adminUser.Email || user.Password != adminUser.Password {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Create JWT token
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Email: adminUser.Email,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        http.Error(w, "Could not generate token", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

// Protected Route Handler
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")
    if tokenString == "" {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"message": "Welcome to Admin Dashboard"})
}
