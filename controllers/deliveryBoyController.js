const { uploadImage } = require("../helper/cloudinary");
const DbLocation = require("../models/deliveryBoyLocationModel");
const DeliveryBoy = require("../models/deliveryBoyModel")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nearbyDb = require("../models/nearbyDeliveryBoy");
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

       const dbLocationData = {
         dbId: newData._id,
         location: {
           type: "Point",
           coordinates: [latitude, longitude], 
         },
       };
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

exports.nearbyDeliveryBoy = async(req,res)=>{
  try {
    // const result = await nearbyDb.find().populate("dbId").populate("invoiceId")
    const result = await nearbyDb.aggregate([
      {
        $lookup: {
          from: "invoices",
          localField: "invoiceId",
          foreignField: "_id",
          as: "invoices",
        },
      },
      {
        $unwind: "$invoices",
      },
      {
        $lookup: {
          from: "orders",
          localField: "invoices._id",
          foreignField: "invoiceId",
          as: "orders",
        },
      },
      { $unwind: "$orders" },
      {
        $lookup: {
          from: "restaurants",
          localField: "orders.restId",
          foreignField: "_id",
          as: "orders.restaurants",
        },
      },
      { $unwind: "$orders.restaurants" },
      {
        $lookup: {
          from: "user-addresses",
          localField: "invoices.addressId",
          foreignField: "_id",
          as: "userAddress",
        },
      },
      { $unwind: "$userAddress" },
      {
        $lookup: {
          from: "users",
          localField: "invoices.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "food-items",
          localField: "orders.itemId",
          foreignField: "_id",
          as: "orders.item",
        },
      },
      {$unwind:"$orders.item"},
      {
        $group: {
          _id: "$_id",
          dbId:{$first:"$dbId"},
          dbName:{$first:"$dbName"},
          users: { $first: "$user" },
          userAddress: { $first: "$userAddress" },
          invoices: { $first: "$invoices" },
          // item: { $first: "$item" },
          location: { $first: "$location" },
          orders: { $push: "$orders" },
        },
      },
    ]);
    return res.status(200).send(result)
  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
}


// after update status of invoice and order table remove all delivery-boy from nearby-db-table

exports.removealldb = async (req, res) => {
  try {
    const { invoiceId, excludeId } = req.body;
    // excludeId = wo _id jo delete nahi karna hai

    console.log("Invoice ID:", invoiceId);
    console.log("Exclude ID:", excludeId);

    const result = await nearbyDb.deleteMany({
      invoiceId: invoiceId,
      _id: { $ne: excludeId }, // ye condition bolti hai: "_id not equal to excludeId"
    });

    console.log("Deleted:", result);
    return res.status(200).send({
      message: "Documents deleted successfully except the given _id",
      result,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).send({
      message: "Server error",
      error,
    });
  }
};

exports.removeRejectedDb = async (req, res) => {
  try {
    const { id } = req.params; // ye invoiceId
    const { invoiceId } = req.body; // ye delivery boy ka id

    console.log("Invoice ID:", invoiceId, "DB ID:", id);

    // Delete the document where both invoiceId and dbId match
    const result = await nearbyDb.findOneAndDelete({
      invoiceId: invoiceId,
      dbId: id,
    });

    if (!result) {
      return res.status(404).json({ message: "No matching document found" });
    }

    console.log("Deleted document:", result);
    return res.status(200).json({
      message: "Document deleted successfully",
      deletedDocument: result,
    });
  } catch (err) {
    console.error("Error deleting document:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

