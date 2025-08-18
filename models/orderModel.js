const mongoose = require("mongoose")
const moment = require("moment");

const orderSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.ObjectId, ref: "invoice" },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  itemId: { type: mongoose.Schema.ObjectId, ref: "food-item" },
  restId: { type: mongoose.Schema.ObjectId, ref: "restaurant" },
  quantity: { type: Number },
  images: { type: [Object] },
  date:{type:String , default:()=>moment().toDate()},
  addressId: { type: mongoose.Schema.ObjectId, ref: "user-address" },
  status: {
    type: String,
    enum: ["pending", "on the way", "delivered", "canceled"],
    default: "pending",
  },
});

const Order = mongoose.model("order",orderSchema)
module.exports = Order