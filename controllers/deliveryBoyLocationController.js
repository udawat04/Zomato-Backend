const DbLocation = require("../models/deliveryBoyLocationModel")
const mongoose = require("mongoose")

exports.updateLocation = async(req,res)=>{
    try {
        const user = req.user
        const {id} =req.params
        console.log(id)
        console.log(req.body)
        const{latitude,longitude} = req.body
        // const id = dbId.mongoose.Schema.ObjectId
        const data = {latitude:latitude,longitude:longitude}
        const updateLocation = await DbLocation.findByIdAndUpdate({dbId:id},data,{new:true})
         console.log(updateLocation);
        return res.status(200).send(updateLocation)
    } catch (error) {
        return res.status(200).json({error:error.message})
    }
}