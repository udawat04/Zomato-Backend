const moment = require("moment");
const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  deliveredBy:{type:mongoose.Schema.ObjectId,ref:"delivery-boy"},
  addressId: { type: mongoose.Schema.ObjectId, ref: "user-address" },
  total:{type:Number},
  date:{type:String , default:()=>moment().toDate()},
  status:{type:String , enum:["pending","on the way","delivered","canceled"],default:"pending"}
});

const Invoice = mongoose.model("invoice",invoiceSchema)
module.exports = Invoice