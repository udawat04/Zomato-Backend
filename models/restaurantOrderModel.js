const mongoose = require("mongoose")

const restOrderSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.ObjectId, ref: "invoice" },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  itemId: { type: mongoose.Schema.ObjectId, ref: "food-item" },
  restId: { type: mongoose.Schema.ObjectId, ref: "restaurant" },
  quantity: { type: Number },
  images: { type: [Object] },
addressId: { type: mongoose.Schema.ObjectId, ref: "user-address" },

});
const restOrder = mongoose.model("restaurant-order",restOrderSchema)
module.exports = restOrder