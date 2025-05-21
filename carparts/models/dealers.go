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
    Name       string     `json:"name"`
    Location   string     `json:"location"`
    DealerID   uint       `json:"dealer_id"`
    DealerName string     `json:"dealer_name"`
    DealerContact string     `json:"dealer_contact"`
    Rating       int     `json:"rating"`
    Brands     []CarBrand `gorm:"many2many:car_brands;"`
    ShopParts  []ShopPart `gorm:"foreignKey:RepairShopID"`
}

// CarBrand model
type CarBrand struct {
    gorm.Model
    Name      string     `json:"name"`
    CarModels []CarModel `gorm:"foreignKey:BrandID"`
}

// CarPart model
type CarPart struct {
    gorm.Model
    Name       string   `json:"name"`
    Image      string   `json:"image"`
    Size       string   `json:"size"`
    Price      float64  `json:"price"`
    Condition  string   `json:"condition"`
    CarModelID uint     `json:"car_model_id"` // Foreign Key
    CarModel   CarModel `gorm:"foreignKey:CarModelID;references:ID"`
}

// CarModel model
type CarModel struct {
    gorm.Model
    Name      string    `json:"name"`
    Make      string    `json:"make"`
    Image      string   `json:"image"`
    Price      float64  `json:"price"`
    Condition  string   `json:"condition"`
    Year      string    `json:"year"`
    ImageURL  string    `json:"image_url"`
    BrandID   uint      `json:"brand_id"`
    BrandName string    `json:"brand_name"`
    Parts     []CarPart `gorm:"foreignKey:CarModelID"` // Bidirectional relationship
}

// ShopPart model (Mapping CarParts to RepairShops)
type ShopPart struct {
    gorm.Model
    RepairShopID uint      `json:"repair_shop_id"` // FK to RepairShop
    CarPartID    uint      `json:"car_part_id"`    // FK to CarPart
    Stock        int       `json:"stock"`         // Quantity available in the shop
    Price        float64   `json:"price"`         // Price of the part in the shop
    RepairShop   RepairShop `gorm:"foreignKey:RepairShopID"`
    CarPart      CarPart    `gorm:"foreignKey:CarPartID"`
}


// ShopPart model (Mapping CarParts to RepairShops)
type ShopModel struct {
    gorm.Model
    RepairShopID uint      `json:"repair_shop_id"` // FK to RepairShop
    CarModelID    uint      `json:"car_model_id"`    // FK to CarPart
    Stock        int       `json:"stock"`         // Quantity available in the shop
    Price        float64   `json:"price"`         // Price of the part in the shop
    RepairShop   RepairShop `gorm:"foreignKey:RepairShopID"`
    CarModel      CarModel    `gorm:"foreignKey:CarModelID"`
}

