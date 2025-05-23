package controllers

import (
    "github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/config"
    "github.com/gofiber/fiber/v2"
	)


	// GetPartByID retrieves a single part by ID
	func GetPartByID(c *fiber.Ctx) error {
		id := c.Params("id")
	
		var part models.CarPart
		result := config.DB.First(&part, id)
	
		if result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "car part not found"})
		}
	
		return c.JSON(part)
	}
	

	func GetParts(c *fiber.Ctx) error {
		var parts []models.CarPart
		
		// Use Preload to fetch related RepairShops
		result := config.DB.Find(&parts)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch parts"})
		}
		
		return c.JSON(parts)
	}

	// func CreatePart(c *fiber.Ctx) error {
	// 	var part models.CarPart
		
	// 	// Parse the JSON request body into the model struct
	// 	if err := c.BodyParser(&part); err != nil {
	// 		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	// 	}
		
	// 	// Save model to database
	// 	result := config.DB.Create(&part)
		
	// 	if result.Error != nil {
	// 		return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
	// 	}
		
	// 	// Return the newly created model
	// 	return c.Status(201).JSON(part)
	// }

	func CreatePartWithShop(c *fiber.Ctx) error {
		var request struct {
			Name         string  `json:"name"`
			Image        string  `json:"image"`
			Size         string  `json:"size"`
			Price        float64 `json:"price"`
			Condition    string  `json:"condition"`
			CarModelID   uint    `json:"car_model_id"`
			RepairShopID uint    `json:"repair_shop_id"`
			Stock        int     `json:"stock"`
			ShopPrice    float64 `json:"shop_price"`
		}
	
		// Parse the JSON request body
		if err := c.BodyParser(&request); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}
	
		// Create CarPart
		carPart := models.CarPart{
			Name:       request.Name,
			Image:      "https://fixit-wxa9.onrender.com/uploads/" + request.Image,
			Size:       request.Size,
			Price:      request.Price,
			Condition:  request.Condition,
			CarModelID: request.CarModelID,
		}
	
		// Save CarPart to DB
		if err := config.DB.Create(&carPart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to create car part"})
		}
	
		// Create ShopPart (mapping part to shop)
		shopPart := models.ShopPart{
			RepairShopID: request.RepairShopID,
			CarPartID:    carPart.ID, // Use the newly created CarPart ID
			Stock:        request.Stock,
			Price:        request.ShopPrice,
		}
	
		// Save ShopPart to DB
		if err := config.DB.Create(&shopPart).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to create shop part"})
		}
	
		return c.Status(201).JSON(fiber.Map{
			"message":   "Car part and shop part created successfully",
			"carPart":   carPart,
			"shopPart":  shopPart,
		})
	}
	
	
	

	// Updatepart ...
func UpdatePart(c *fiber.Ctx) error {
	id := c.Params("id")
	var part models.CarPart
	
	// Parse the JSON request body into the model struct
	if err := c.BodyParser(&part); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	
	// Update part in database
	result := config.DB.Model(&models.CarPart{}).Where("id = ?", id).Updates(part)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "part not found"})
	}
	
	return c.Status(200).JSON(fiber.Map{"message": "part updated successfully"})
}

// func UpdatePart(c *fiber.Ctx) error {
//     id := c.Params("id")
//     var part models.CarPart

//     // Parse the JSON request body
//     if err := c.BodyParser(&part); err != nil {
//         return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Append a string to the Name or another field
//     part.Image = "http://localhost/5000/uploads"+ part.Image  

//     // Update part in database
//     result := config.DB.Model(&models.CarPart{}).Where("id = ?", id).Updates(part)

//     if result.Error != nil {
//         return c.Status(404).JSON(fiber.Map{"error": "Part not found"})
//     }

//     return c.Status(200).JSON(fiber.Map{"message": "Part updated successfully"})
// }


// Delete parts ...
func DeletePart(c *fiber.Ctx) error {
	id := c.Params("id")
	
	result := config.DB.Debug().Delete(&models.CarPart{}, id)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Part not found"})
	}
	
	return c.Status(204).JSON(fiber.Map{"message": "Part deleted successfully"})
}

// Add .Unscoped() to permanently delete