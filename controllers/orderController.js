const Order = require("../models/orderModel")

exports.createOrder = async(req,res)=>{
   try {
     const user = req.user;

     const { items, addressId, totalAmount } = req.body;
     const data = { userId: user._id, items, addressId, totalAmount };

     return res.send(200).send(data);
   } catch (error) {
    return res.status(500).json({error:error.message})
   }
}