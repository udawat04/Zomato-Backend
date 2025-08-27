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

exports.restaurantOrders = async (req, res) => {
  const user = req.user;
  // console.log(req.user)
  const restId = user.restaurantId;
  console.log(restId);
  const result = await Order.find({ restId: restId })
    .populate("userId")
    .populate("itemId")
    .populate("invoiceId")
    .populate("addressId")

    

  return res.status(200).send(result);
};

exports.updateOrderStatus = async(req,res)=>{
  const {orderIds,status} =req.body
  console.log(req.body,"order body")
let results=[]
  orderIds.forEach(async(id) => {
     let result = await Order.findByIdAndUpdate({_id:id},{status:status},{new:true})
     results.push(result)
    //  console.log(result,"updated result of order status")
    
  });
  return res.status(200).send(results);

}



exports.allOrders = async(req,res)=>{

  try {
      const user = req.user;
      // console.log(req.user)
     
      
      const result = await Order.find({ userId: user._id })
        .populate("userId")
        .populate("itemId")
        .populate("invoiceId")
        .populate("restId")
        .populate("addressId");

      return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}




