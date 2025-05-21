package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
)

// UserProfile returns the current user's profile
func UserProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Don't return password hash
	user.Password = ""
	
	return c.JSON(user)
}

// AdminDashboard returns admin-specific data
func AdminDashboard(c *fiber.Ctx) error {
	// Example admin-only data
	dashboardData := fiber.Map{
		"message":       "Welcome to Admin Dashboard",
		"total_users":    getTotalUserCount(),
		"recent_signups": getRecentSignups(),
	}

	return c.JSON(dashboardData)
}

// Helper functions
func getTotalUserCount() int64 {
	var count int64
	config.DB.Model(&models.User{}).Count(&count)
	return count
}

func getRecentSignups() []models.User {
	var users []models.User
	config.DB.Order("created_at desc").Limit(10).Find(&users)
	
	// Remove sensitive data
	for i := range users {
		users[i].Password = ""
	}
	
	return users
}