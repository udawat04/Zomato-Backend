const mongoose = require("mongoose")

const dbLocationSchema = new mongoose.Schema({
  dbId: { type: mongoose.Schema.ObjectId, ref: "delivery-boy" },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [latitude, longitude]
  },
});

dbLocationSchema.index({ location: "2dsphere" })
const DbLocation = mongoose.model("delivery-boy-location",dbLocationSchema)

module.exports = DbLocation