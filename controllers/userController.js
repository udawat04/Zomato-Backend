const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
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

        const data = { name, email, password: hash, phone ,role:"user" };
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
     const result = await User.find();
     return res.status(200).send(result);
   }
   else if(user.role==="user"){
     const result = await User.findById({_id:user._id});
     return res.status(200).send(result);
   }
   else{
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

     return res
       .status(200)
       .json({ message: "User logged in ", user: alreadyEmail, token });
 } catch (error) {
     return res.status(500).json({ error: error.message });
 }
};