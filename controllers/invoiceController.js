const Invoice = require("../models/invoiceModel")

exports.createInvoice = async(req,res)=>{
    const {userId,addressId,cart,total} = req.body
    console.log(req.body)
}