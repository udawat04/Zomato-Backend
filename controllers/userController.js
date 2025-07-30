const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../helper/cloudinary");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createUser = async(req,res)=>{
      try {
        console.log(req.body, ":::");
        const { name, email, password, phone } = req.body;
        const alreadyEmail = await User.findOne({ email });
        if (alreadyEmail) {
          return res.status(400).send("This Email Already Used");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const imageUpload = await uploadImage(req.files)
        // console.log(imageUpload[0].url);

        const data = { name, email, password: hash, phone ,role:"user",image:imageUpload[0].url };
        console.log(data,"asmksm")
        const newUser = new User(data);
       await newUser.save();

      

        return res
          .status(200)
          .json({ message: "User Sucessfully Registered 🎉", newUser });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}

// All Users get Api 
exports.allUsers = async (req, res) => {
  const user = req.user
  try {
   if(user.role==="admin"){
     const result = await User.find().populate("restaurantId");
     return res.status(200).send(result);
   }
if (user.role === "user") {
  const result = await User.aggregate([
    { $match: { _id: user._id } }, 
    {
      $lookup: {
        from: "user-addresses",
        localField: "_id",
        foreignField: "userId",
        as: "addresses",
      },
    },
  ]);
  return res.status(200).send(result[0]); 
} else {
  return res.status(400).send("You are not authorized to this");
}
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//User Login Api

exports.userLogin = async (req, res) => {
 try {
     const { email, password } = req.body;
     const alreadyEmail = await User.findOne({ email });
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

      const result = await User.aggregate([
        { $match: { _id: alreadyEmail._id } },
        {
          $lookup: {
            from: "user-addresses",
            localField: "_id",
            foreignField: "userId",
            as: "addresses",
          },
        },
      ]);

     return res
       .status(200)
       .json({ message: "User logged in ", user: result[0], token });
 } catch (error) {
     return res.status(500).json({ error: error.message });
 }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = req.user;

    // Find user
    const alreadyEmail = await User.findOne({ email: user.email });
    if (!alreadyEmail) {
      return res.status(400).send("Email not found");
    }

    let image;

    // Check if an image was uploaded
    if (req.files && Object.keys(req.files).length > 0) {
      const imageUpload = await uploadImage(req.files);
      image = imageUpload[0].url;
    }

    // Prepare update data
    const data = { name, phone };
    if (image) {
      data.image = image; // Only update image if new one uploaded
    }

    const id = user._id;

    const profileUpdate = await User.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });

    return res.status(200).send(profileUpdate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

  
