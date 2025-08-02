const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String },
  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  isDefault: { type: Boolean, default: false },
});

const UserAddres = mongoose.model("user-address",addressSchema)
module.exports = UserAddres