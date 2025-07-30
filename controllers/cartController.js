const Cart = require("../models/addCartModel")

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
    const result = await Cart.find()
    return res.status(200).send(result)
}