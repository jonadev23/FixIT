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
	api.Get("/dealers", controllers.GetDealers)
	api.Get("/dealers/:id", controllers.GetDealerByID) 
	api.Get("/shops", controllers.GetShops)
	api.Post("/dealers", controllers.CreateDealer)
	api.Delete("/dealers/:id", controllers.DeleteDealer)
	api.Put("/dealers/:id", controllers.UpdateDealer)
}
