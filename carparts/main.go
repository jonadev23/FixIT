package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/routes"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Fiber
	app := fiber.New()

	// Serve static images from the "uploads" directory
	app.Static("/uploads", "./uploads")

	// storing both production and development environment variables
	if os.Getenv("ENV") == "production" {

		// Enable CORS for all routes
		app.Use(cors.New(cors.Config{
			AllowOrigins:     "https://starlit-wisp-63c85a.netlify.app",     //
			AllowMethods:     "GET,POST,PUT,DELETE",                         // Allow specific methods
			AllowHeaders:     "Origin, Content-Type, Accept, Authorization", // Allow headers
			AllowCredentials: true,                                          // Allow credentials
		}))
	} else {
		app.Use(cors.New(cors.Config{
			AllowOrigins:     "http://localhost:5173",
			AllowMethods:     "GET,POST,PUT,DELETE",                         // Allow specific methods
			AllowHeaders:     "Origin, Content-Type, Accept, Authorization", // Allow headers
			AllowCredentials: true,                                          // Allow credentials
		}))
	}
	// Connect to database
	config.ConnectDB()

	// Drop existing tables
	// config.DB.Migrator().
	// 	DropTable(&models.User{}, &models.Dealer{}, &models.RepairShop{}, &models.CarBrand{}, &models.CarModel{}, &models.CarModelSale{}, &models.CarPart{}, &models.ShopPart{}, &models.ShopModel{})

	// Run migrations
	config.DB.AutoMigrate(
		&models.User{},
		&models.Dealer{},
		&models.RepairShop{},
		&models.CarBrand{},
		&models.CarModel{},
		&models.CarModelSale{},
		&models.CarPart{},
		&models.ShopPart{},
		&models.ShopModel{},
	)

	// Setup routes
	routes.SetupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Fatal(app.Listen(":" + port))
}
