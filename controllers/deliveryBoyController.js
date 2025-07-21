const DeliveryBoy = require("../models/deliveryBoyModel")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createDeliveryBoy = async(req,res)=>{
     try {
       console.log(req.body, ":::");
       const { name, email, password, phone } = req.body;
       const alreadyEmail = await DeliveryBoy.findOne({ email });
       if (alreadyEmail) {
         return res.status(400).send("This Email Already Used");
       }

       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);

       const data = { name, email, password: hash, phone };
       const newDeliveryBoy = new DeliveryBoy(data);
       const newData = await newDeliveryBoy.save();

       console.log(newData, "newdata");

       const userdata = {
         ...data,
         role: "delivery-boy",
         deliveryBoyId: newData._id,
       };

       const newUser = new User(userdata);
       await newUser.save();

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