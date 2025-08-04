const Invoice = require("../models/invoiceModel")
const Order = require("../models/orderModel")

exports.createInvoice = async(req,res)=>{
    const {userId,addressId,cart,total} = req.body
    console.log(req.body,"req.body--------------------------")
   

    const invoiceData = {userId,addressId,total}
    
    const newInvoice = new Invoice(invoiceData)
    const invoiceResult = await newInvoice.save()
    console.log(invoiceResult)

     cart.forEach(async(item) => {
        const data = {invoiceId:invoiceResult._id, userId: item.userId ,itemId:item.itemId,quantity:item.quantity,images:item.images};
        console.log(data,"------------=======   ")
        const newOrder = new Order(data)
        await newOrder.save()
    });
    

return res.status(200).send(invoiceResult)
}

exports.invoiceById = async(req,res)=>{
    const user =req.user

    const result = await Invoice.find({userId:user._id})
    console.log(result,"hfhfhf")
    return res.status(200).send(result)
}