const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: { type: String },
  category: { type: String }, // e.g., Pizza, Burger, Momos
  foodType: { type: String }, // e.g., Fast Food, Chinese, Indian
  isVeg: {
    type: String,
    enum: ["Veg", "Non-Veg"],
    required: true,
  },
  price: { type: String },
  description: { type: String },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
    trim: true,
  },
  restaurantId: { type: mongoose.Schema.ObjectId, ref: "restaurant" },
});

const FoodItem = mongoose.model("food-item", foodSchema);
module.exports = FoodItem;
