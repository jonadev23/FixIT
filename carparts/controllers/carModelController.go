package controllers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
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

// GetCarParts returns all car parts with their name, price, size, image, and related car model
func GetAllCarModels(c *fiber.Ctx) error {
	var carModels []models.CarModel

	// Preload the CarModel and its Brand information
	if err := config.DB.Preload("CarBrand").Find(&carModels).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch car models"})
	}

	return c.Status(200).JSON(carModels)
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

// func CreateModel(c *fiber.Ctx) error {
// 	var model models.CarModel

// 	// Parse the JSON request body into the model struct
// 	if err := c.BodyParser(&model); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
// 	}

// 	// Save model to database
// 	result := config.DB.Create(&model)

// 	if result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
// 	}

// 	// Return the newly created model
// 	return c.Status(201).JSON(model)
// }

func CreateModel(c *fiber.Ctx) error {
	// Define a request struct to properly handle the image field
	var request struct {
		Name      string  `json:"name"`
		Make      string  `json:"make"`
		Image     string  `json:"image"`
		Price     float64 `json:"price"`
		Condition string  `json:"condition"`
		Year      string  `json:"year"`
		ImageURL  string  `json:"image_url"` // This will contain just the filename
		BrandID   uint    `json:"brand_id"`
		BrandName string  `json:"brand_name"`
	}

	// Parse the JSON request body
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	// Define the base URL based on the environment
	var imageBaseURL string
	if os.Getenv("ENV") == "production" {
		imageBaseURL = "https://fixit-production-283f.up.railway.app/uploads/"
	} else {
		imageBaseURL = "http://127.0.0.1:5000/uploads/"
	}
	// Create the CarModel with the prefixed image URL
	// https://fixit-wxa9.onrender.com
	model := models.CarModel{
		Name:      request.Name,
		Make:      request.Make,
		Year:      request.Year,
		ImageURL:  imageBaseURL + request.ImageURL,
		BrandID:   request.BrandID,
		BrandName: request.BrandName,
	}

	// Save model to database
	if err := config.DB.Create(&model).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create car model"})
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
