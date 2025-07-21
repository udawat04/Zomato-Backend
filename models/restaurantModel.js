const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
});

const Restaurant = mongoose.model("restaurant",restaurantSchema)
module.exports = Restaurant