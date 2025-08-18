const { uploadImage } = require("../helper/cloudinary");
const DbLocation = require("../models/deliveryBoyLocationModel");
const DeliveryBoy = require("../models/deliveryBoyModel")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createDeliveryBoy = async(req,res)=>{
     try {
       console.log(req.body, ":::");
       const { name, email, password, phone, vehicleType, licenseNumber,latitude,longitude } = req.body;
      
       const alreadyEmail = await DeliveryBoy.findOne({ email });
       if (alreadyEmail) {
         return res.status(400).send("This Email Already Used");
       }

      const imageUpload = await uploadImage(req.files)
       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);

       const data = {
         name,
         email,
         password: hash,
         phone,
         vehicleType,
         licenseNumber,
         status: "pending",
         image: imageUpload[0].url,
        
       };

       const newDeliveryBoy = new DeliveryBoy(data);
       const newData = await newDeliveryBoy.save();

       console.log(newData, "newdata");

       const userdata = {
         name,
         email,
         password: hash,
         phone,
         vehicleType,
         licenseNumber,
         status: "pending",
         dbImage: newData.image,
         role: "delivery-boy",
         deliveryBoyId: newData._id,
       
       };
       console.log(userdata,"userrr")

       const newUser = new User(userdata);
       await newUser.save();

       const dbLocationData = {dbId:newData._id,latitude,longitude}
       const dbLocation = new DbLocation(dbLocationData)
       const locationResult = await dbLocation.save()
       console.log(locationResult,"location")

       return res
         .status(200)
         .json({ message: "DeliveryBoy is Registered", newData, newUser });
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
}

// All Delivery-Boy Get API
exports.allDeliveryBoy = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "admin" || user.role === "delivery-boy") {
      const result = await DeliveryBoy.find();
      return res.status(200).send(result);
    } else {
      return res.status(400).send("You are not authorized");
    }
  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
};


//Delivery Login Api

exports.deliverBoyLogin = async (req, res) => {
 try {
     const { email, password } = req.body;
     const alreadyEmail = await DeliveryBoy.findOne({ email });
     if (!alreadyEmail) {
       return res.status(400).send("email not found");
     }

     const dbpassword = alreadyEmail.password;

     const verify = await bcrypt.compare(password, dbpassword);

     if (!verify) {
       return res.status(400).json({ message: "password is not match" });
     }

     const token = jwt.sign({ email: alreadyEmail.email }, secretkey, {
       expiresIn: "4h",
     });

     return res
       .status(200)
       .json({ message: "DeliveryBoy logged in ", user: alreadyEmail, token });
 } catch (error) {
     return res.status(500).json({ error: error.message });
 }
};

exports.updateDb = async(req,res)=>{
  const user = req.user
  // console.log(user)
  try {
    const {name,email,phone}=req.body
   
    let image;
    if(req.files){
      image = await uploadImage(req.files);
    }

    const data = {name,email,phone,image:image[0].url}
    console.log(data);
   const updatedDb = await DeliveryBoy.findByIdAndUpdate(
     { _id: user.deliveryBoyId },
      data ,
     { new: true }
   );

   const userDbUpdate = await User.findByIdAndUpdate({_id:user._id},data,{new:true})
   console.log(updatedDb)
   return res.status(200).send(updatedDb)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}