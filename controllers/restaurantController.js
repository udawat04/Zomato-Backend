const  Restaurant = require("../models/restaurantModel")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createRestaurant = async(req,res)=>{
     try {
       console.log(req.body, ":::");
     const {
       restaurantName,
       ownerName,
       email,
       password,
       phone,
       address: { street, city, state, zip },
       restaurantType,
       openingHours: { open, close },
       status
     } = req.body;
       const alreadyEmail = await Restaurant.findOne({ email });
       if (alreadyEmail) {
         return res.status(400).send("This Email Already Used");
       }

       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);

       const data = {
         restaurantName,
         ownerName,
         email,
         password: hash, // Assume you hashed the original password
         phone,
         address: { street, city, state, zip },
         restaurantType,
         openingHours: { open, close },
         status
       };

       const newRestaurant = new Restaurant(data);
       const newData = await newRestaurant.save();

       console.log(newData, "newdata");

       const userdata = {
         ...data,
         name:ownerName,
         role: "restaurant",
         restaurantId: newData._id,
       };

       const newUser = new User(userdata);
       await newUser.save();

       return res
         .status(200)
         .json({ message: "Restaurant is created", newRestaurant, newUser });
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
}


// All Restaurant get Api 
exports.allRestaurant = async (req, res) => {
  const user = req.user
  try {
   if(user.role==="admin" || user.role==="restaurant"){
     const result = await Restaurant.find();
     return res.status(200).send(result);
   }
   else{
    return res.status(200).send("You are not authorized to this");
   }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//Restaurant Login Api

exports.restaurantLogin = async (req, res) => {
 try {
     const { email, password } = req.body;
     const alreadyEmail = await Restaurant.findOne({ email });
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
       .json({ message: "Restaurant logged in ", user: alreadyEmail, token });
 } catch (error) {
     return res.status(500).json({ error: error.message });
 }
};
