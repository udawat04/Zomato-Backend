const mongoose = require("mongoose")

const nearbyDbSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [latitude, longitude]
  },
  dbId: { type: mongoose.Schema.ObjectId, ref: "delivery-boy" },
  invoiceId:{type:mongoose.Schema.ObjectId , ref:"invoice"},
  dbName:{type:String},

});

const nearbyDb = mongoose.model("nearby-delivery-boy",nearbyDbSchema)
module.exports = nearbyDb