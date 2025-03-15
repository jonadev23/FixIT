package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/utils"
	
)

// Hardcoded admin user
var adminUser = models.User{
	Email:    "admin@example.com",
	Password: "admin123",
}

// JWT Claims structure
type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}


// Login payload
type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Register payload
type RegisterInput struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
}

// Register user
func Register(c *fiber.Ctx) error {
	var input RegisterInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Server error"})
	}

	user := models.User{
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Email:     input.Email,
		Password:  hashedPassword,
		Role:      input.Role,
	}

	config.DB.Create(&user)
	return c.JSON(user)
}

// Login user
func Login(c *fiber.Ctx) error {
    var input LoginInput

    // Parse JSON request
    if err := c.BodyParser(&input); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid request",
        })
    }

    // Retrieve user from database
    var user models.User
    config.DB.Where("email = ?", input.Email).First(&user)

    // Check if user exists
    if user.ID == 0 {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Invalid credentials",
        })
    }

   // Compare provided password with hashed password
if !utils.CheckPasswordHash(input.Password, user.Password) {
    return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
        "error": "Invalid credentials",
    })
}
    // Create JWT token
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Email: user.Email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(expirationTime),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Could not generate token",
        })
    }

    return c.JSON(fiber.Map{"token": tokenString})
}

// Protected Route Handler
func DashboardHandler(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.GetEnv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Welcome to Admin Dashboard",
	})
}
