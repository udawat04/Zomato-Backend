const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
  foodName: { type: String },
  type: { type: String },
  price: { type: String },
  description: { type: String },
  status: {
    type: String,
    default: "active",
    enum: ["active","inactive"],
    trim: true,
  },
  restaurantId: { type: mongoose.Schema.ObjectId, ref: "restaurant" },
});

const FoodItem = mongoose.model("food-item",foodSchema)
module.exports = FoodItem