const { uploadImage } = require("../helper/cloudinary");
const  Restaurant = require("../models/restaurantModel")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createRestaurant = async(req,res)=>{
     try {
       console.log(req.body, ":::");
       console.log(req.files)
     const {
       restaurantName,
       ownerName,
       email,
       password,
       phone,
      street, 
      city, 
      state,
      zip ,
       restaurantType,
      open, 
      close,
     } = req.body;
    
       const alreadyEmail = await Restaurant.findOne({ email });
       if (alreadyEmail) {
         return res.status(400).send("This Email Already Used");
       }

       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);

    console.log(req.files)
    
       const imageUpload = await uploadImage(req.files)
       console.log(imageUpload,"jdsjdks")
       const images =[]
       imageUpload.forEach(item => {
        images.push(item.url)
       });

       console.log(images)
       const data = {
         restaurantName,
         ownerName,
         email,
         password: hash, // Assume you hashed the original password
         phone,
         address: { street, city, state, zip },
         restaurantType,
         openingHours: { open, close },
         status:"pending",
         image:images
       };
        
       

       const newRestaurant = new Restaurant(data);
       const newData = await newRestaurant.save();

       console.log(newData, "newdata");

       const userdata = {
         name: ownerName,
         role: "restaurant",
         restaurantId: newData._id,
         restaurantName,
         ownerName,
         email,
         password: hash, // Assume you hashed the original password
         phone,
         address: { street, city, state, zip },
         restaurantType,
         openingHours: { open, close },
         status: "pending",
         restImage: images,
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
 
  try {
   
     const result = await Restaurant.find();
     return res.status(200).send(result);
   
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
