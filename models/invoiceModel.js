const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  addressId: { type: mongoose.Schema.ObjectId, ref: "user-address" },
  total:{type:String},
  date:{type:String , default:()=>moment().toDate()}
});

const Invoice = mongoose.model("invoice",invoiceSchema)
module.exports = Invoice