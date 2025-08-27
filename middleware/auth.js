const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const secretkey = process.env.JWT_SECRET_KEY;

module.exports = async(req,res,next)=>{
    const bearerToken = req.headers.authorization;
    console.log(bearerToken,"bearetoken")
    console.log(
      "--------------------------bearerToken-----------------------------------------"
    );
      if (!bearerToken) {
        return res.status(400).send("no token provide");
      }

     const token = bearerToken.split(" ")[1]
     console.log(token,"token")
      console.log(
        "------------------------------Token-----------------------------------------"
      );

       const decode = jwt.verify(token, secretkey);
       if (!decode) {
         return res.status(400).send("invalid token");
       }

         console.log(decode.email, "User-Info");
          console.log(
            "--------------------------User Info-----------------------------------------"
          );
         const email = decode.email;
          const userDetail = await User.findOne({ email });

          if (!userDetail) {
            return res.status(400).send("user not found");
          }

          req.user = userDetail;

          next();
}