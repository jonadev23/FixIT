package controllers

import (
    "github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
    "github.com/gofiber/fiber/v2"
	)


	// GetBrandByID retrieves a single brand by ID
	func GetBrandByID(c *fiber.Ctx) error {
		id := c.Params("id")
	
		var brand models.CarBrand
		result := config.DB.First(&brand, id)
	
		if result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "brand not found"})
		}
	
		return c.JSON(brand)
	}
	

	func GetBrands(c *fiber.Ctx) error {
		var brands []models.CarBrand
		
		// Use Preload to fetch related RepairShops
		result := config.DB.Preload("CarModels").Find(&brands)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch brands"})
		}
		
		return c.JSON(brands)
	}

	func CreateBrand(c *fiber.Ctx) error {
		var brand models.CarBrand
		
		// Parse the JSON request body into the brand struct
		if err := c.BodyParser(&brand); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}
		
		// Save brand to database
		result := config.DB.Create(&brand)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
		}
		
		// Return the newly created brand
		return c.Status(201).JSON(brand)
	}

	// UpdateBrand ...
func UpdateBrand(c *fiber.Ctx) error {
	id := c.Params("id")
	var brand models.CarBrand
	
	// Parse the JSON request body into the brand struct
	if err := c.BodyParser(&brand); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	
	// Update brand in database
	result := config.DB.Model(&models.CarBrand{}).Where("id = ?", id).Updates(brand)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Brand not found"})
	}
	
	return c.Status(200).JSON(fiber.Map{"message": "Brand updated successfully"})
}

// DeleteBrand ...
func DeleteBrand(c *fiber.Ctx) error {
	id := c.Params("id")
	
	result := config.DB.Debug().Delete(&models.CarBrand{}, id)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Brand not found"})
	}
	
	return c.Status(204).JSON(fiber.Map{"message": "Brand deleted successfully"})
}

// Add .Unscoped() to permanently delete