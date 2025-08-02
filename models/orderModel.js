const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
 invoiceId:{type:mongoose.Schema.ObjectId},
 cartId:{type:mongoose.Schema.ObjectId}
});

const Order = mongoose.model("order",orderSchema)
module.exports = Order