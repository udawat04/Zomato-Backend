const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.ObjectId, ref: "invoice" },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  itemId: { type: mongoose.Schema.ObjectId, ref: "food-item" },
  quantity: { type: Number },
  images: { type: [Object] },
});

const Order = mongoose.model("order",orderSchema)
module.exports = Order