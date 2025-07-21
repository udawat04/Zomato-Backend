const mongoose = require("mongoose")

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
});
const DeliveryBoy = mongoose.model("delivery-boy",deliveryBoySchema)
module.exports = DeliveryBoy