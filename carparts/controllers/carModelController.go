package controllers

import (
    "github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
    "github.com/gofiber/fiber/v2"
	)


	// GetModelByID retrieves a single model by ID
	func GetModelByID(c *fiber.Ctx) error {
		id := c.Params("id")
	
		var model models.CarModel
		result := config.DB.First(&model, id)
	
		if result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "model not found"})
		}
	
		return c.JSON(model)
	}
	

	func GetModels(c *fiber.Ctx) error {
		var models []models.CarModel
		
		// Use Preload to fetch related RepairShops
		result := config.DB.Find(&models)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch models"})
		}
		
		return c.JSON(models)
	}

	func CreateModel(c *fiber.Ctx) error {
		var model models.CarModel
		
		// Parse the JSON request body into the model struct
		if err := c.BodyParser(&model); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}
		
		// Save model to database
		result := config.DB.Create(&model)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
		}
		
		// Return the newly created model
		return c.Status(201).JSON(model)
	}

	// Updatemodel ...
func UpdateModel(c *fiber.Ctx) error {
	id := c.Params("id")
	var model models.CarModel
	
	// Parse the JSON request body into the model struct
	if err := c.BodyParser(&model); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	
	// Update model in database
	result := config.DB.Model(&models.CarModel{}).Where("id = ?", id).Updates(model)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "model not found"})
	}
	
	return c.Status(200).JSON(fiber.Map{"message": "model updated successfully"})
}

// Deletemodel ...
func DeleteModel(c *fiber.Ctx) error {
	id := c.Params("id")
	
	result := config.DB.Debug().Delete(&models.CarModel{}, id)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "model not found"})
	}
	
	return c.Status(204).JSON(fiber.Map{"message": "model deleted successfully"})
}

// Add .Unscoped() to permanently delete