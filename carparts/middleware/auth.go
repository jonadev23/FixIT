package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/controllers"
)

// AuthRequired middleware checks for valid JWT token
func AuthRequired(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized - No token provided",
		})
	}

	claims := &controllers.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.GetEnv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized - Invalid token",
		})
	}

	// Store user info in context for later use
	c.Locals("userID", claims.UserID)
	c.Locals("userRole", claims.Role)
	
	return c.Next()
}

// AdminRequired middleware checks for admin role
func AdminRequired(c *fiber.Ctx) error {
	// First check regular authentication
	if err := AuthRequired(c); err != nil {
		return err
	}

	// Then verify admin role
	role := c.Locals("userRole").(string)
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden - Admin access required",
		})
	}

	return c.Next()
}