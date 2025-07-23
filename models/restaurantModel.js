const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    restaurantType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Mixed"],
      default: "Mixed",
    },
    openingHours: {
      open: { type: String },
      close: { type: String },
    },
    status: {
      type: String,
      default: "pending", 
      enum: ["pending","rejected", "active"], 
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
