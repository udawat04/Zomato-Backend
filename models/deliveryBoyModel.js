const mongoose = require("mongoose")

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  image:{type:String},
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "rejected", "active"],
    trim: true,
  },
  vehicleType: { type: String, trim: true },
  licenseNumber: { type: Number },
  
});
const DeliveryBoy = mongoose.model("delivery-boy",deliveryBoySchema)
module.exports = DeliveryBoy