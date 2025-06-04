package controllers

import (
	"mime/multipart"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
)

// GetModelByID retrieves a single model by ID
func GetModelSaleByID(c *fiber.Ctx) error {
	id := c.Params("id")

	var model models.CarModelSale
	result := config.DB.First(&model, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "model for sale not found"})
	}

	return c.JSON(model)
}

// GetCarParts returns all car parts with their name, price, size, image, and related car model
func GetAllCarModelSale(c *fiber.Ctx) error {
	var carModels []models.CarModelSale

	// Preload the CarModel and its Brand information
	if err := config.DB.Preload("CarBrand").Find(&carModels).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch car models"})
	}

	return c.Status(200).JSON(carModels)
}

func GetModelSale(c *fiber.Ctx) error {
	var models []models.CarModelSale

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

// func CreateModelSale(c *fiber.Ctx) error {
// 	// Define a request struct to properly handle the image field
// 	var request struct {
// 		Name      string `json:"name"`
// 		Make      string `json:"make"`
// 		Image     string   `json:"image"`
//         Price     float64  `json:"price"`
//         Condition  string   `json:"condition"`
// 		Year      string `json:"year"`
// 		ImageURL  string `json:"image_url"` // This will contain just the filename
// 		BrandID   uint   `json:"brand_id"`
// 		BrandName string `json:"brand_name"`
// 	}

// 	// Parse the JSON request body
// 	if err := c.BodyParser(&request); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
// 	}

// 	// Create the CarModel with the prefixed image URL
// 	// https://fixit-wxa9.onrender.com
// 	model := models.CarModelSale{
// 		Name:      request.Name,
// 		Make:      request.Make,
// 		Image:     "http://127.0.0.1:5000/uploads/" + request.Image,
//         Price:      request.Price,
//         Condition:  request.Condition,
// 		Year:      request.Year,
// 		ImageURL:  "http://127.0.0.1:5000/uploads/" + request.ImageURL,
// 		BrandID:   request.BrandID,
// 		BrandName: request.BrandName,
// 	}

// 	// Save model to database
// 	if err := config.DB.Create(&model).Error; err != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Failed to create car model"})
// 	}

// 	// Return the newly created model
// 	return c.Status(201).JSON(model)
// }

func CreateModelSale(c *fiber.Ctx) error {
	// Determine content type
	contentType := c.Get("Content-Type")

	var (
		name      string
		make      string
		imageFile *multipart.FileHeader
		price     float64
		condition string
		year      string
		imagePath string
		brandID   uint
		brandName string
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
			if makes := values["make"]; len(makes) > 0 {
				make = makes[0]
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
			if years := values["year"]; len(years) > 0 {
				year = years[0]
			}
			if brandIDs := values["brand_id"]; len(brandIDs) > 0 {
				id, err := strconv.ParseUint(brandIDs[0], 10, 32)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": "Invalid brand ID",
					})
				}
				brandID = uint(id)
			}
			if brandNames := values["brand_name"]; len(brandNames) > 0 {
				brandName = brandNames[0]
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
				filename := "carmodel_" + strconv.FormatInt(time.Now().UnixNano(), 10) + ext
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
		// Handle JSON request
		var request struct {
			Name      string  `json:"name"`
			Make      string  `json:"make"`
			Image     string  `json:"image"`
			Price     float64 `json:"price"`
			Condition string  `json:"condition"`
			Year      string  `json:"year"`
			BrandID   uint    `json:"brand_id"`
			BrandName string  `json:"brand_name"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid input: " + err.Error(),
			})
		}

		name = request.Name
		make = request.Make
		imagePath = request.Image
		price = request.Price
		condition = request.Condition
		year = request.Year
		brandID = request.BrandID
		brandName = request.BrandName
	}

	// Validate required fields
	if name == "" || make == "" || condition == "" || year == "" || brandID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields",
		})
	}

	// Define the base URL based on the environment
	var imageBaseURL string
	if os.Getenv("ENV") == "production" {
		imageBaseURL = "https://fixit-wxa9.onrender.com/uploads/"
	} else {
		imageBaseURL = "http://127.0.0.1:5000/uploads/"
	}

	// Create CarModelSale
	model := models.CarModelSale{
		Name:      name,
		Make:      make,
		Image:     imageBaseURL + imagePath,
		Price:     price,
		Condition: condition,
		Year:      year,
		ImageURL:  imageBaseURL + imagePath, // Same as Image for consistency
		BrandID:   brandID,
		BrandName: brandName,
	}

	// Save model to database
	if err := config.DB.Create(&model).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create car model: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(model)
}

// Updatemodel ...
func UpdateModelSale(c *fiber.Ctx) error {
	id := c.Params("id")
	var model models.CarModelSale

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
func DeleteModelSale(c *fiber.Ctx) error {
	id := c.Params("id")

	result := config.DB.Debug().Delete(&models.CarModelSale{}, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "model not found"})
	}

	return c.Status(204).JSON(fiber.Map{"message": "model deleted successfully"})
}

// Add .Unscoped() to permanently delete
