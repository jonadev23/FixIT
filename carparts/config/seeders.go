// config/seeder.go
package config

import (
	"gorm.io/gorm"
	"github.com/jonadev23/backend-project/models"
	"github.com/jonadev23/backend-project/utils"
)

func SeedDB(db *gorm.DB) error {
	hashedPassword, err := utils.HashPassword("admin123")
	if err != nil {
		return err
	}

	adminUser := models.User{
		FirstName: "Admin",
		LastName:  "User",
		Email:      "admin@example.com",
		Password:   hashedPassword,
		Role:       "admin",
	}

	testDealer := models.Dealer{
		FirstName: "Mike",
		LastName:  "John",
		Email:      "jonathan@example.com",
		Number:   "0786543678",		
	}

	testRepairShop := models.RepairShop{
		Name: "Hass Electronics",
		Location:  "Kampala",
		DealerID:   1,
		DealerName: "Mike",			
	}

	testCarBrand := models.CarBrand{
		Name: "Toyota",
	}

	testCarModel := models.CarModel{
		Name: "Camry",
		Make: "Sedan",
		Year: "2021",
		BrandID: 1,
	}

	testCarParts := models.CarPart{
		Name: "Tyre",
		Image: "/images/tyre.jpg",
		Size: "12",
		Price: 12500.0,
	}

	result := db.Create(&adminUser)
	if result.Error != nil {
		return result.Error
	}

	test := db.Create(&testDealer)
	if test.Error != nil {
		return test.Error
	}

	repairShop := db.Create(&testRepairShop)
	if repairShop.Error != nil {
		return test.Error
	}

	carBrand := db.Create(&testCarBrand)
	if carBrand.Error != nil {
		return test.Error
	}

	carModel := db.Create(&testCarModel)
	if carModel.Error != nil {
		return test.Error
	}

	carPart := db.Create(&testCarParts)
	if carPart.Error != nil {
		return test.Error
	}
	return nil
}