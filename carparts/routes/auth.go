package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/controllers"
	"github.com/jonadev23/backend-project/handlers"
	"github.com/jonadev23/backend-project/middleware"
)

// SetupRoutes defines API routes
func SetupRoutes(app *fiber.App) {
	// Public routes
	auth := app.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// User routes (authenticated)
	user := app.Group("/user", middleware.AuthRequired)
	user.Get("/profile", controllers.UserProfile)

	// Admin routes (admin only)
	admin := app.Group("/admin", middleware.AdminRequired)
	admin.Get("/dashboard", controllers.AdminDashboard)

	api := app.Group("/api")
	// dealers
	api.Get("/dealers", controllers.GetDealers)
	api.Get("/dealers/:id", controllers.GetDealerByID)
	api.Post("/dealers", controllers.CreateDealer)
	api.Delete("/dealers/:id", controllers.DeleteDealer)
	api.Put("/dealers/:id", controllers.UpdateDealer)
	// shops
	api.Get("/shops", controllers.GetShops)
	api.Get("/shops/:id", controllers.GetShopByID)
	api.Post("/shops", controllers.CreateShop)
	api.Delete("/shops/:id", controllers.DeleteShop)
	api.Put("/shops/:id", controllers.UpdateShop)
	// brands
	api.Get("/car-brands", controllers.GetBrands)
	api.Get("/car-brand/:id", controllers.GetBrandByID)
	api.Post("/car-brand", controllers.CreateBrand)
	api.Delete("/car-brand/:id", controllers.DeleteBrand)
	api.Put("/car-brand/:id", controllers.UpdateBrand)
	// models
	api.Get("/car-models", controllers.GetModels)
	api.Get("/car-model/:id", controllers.GetModelByID)
	api.Post("/car-model", controllers.CreateModel)
	api.Delete("/car-model/:id", controllers.DeleteModel)
	api.Put("/car-model/:id", controllers.UpdateModel)

	// parts
	// api.Get("/car-parts", controllers.GetParts)
	api.Get("/car-part/:id", controllers.GetPartByID)
	api.Post("/car-part", controllers.CreatePartWithShop)
	api.Delete("/car-part/:id", controllers.DeletePart)
	api.Put("/car-part/:id", controllers.UpdatePart)

	// getting car_part details
	api.Get("/car-parts", controllers.GetAllCarParts)
	api.Get("/shop-part/:id", controllers.GetShopPartByID)
	api.Get("/car-parts/search", controllers.SearchParts)

	// google auth
	api.Post("/auth/google", handlers.GoogleAuthHandler)

	// getting car_part details
	// api.Get("/car-models", controllers.GetAllCarModelSale)
	api.Get("/shop-model/:id", controllers.GetShopModelByID)
	api.Get("/car-models/search", controllers.SearchModels)

	// models sale
	api.Get("/car-model-sale", controllers.GetModelSale)
	api.Get("/car-model-sale/:id", controllers.GetModelSaleByID)
	api.Post("/car-model-sale", controllers.CreateModelSale)
	api.Delete("/car-model-sale/:id", controllers.DeleteModelSale)
	api.Put("/car-model-sale/:id", controllers.UpdateModelSale)
}
