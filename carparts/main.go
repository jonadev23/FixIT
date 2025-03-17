package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jonadev23/backend-project/config"
	"github.com/jonadev23/backend-project/routes"
	"github.com/jonadev23/backend-project/models"
)


func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Fiber
	app := fiber.New()
	// Enable CORS for all routes
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Allow React frontend
		AllowMethods: "GET,POST,PUT,DELETE",  // Allow specific methods
		AllowHeaders: "Origin, Content-Type, Accept, Authorization", // Allow headers
	}))	

	// Connect to database
	config.ConnectDB()

	// Drop existing tables
	config.DB.Migrator().DropTable(&models.User{},&models.Dealer{},&models.RepairShop{},&models.CarBrand{},&models.CarModel{}, &models.CarPart{},&models.ShopPart{})

   // Run migrations
	 config.DB.AutoMigrate(&models.User{},&models.Dealer{},&models.RepairShop{},&models.CarBrand{},&models.CarModel{}, &models.CarPart{},&models.ShopPart{})
	
	// Re-seed the database
	config.SeedDB(config.DB)

	// Setup routes
	routes.SetupRoutes(app)

	
	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Fatal(app.Listen(":" + port))
}


