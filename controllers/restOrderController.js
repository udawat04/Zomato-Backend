const restOrder = require("../models/restaurantOrderModel")

exports.restById = async(req,res)=>{
    const user = req.user
    // console.log(req.user)
    const restId = user.restaurantId;
    console.log(restId) 
    const result = await restOrder
      .find({ restId: restId })
      .populate("userId")
      .populate("itemId")
      .populate("invoiceId")
      .populate("addressId");
      
    return res.status(200).send(result)
}