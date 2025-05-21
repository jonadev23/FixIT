package models

import "gorm.io/gorm"

// User model
type User struct {
    gorm.Model
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
    Email     string `json:"email" gorm:"unique,default:null"`
    Phone     *string `json:"phone" gorm:"unique"`
    Password  string `json:"-"`
    Role      string `json:"role" gorm:"default:user"`
}