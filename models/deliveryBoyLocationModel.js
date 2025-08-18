const mongoose = require("mongoose")

const dbLocationSchema = new mongoose.Schema({
  dbId: { type: mongoose.Schema.ObjectId, ref: "delivery-boy" },
  latitude:{type:Number},
  longitude:{type:Number}
});

const DbLocation = mongoose.model("delivery-boy-location",dbLocationSchema)

module.exports = DbLocation