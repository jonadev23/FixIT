package controllers

import (
	"strconv"
	"strings" // Add this import

	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config" // Database connection
	"github.com/jonadev23/backend-project/models" // Update to match your project path
)



func GetShopModelByID(c *fiber.Ctx) error {
    id := c.Params("id")

    var model models.ShopModel
    result := config.DB.Preload("RepairShop").First(&model, id)

    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{"error": "shop model not found"})
    }

    return c.JSON(model)
}

// Add this to your routes
 func GetSearchQueryM(c *fiber.Ctx) error {
    query := strings.ToLower(c.Query("q"))
    
    if query == "" {
        return c.JSON([]models.CarModelSale{})
    }
    
    var Models []models.CarModelSale
    err := config.DB.Preload("CarModelSale").
        Where("LOWER(name) LIKE ?", "%"+query+"%").
        Or("LOWER(description) LIKE ?", "%"+query+"%").
        Or("id IN (?)", config.DB.Table("car_models").
            Select("car_model_id").
            Where("LOWER(name) LIKE ? OR LOWER(make) LIKE ?", "%"+query+"%", "%"+query+"%")).
        Find(&Models).Error
    
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Error searching car Models",
        })
    }
    
    return c.JSON(Models)
}


func SearchModels(c *fiber.Ctx) error {
    // Pull query parameters
    query := strings.TrimSpace(c.Query("q"))
    condition := strings.TrimSpace(c.Query("condition"))
    minPrice := strings.TrimSpace(c.Query("minPrice"))
    maxPrice := strings.TrimSpace(c.Query("maxPrice"))
    brandName := strings.TrimSpace(c.Query("brand"))

    // Validate at least one filter exists
    if query == "" && condition == "" && minPrice == "" && maxPrice == "" && brandName == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Please provide a search term, condition filter, brand, or price range",
        })
    }

    // Start base query for CarModelSale
    dbQuery := config.DB.Model(&models.CarModelSale{})

    // Text search
    if query != "" {
        searchTerm := "%" + strings.ToLower(query) + "%"
        dbQuery = dbQuery.Where(
            "(LOWER(name) LIKE ? OR LOWER(make) LIKE ?)",
            searchTerm, searchTerm,
        )
    }

    // Condition filter
    if condition != "" {
        dbQuery = dbQuery.Where("condition = ?", condition)
    }

    // Brand filter
    if brandName != "" {
        dbQuery = dbQuery.Where("LOWER(brand_name) = ?", strings.ToLower(brandName))
    }

    // Price range handling
    if minPrice != "" || maxPrice != "" {
        var minVal, maxVal float64
        var err error

        if minPrice != "" {
            minVal, err = strconv.ParseFloat(minPrice, 64)
            if err != nil || minVal < 0 {
                return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                    "error": "Invalid minimum price value",
                })
            }
            dbQuery = dbQuery.Where("price >= ?", minVal)
        }

        if maxPrice != "" {
            maxVal, err = strconv.ParseFloat(maxPrice, 64)
            if err != nil || maxVal < 0 {
                return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                    "error": "Invalid maximum price value",
                })
            }
            dbQuery = dbQuery.Where("price <= ?", maxVal)
        }

        if minPrice != "" && maxPrice != "" && minVal > maxVal {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Minimum price cannot exceed maximum price",
            })
        }
    }

    // Execute query
    var results []models.CarModelSale
    if err := dbQuery.Find(&results).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error":   "Failed to search car models",
            "details": err.Error(),
        })
    }

    return c.JSON(fiber.Map{
        "count":   len(results),
        "results": results,
    })
}