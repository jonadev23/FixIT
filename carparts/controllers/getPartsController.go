package controllers

import (
	"strconv"
	"strings" // Add this import

	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config" // Database connection
	"github.com/jonadev23/backend-project/models" // Update to match your project path
)

// GetCarParts returns all car parts with their name, price, size, image, and related car model
func GetAllCarParts(c *fiber.Ctx) error {
    var carParts []models.CarPart

    // Preload the CarModel and its Brand information
    if err := config.DB.Preload("CarModel").Find(&carParts).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch car parts"})
    }

    return c.Status(200).JSON(carParts)
}



func GetShopPartByID(c *fiber.Ctx) error {
    id := c.Params("id")

    var part models.ShopPart
    result := config.DB.Preload("RepairShop").First(&part, id)

    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{"error": "shop part not found"})
    }

    return c.JSON(part)
}

// Add this to your routes
 func GetSearchQuery(c *fiber.Ctx) error {
    query := strings.ToLower(c.Query("q"))
    
    if query == "" {
        return c.JSON([]models.CarPart{})
    }
    
    var parts []models.CarPart
    err := config.DB.Preload("CarModel").
        Where("LOWER(name) LIKE ?", "%"+query+"%").
        Or("LOWER(description) LIKE ?", "%"+query+"%").
        Or("id IN (?)", config.DB.Table("car_models").
            Select("car_model_id").
            Where("LOWER(name) LIKE ? OR LOWER(make) LIKE ?", "%"+query+"%", "%"+query+"%")).
        Find(&parts).Error
    
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Error searching car parts",
        })
    }
    
    return c.JSON(parts)
}


func SearchParts(c *fiber.Ctx) error {
    // Pull raw query params
    query := strings.TrimSpace(c.Query("q"))
    condition := strings.TrimSpace(c.Query("condition"))
    minPrice := strings.TrimSpace(c.Query("minPrice"))
    maxPrice := strings.TrimSpace(c.Query("maxPrice"))
    brandName := strings.TrimSpace(c.Query("brand")) // Add brand filter parameter
   
    // Require at least one filter
    if query == "" && condition == "" && minPrice == "" && maxPrice == "" && brandName == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Please provide a search term, condition filter, brand, or price range",
        })
    }
   
    // Start base query - always join with car_models to avoid join conflicts later
    dbQuery := config.DB.Preload("CarModel").
        Joins("JOIN car_models ON car_models.id = car_parts.car_model_id")
   
    // Text search - fixed ambiguous column references
    if query != "" {
        searchTerm := "%" + strings.ToLower(query) + "%"
        dbQuery = dbQuery.Where("(LOWER(car_parts.name) LIKE ? OR LOWER(car_models.name) LIKE ? OR LOWER(car_models.make) LIKE ?)",
            searchTerm, searchTerm, searchTerm)
    }
   
    // Condition filter - qualified with table name
    if condition != "" {
        dbQuery = dbQuery.Where("car_parts.condition = ?", condition)
    }
   
    // Brand filter - using brand_name field
    if brandName != "" {
        dbQuery = dbQuery.Where("LOWER(car_models.brand_name) = ?", strings.ToLower(brandName))
    }
   
    // Price range handling
    if minPrice != "" || maxPrice != "" {
        // Parse and validate min price
        var minVal, maxVal int
        var err error
       
        if minPrice != "" {
            minVal, err = strconv.Atoi(minPrice)
            if err != nil || minVal < 0 {
                return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                    "error": "Invalid minimum price value",
                })
            }
        }
        // Parse and validate max price
        if maxPrice != "" {
            maxVal, err = strconv.Atoi(maxPrice)
            if err != nil || maxVal < 0 {
                return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                    "error": "Invalid maximum price value",
                })
            }
        }
        // Validate price range
        if minPrice != "" && maxPrice != "" && minVal > maxVal {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Minimum price cannot exceed maximum price",
            })
        }
        // Apply filters - qualified with table name
        if minPrice != "" {
            dbQuery = dbQuery.Where("car_parts.price >= ?", minVal)
        }
        if maxPrice != "" {
            dbQuery = dbQuery.Where("car_parts.price <= ?", maxVal)
        }
    }
   
    // Execute query
    var parts []models.CarPart
    if err := dbQuery.Find(&parts).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error":   "Failed to search car parts",
            "details": err.Error(),
        })
    }
   
    return c.JSON(fiber.Map{
        "count":   len(parts),
        "results": parts,
    })
}