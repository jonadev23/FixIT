package controllers

import (
    "github.com/gofiber/fiber/v2"
    "github.com/jonadev23/backend-project/models" // Change this to your actual project path
    "github.com/jonadev23/backend-project/config" // Import your database connection
)

// GetCarParts returns all car parts with name, price, and image
func GetCarParts(c *fiber.Ctx) error {
    var carParts []models.CarPart

    err := config.DB.Preload("CarModel").Find(&carParts).Error
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to fetch car parts",
        })
    }

    baseURL := "http://localhost:5000" // Replace with your server's base URL

    var response []map[string]interface{}
    for _, part := range carParts {
        imagePath := ""
        if part.Image != "" {
            imagePath = baseURL + "/" + part.Image // Append full URL
        }

        response = append(response, map[string]interface{}{
            "id":    part.ID,
            "name":  part.Name,
            "image": imagePath,
            "price": part.Price,
            "size":  part.Size,
        })
    }

    return c.JSON(response)
}

