package controllers

import (
    "github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
    "github.com/gofiber/fiber/v2"
	)

func GetShops(c *fiber.Ctx) error {
    var shops []models.RepairShop
    // Preload RepairShops to ensure they are fetched
	result := config.DB.Find(&shops)

    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch shops"})
    }

    return c.JSON(shops)
}