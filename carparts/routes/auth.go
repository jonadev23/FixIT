package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jonadev23/backend-project/controllers"
)

// SetupRoutes defines API routes
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
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
		// parst
	api.Get("/car-parts", controllers.GetParts)
	api.Get("/car-part/:id", controllers.GetPartByID)
	api.Post("/car-part", controllers.CreatePart)
	api.Delete("/car-part/:id", controllers.DeletePart)
	api.Put("/car-part/:id", controllers.UpdatePart)

}
