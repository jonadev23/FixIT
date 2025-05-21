// controllers/auth.go
package controllers

import (
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v4"
    "github.com/jonadev23/backend-project/config"
    "github.com/jonadev23/backend-project/models"
    "github.com/jonadev23/backend-project/utils"
)

// JWT Claims structure
type Claims struct {
    UserID uint   `json:"user_id"`
    Email  string `json:"email"`
    Role   string `json:"role"`
    jwt.RegisteredClaims
}

// Hardcoded admin credentials
var adminUser = models.User{
    Email:    "admin@example.com",
    Password: "admin123", // This should be hashed in production
    Role:     "admin",
}

// Login payload
type LoginInput struct {
    EmailOrPhone string `json:"email_or_phone"`
    Password     string `json:"password"`
}

func Login(c *fiber.Ctx) error {
    var input LoginInput

    if err := c.BodyParser(&input); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid request",
        })
    }

    var user models.User
    var isAdmin bool

    // Check if it's the hardcoded admin
    if input.EmailOrPhone == adminUser.Email {
        if input.Password != adminUser.Password {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "error": "Invalid credentials",
            })
        }
        user = adminUser
        isAdmin = true
    } else {
        // Check for regular user in database
        result := config.DB.Where("email = ? OR phone = ?", input.EmailOrPhone, input.EmailOrPhone).First(&user)
        
        if result.Error != nil || user.ID == 0 {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "error": "Invalid credentials",
            })
        }

        // Verify password for regular user
        if !utils.CheckPasswordHash(input.Password, user.Password) {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "error": "Invalid credentials",
            })
        }
        isAdmin = false
    }

    // Create JWT token
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Email: user.Email,
        Role:  user.Role,
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

    return c.JSON(fiber.Map{
        "token": tokenString,
        "user": fiber.Map{
            "id":         user.ID,
            "email":      user.Email,
            "phone":      user.Phone,
            "first_name": user.FirstName,
            "last_name":  user.LastName,
            "role":       user.Role,
            "is_admin":   isAdmin,
        },
    })
}

// Register payload
type RegisterInput struct {
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
    Email     string `json:"email"`
    Phone     string `json:"phone"`
    Password  string `json:"password"`
}

func Register(c *fiber.Ctx) error {
    var input RegisterInput
    if err := c.BodyParser(&input); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Prevent registering with admin email
    if input.Email == adminUser.Email {
        return c.Status(400).JSON(fiber.Map{"error": "Cannot register with this email"})
    }

    // Validate email or phone is provided
    if input.Email == "" && input.Phone == "" {
        return c.Status(400).JSON(fiber.Map{"error": "Email or phone is required"})
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
        Phone:     &input.Phone,
        Password:  hashedPassword,
        Role:      "user", // Always set to "user" for registrations
    }

    if err := config.DB.Create(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Could not create user"})
    }

    // Don't return password hash in response
    user.Password = ""
    return c.JSON(user)
}