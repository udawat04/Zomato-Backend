const Admin  = require("../models/adminModel");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretkey = process.env.JWT_SECRET_KEY;

exports.createAdmin = async (req, res) => {
  try {
    console.log(req.body, ":::");
    const { name, email, password ,phone } = req.body;
    const alreadyEmail = await Admin.findOne({ email });
    if (alreadyEmail) {
      return res.status(400).send("Admin already created");
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password,salt)

    const data = { name, email, password:hash, phone};
    const newAdmin = new Admin(data);
    const newData = await newAdmin.save();

    console.log(newData, "newdata");

    const userdata = {...data,role:"admin",adminId:newData._id}

    const newUser = new User(userdata)
    await newUser.save()

    return res
      .status(200)
      .json({ message: "Admin is created", newAdmin,newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// All Admin Get API
exports.allAdmin = async (req, res) => {
  const user = req.user
  try {
    if(user.role==="admin"){
      const result = await Admin.find();
      return res.status(200).send(result);
    }
    else{
      return res.status(400).send("You are not authorized to access this");
    }
  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
};


//Admin Login Api

exports.adminLogin = async (req, res) => {
 try {
     const { email, password } = req.body;
     const alreadyEmail = await Admin.findOne({ email });
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
       .json({ message: "Admin logged in ", user: alreadyEmail, token });
 } catch (error) {
     return res.status(500).json({ error: error.message });
 }
};

exports.updateStatus = async (req, res) => {
  const {role} = req.user
  try {
if(role==="admin"){
      const { restaurantId, status } = req.body;
      // when we pass id in findbyidandupdate so that id is refer to _id directly we dont need to make key value pair
      const restaurantResult = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { status },
        { new: true }
      );

      const userResult = await User.findOneAndUpdate(
        { restaurantId: restaurantId },
        { status },
        { new: true }
      );

      if (!restaurantResult || !userResult) {
        return res.status(404).send({
          message: "Restaurant or User not found",
        });
      }

      return res.status(200).send({
        message: "Status updated successfully in both User and Restaurant",
        restaurant: restaurantResult,
        user: userResult,
      });
}
else{
  return res.status(400).send("You are not authorized to this")
}
  } catch (error) {
    return res.status(500).send({
      message: "Error updating status",
      error: error.message,
    });
  }
};

