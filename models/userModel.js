const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  role: {
    type: String,
    enum: ["admin", "user", "restaurant", "delivery-boy"],
  },
  status: {
    type: String,
    default: "active",
    enum: ["pending", "rejected", "active"],
  },
  image: { type: String },

  // If no value is provided, this field won't be saved
  restImage: {
    type: [String],
    default: undefined,
  },

  adminId: { type: mongoose.Schema.ObjectId, ref: "admin" },
  restaurantId: { type: mongoose.Schema.ObjectId, ref: "Restaurant" },
  deliveryBoyId: { type: mongoose.Schema.ObjectId, ref: "delivery-boy" },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
