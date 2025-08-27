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
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6, 
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String], 
      default: [],
    },
    address: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, lowercase: true, default: "" },
      state: { type: String, trim: true, lowercase: true, default: "" },
      zip: { type: String, trim: true, default: "" },
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    restaurantType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Mixed"],
      default: "Mixed",
      trim: true,
    },
    openingHours: {
      open: { type: String, trim: true, default: "" }, 
      close: { type: String, trim: true, default: "" }, 
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "rejected", "active"],
      trim: true,
    },

    
  
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("restaurant", restaurantSchema);
module.exports = Restaurant;
