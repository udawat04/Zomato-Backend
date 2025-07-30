const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId ,ref:"user"},
    itemId:{type:mongoose.Schema.ObjectId,ref:"food-item"},
    quantity:{type:Number , default:1}
})
const Cart = mongoose.model("add-cart",cartSchema)
module.exports = Cart