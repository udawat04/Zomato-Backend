const mongoose = require("mongoose")

const foodImageSchema = new mongoose.Schema({
  foodItemId: { type: mongoose.Schema.ObjectId, ref: "food-item" },
  imageName:{type:String},
  imageUrl:{type:String}
});

const FoodImage = mongoose.model("food-image",foodImageSchema)
module.exports = FoodImage