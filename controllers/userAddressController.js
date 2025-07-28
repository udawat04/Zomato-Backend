const UserAddress = require("../models/userAddressModel")


exports.createAddress = async (req, res) => {
  const user = req.user;
  const {
    street,
    city,
    state,
    pincode,
    landmark,
    addressType,
    isDefault,
  } = req.body;

  const data = {
    userId: user._id,
    userName: user.name,
    phoneNumber:user.phone,
    street,
    city,
    state,
    pincode,
    landmark,
    addressType,
    isDefault,
  };

  const newAddress = new UserAddress(data)
  await newAddress.save()

  return res.status(200).send(newAddress);
};

exports.updateAddress = async(req,res)=>{
  const {id} = req.params
 
  const { street,
    city,
    state,
    pincode,
    landmark,} = req.body
    console.log(req.body)

    const data = {street,city,state,pincode,landmark}

    const result = await UserAddress.findByIdAndUpdate({_id:id},data,{new:true})
    console.log(result)

    return res.status(200).json({msg:"updated",result})

}

exports.allAddress = async(req,res)=>{
  const result = await UserAddress.find()
  return res.status(200).send(result)
}
exports.addressById = async(req,res)=>{
  const {id} = req.params
  console.log(id)
  const result = await UserAddress.findById({_id:id})
  return res.status(200).send(result)
}