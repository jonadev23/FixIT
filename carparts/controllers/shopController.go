package controllers

import (
    "github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
    "github.com/gofiber/fiber/v2"
	)

// GetShopByID retrieves a single shop by ID
func GetShopByID(c *fiber.Ctx) error {
    id := c.Params("id")

    var shop models.RepairShop
    result := config.DB.First(&shop, id)

    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Shop not found"})
    }

    return c.JSON(shop)
}

// get alls shops
func GetShops(c *fiber.Ctx) error {
    var shops []models.RepairShop
    // Preload RepairShops to ensure they are fetched
	result := config.DB.Find(&shops)

    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch shops"})
    }

    return c.JSON(shops)
}

func CreateShop(c *fiber.Ctx) error {
    var shop models.RepairShop
    
    // Parse the JSON request body into the shop struct
    if err := c.BodyParser(&shop); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
    }
    
    // Save shop to database
    result := config.DB.Create(&shop)
    
    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
    }
    
    // Return the newly created shop
    return c.Status(201).JSON(shop)
}

// UpdateShop ...
func UpdateShop(c *fiber.Ctx) error {
id := c.Params("id")
var shop models.RepairShop

// Parse the JSON request body into the shop struct
if err := c.BodyParser(&shop); err != nil {
    return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
}

// Update shop in database
result := config.DB.Model(&models.RepairShop{}).Where("id = ?", id).Updates(shop)

if result.Error != nil {
    return c.Status(404).JSON(fiber.Map{"error": "Shop not found"})
}

return c.Status(200).JSON(fiber.Map{"message": "Shop updated successfully"})
}

// DeleteShop ...
func DeleteShop(c *fiber.Ctx) error {
id := c.Params("id")

result := config.DB.Delete(&models.RepairShop{}, id)

if result.Error != nil {
    return c.Status(404).JSON(fiber.Map{"error": "Shop not found"})
}

return c.Status(204).JSON(fiber.Map{"message": "Shop deleted successfully"})
}