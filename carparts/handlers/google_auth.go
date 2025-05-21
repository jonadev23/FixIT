package handlers

import (
	"context"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
	"google.golang.org/api/idtoken"
	"gorm.io/gorm"
)

type GoogleTokenRequest struct {
	Token string `json:"token"`
}

func GoogleAuthHandler(c *fiber.Ctx) error {
	var body GoogleTokenRequest
	if err := c.BodyParser(&body); err != nil || body.Token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	payload, err := idtoken.Validate(context.Background(), body.Token, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid Google token",
		})
	}

	email, _ := payload.Claims["email"].(string)
	firstName, _ := payload.Claims["given_name"].(string)
	lastName, _ := payload.Claims["family_name"].(string)

	var user models.User
	err = config.DB.Where("email = ?", email).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			user = models.User{
				FirstName: firstName,
				LastName:  lastName,
				Email:     email,
				Role:      "user",
				Phone:     nil,
				}
			if err := config.DB.Create(&user).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create user",
				})
			}
		} else {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Database error",
			})
		}
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Token generation failed",
		})
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		HTTPOnly: true,
		Secure:   false, // Set to true in production
		SameSite: "Lax",
		Path:     "/",
		Expires:  time.Now().Add(72 * time.Hour),
	})

	// Return response
	return c.JSON(fiber.Map{
		"message": "Authenticated successfully",
		"user": fiber.Map{
			"id":         user.ID,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"email":      user.Email,
		},
	})
}
