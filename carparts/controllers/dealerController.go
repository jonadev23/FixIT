package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
)

// GetDealerByID retrieves a single dealer by ID
	func GetDealerByID(c *fiber.Ctx) error {
		id := c.Params("id")
	
		var dealer models.Dealer
		result := config.DB.Preload("RepairShop").First(&dealer, id)
	
		if result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Dealer not found"})
		}
	
		return c.JSON(dealer)
	}
	

	func GetDealers(c *fiber.Ctx) error {
		var dealers []models.Dealer
		
		// Use Preload to fetch related RepairShops
		result := config.DB.Preload("RepairShop").Find(&dealers)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch dealers"})
		}
		
		return c.JSON(dealers)
	}

	func CreateDealer(c *fiber.Ctx) error {
		var dealer models.Dealer
		
		// Parse the JSON request body into the dealer struct
		if err := c.BodyParser(&dealer); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}
		
		// Save dealer to database
		result := config.DB.Create(&dealer)
		
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
		}
		
		// Return the newly created dealer
		return c.Status(201).JSON(dealer)
	}

	// UpdateDealer ...
func UpdateDealer(c *fiber.Ctx) error {
	id := c.Params("id")
	var dealer models.Dealer
	
	// Parse the JSON request body into the dealer struct
	if err := c.BodyParser(&dealer); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	
	// Update dealer in database
	result := config.DB.Model(&models.Dealer{}).Where("id = ?", id).Updates(dealer)
	
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Dealer not found"})
	}
	
	return c.Status(200).JSON(fiber.Map{"message": "Dealer updated successfully"})
}

// DeleteDealer ...
// func DeleteDealer(c *fiber.Ctx) error {
// 	id := c.Params("id")
	
// 	result := config.DB.Debug().Delete(&models.Dealer{}, id)
	
// 	if result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Dealer not found"})
// 	}
	
// 	return c.Status(204).JSON(fiber.Map{"message": "Dealer deleted successfully"})
// }

// DeleteDealer handler with transaction
func DeleteDealer(c *fiber.Ctx) error {
    id := c.Params("id")
    
    // Start a transaction
    tx := config.DB.Begin()
    
    // First delete the dealer (this should cascade to repair shop)
    result := tx.Debug().Delete(&models.Dealer{}, id)
    
    if result.Error != nil {
        tx.Rollback()
        return c.Status(404).JSON(fiber.Map{"error": "Dealer not found"})
    }
    
    if result.RowsAffected == 0 {
        tx.Rollback()
        return c.Status(404).JSON(fiber.Map{"error": "Dealer not found"})
    }
    
    // Commit the transaction
    tx.Commit()
    
    return c.Status(204).JSON(fiber.Map{"message": "Dealer and associated repair shop deleted successfully"})
}

// Add .Unscoped() to permanently delete