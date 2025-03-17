package models

import "gorm.io/gorm"

// Dealer model
type Dealer struct {
    gorm.Model
    FirstName    string     `json:"first_name"`
    LastName     string     `json:"last_name"`
    Email        string     `json:"email" gorm:"unique"`
    Number       string     `json:"number"`
    RepairShop   RepairShop `gorm:"foreignKey:DealerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"` // ✅ Correct One-to-One relation
}

// RepairShop model
type RepairShop struct {
    gorm.Model
    Name       string  `json:"name"`
    Location   string  `json:"location"`
	DealerID   uint    `json:"dealer_id"`
	DealerName string  `json:"dealer_name"`
  	Brands 	   []CarBrand `gorm:"many2many:car_brands;"`
	ShopParts []ShopPart `gorm:"foreignKey:RepairShopID"` // Links to ShopPart
}

// CarBrand model
type CarBrand struct {
	gorm.Model
	Name       string `json:"name"`
	CarModels  []CarModel `gorm:"many2many:car_models;"`
}

// Carmodels model
type CarModel struct {
	gorm.Model
	Name       string `json:"name"`
	Make       string `json:"make"`
	Year       string `json:"year"`
	BrandID    uint   `json:"brand_id" gorm:"column:car_brand_id"` // Update this line
	BrandName  string `json:"brand_name"`
	Parts      []CarPart `gorm:"many2many:car_parts;"`
}

// CarPart model
type CarPart struct {
	gorm.Model
	Name       string `json:"name"`
	Image       string `json:"image"`
	Size       string `json:"size"`
	Price      float64 `json:"price"`
	ShopParts []ShopPart `gorm:"foreignKey:CarPartID"` // Links to ShopPart
}

type ShopPart struct {
    RepairShopID uint      `gorm:"primaryKey"`  // FK to RepairShop
    CarPartID    uint      `gorm:"primaryKey"`  // FK to CarPart
    Stock        int       // Quantity available in the shop
    Price        float64   // Price of the part in the shop
    RepairShop   RepairShop `gorm:"foreignKey:RepairShopID;references:ID"`
    CarPart      CarPart    `gorm:"foreignKey:CarPartID;references:ID"`
}