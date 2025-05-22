package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the database instance
var DB *gorm.DB

// ConnectDB initializes the database connection
func ConnectDB() {
var dsn string

	if os.Getenv("ENV") == "production" {
		// Use full DATABASE_URL from Render or other cloud host
		dsn = os.Getenv("DATABASE_URL")
	} else {
		// Local development
		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", // disable for local
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB = db
	fmt.Println("Database connected successfully!")
}
