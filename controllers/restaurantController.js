const { uploadImage } = require("../helper/cloudinary");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

exports.createRestaurant = async (req, res) => {
  try {
     console.log(req.body, ":::");
    //  console.log(req.files)
    const {
      restaurantName,
      ownerName,
      email,
      password,
      phone,
      street,
      city,
      state,
      zip,
      longitude,
      latitude,
      restaurantType,
      open,
      close,
    } = req.body;
    let openAt;
    let closeAt;
    if (open > "12:00") {
      let [hour, min] = open.split(":");
      hour = hour > 12 ? hour - 12 : hour;
      openAt = hour + ":" + min + " " + "PM";
      console.log(hour, min, "kk");
    } else if (open < "12:00") {
      openAt = open + " " + "AM";
      console.log(openAt, "ll");
    }

    if (close > "12:00") {
      let [hour, min] = close.split(":");
      hour = hour > 12 ? hour - 12 : hour;
      closeAt = hour + ":" + min + " " + "PM";

      console.log(hour, min);
    } else if (close < "12:00") {
      closeAt = close + " " + "AM";
      console.log(op);
    }

    console.log(openAt, "opennn");
    console.log(closeAt, "closeee");

    const alreadyEmail = await Restaurant.findOne({ email });
    if (alreadyEmail) {
      return res.status(400).send("This Email Already Used");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
  const images = [];
  if(req.files){
      const imageUpload = await uploadImage(req.files);
      console.log(imageUpload, "jdsjdks");
      
      imageUpload.forEach((item) => {
        images.push(item.url);
      });
  }

    const data = {
      restaurantName,
      ownerName,
      email,
      password: hash, // Assume you hashed the original password
      phone,
      address: { street: street, city: city, state: state, zip: zip },
      restaurantType,
      openingHours: { open: openAt, close: closeAt },
      status: "pending",
      image: images,
      location:{latitude,longitude}
    };

    //  console.log(data,"-----------------------")

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
      location:{latitude,longitude},
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
};

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

exports.updateRestaurant = async (req, res) => {
  const user = req.user;
    const {
      restaurantName,
      ownerName,
      email,
      password,
      phone,
      street,
      city,
      state,
      zip,
      restaurantType,
      open,
      close,
    } = req.body;
  // console.log("--------",req.body,"------")
  let openAt;
  let closeAt;

  if (open > "12:00") {
    let [hour, min] = open.split(":");
    hour = hour > 12 ? hour - 12 : hour;
    openAt = hour + ":" + min + " " + "PM";
  } else if (open < "12:00") {
    openAt = open + " " + "AM";
  }

  if (close > "12:00") {
    let [hour, min] = close.split(":");
    hour = hour > 12 ? hour - 12 : hour;
    closeAt = hour + ":" + min + " " + "PM";
  } else if (close < "12:00") {
    closeAt = close + " " + "AM";
  }

    const data = {
      restaurantName,
      ownerName,
      email,
      phone,
      address: { street: street, city: city, state: state, zip: zip },
      restaurantType,
      openingHours: { open: openAt, close: closeAt },
    };
  console.log("--------", data, "------");

  const result = await Restaurant.findByIdAndUpdate(
    { _id: user.restaurantId },
    data,
    { new: true }
  );
  await User.findByIdAndUpdate({_id:user._id},data,{new:true})
  return res.status(200).send(result);
};
