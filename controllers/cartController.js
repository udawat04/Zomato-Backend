const Cart = require("../models/addCartModel")
const FoodItem = require("../models/foodItemModel")

exports.addToCart = async(req,res)=>{
    const user = req.user
    const {itemId} = req.body
    const alreadyItem = await Cart.findOne({itemId})
    if(alreadyItem){
        return res.status(400).send("Item Already in Cart")
    }
    const data = {userId:user._id,itemId,}
    const newCart = new Cart(data)
    await newCart.save()
    return res.status(200).send(newCart)
}

exports.updateCart = async(req,res)=>{
    const {cartId,quantity} = req.body
    console.log(req.body)
    const quant = Number(quantity)
    const result = await Cart.findByIdAndUpdate({_id:cartId},{quantity:quant},{new:true})
    return res.status(200).send(result)
}

exports.deleteCart = async(req,res)=>{
    const { cartId } = req.body;
     const result = await Cart.findByIdAndDelete(
       { _id: cartId },
       
     );
     return res.status(200).send(result);
}

exports.allCartItem = async(req,res)=>{
    const result = await Cart.aggregate([
      {
        $lookup: {
          from: "food-items",
          localField: "itemId",
          foreignField: "_id",
          as: "itemId",
        },
      },
      {
        $unwind: "$itemId", // optional: turn restaurant array into object
      },
      {
        $lookup: {
          from: "food-images",
          localField: "itemId._id",
          foreignField: "foodItemId",
          as: "images",
        },
      },
    ]);
 
  
    return res.status(200).send(result)
}