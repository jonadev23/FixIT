package controllers

import (
	"mime/multipart" // For MultipartForm and file handling
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
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

func CreatePartWithShop(c *fiber.Ctx) error {
	// Determine content type
	contentType := c.Get("Content-Type")

	var (
		name         string
		imageFile    *multipart.FileHeader
		size         string
		price        float64
		condition    string
		carModelID   uint
		repairShopID uint
		stock        int
		shopPrice    float64
		imagePath    string
	)

	// Handle multipart form (file upload)
	if strings.HasPrefix(contentType, "multipart/form-data") {
		// Parse multipart form with Fiber's built-in method
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse form data",
			})
		}

		// Get form values
		if values := form.Value; values != nil {
			if names := values["name"]; len(names) > 0 {
				name = names[0]
			}
			if sizes := values["size"]; len(sizes) > 0 {
				size = sizes[0]
			}
			if prices := values["price"]; len(prices) > 0 {
				price, err = strconv.ParseFloat(prices[0], 64)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid price format",
					})
				}
			}
			if conditions := values["condition"]; len(conditions) > 0 {
				condition = conditions[0]
			}
			if carModelIDs := values["car_model_id"]; len(carModelIDs) > 0 {
				id, err := strconv.ParseUint(carModelIDs[0], 10, 32)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid car model ID",
					})
				}
				carModelID = uint(id)
			}
			if repairShopIDs := values["repair_shop_id"]; len(repairShopIDs) > 0 {
				id, err := strconv.ParseUint(repairShopIDs[0], 10, 32)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid repair shop ID",
					})
				}
				repairShopID = uint(id)
			}
			if stocks := values["stock"]; len(stocks) > 0 {
				stock, err = strconv.Atoi(stocks[0])
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid stock value",
					})
				}
			}
			if shopPrices := values["shop_price"]; len(shopPrices) > 0 {
				shopPrice, err = strconv.ParseFloat(shopPrices[0], 64)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid shop price format",
					})
				}
			}
		}

		// Handle file upload
		if files := form.File; files != nil {
			if images := files["image"]; len(images) > 0 {
				imageFile = images[0]

				// Validate file size (max 5MB)
				if imageFile.Size > 5<<20 {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Image too large (max 5MB)",
					})
				}

				// Validate file extension
				ext := strings.ToLower(filepath.Ext(imageFile.Filename))
				allowedExts := map[string]bool{
					".jpg":  true,
					".jpeg": true,
					".png":  true,
					".gif":  true,
				}
				if !allowedExts[ext] {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid image format (only JPG, PNG, GIF allowed)",
					})
				}

				// Generate unique filename
				filename := "carpart_" + strconv.FormatInt(time.Now().UnixNano(), 10) + ext
				imagePath = filename

				// Save file using Fiber's SaveFile method
				if err := c.SaveFile(imageFile, filepath.Join("./uploads", filename)); err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"error": "Failed to save image",
					})
				}
			} else {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Image is required",
				})
			}
		}
	} else {
		// Handle JSON request (unchanged)
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

		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid input: " + err.Error(),
			})
		}

		name = request.Name
		imagePath = request.Image
		size = request.Size
		price = request.Price
		condition = request.Condition
		carModelID = request.CarModelID
		repairShopID = request.RepairShopID
		stock = request.Stock
		shopPrice = request.ShopPrice
	}

	// Rest of your function remains the same...
	// Validate required fields
	if name == "" || size == "" || condition == "" || carModelID == 0 || repairShopID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields",
		})
	}

	// Define the base URL based on the environment
	var imageBaseURL string
	if os.Getenv("ENV") == "production" {
		imageBaseURL = "https://fixit-production-283f.up.railway.app/uploads/"
	} else {
		imageBaseURL = "http://127.0.0.1:5000/uploads/"
	}

	// Create CarPart
	carPart := models.CarPart{
		Name:       name,
		Image:      imageBaseURL + imagePath,
		Size:       size,
		Price:      price,
		Condition:  condition,
		CarModelID: carModelID,
	}

	// Save CarPart to DB
	if err := config.DB.Create(&carPart).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create car part: " + err.Error(),
		})
	}

	// Create ShopPart (mapping part to shop)
	shopPart := models.ShopPart{
		RepairShopID: repairShopID,
		CarPartID:    carPart.ID,
		Stock:        stock,
		Price:        shopPrice,
	}

	// Save ShopPart to DB
	if err := config.DB.Create(&shopPart).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create shop part: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":  "Car part and shop part created successfully",
		"carPart":  carPart,
		"shopPart": shopPart,
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
