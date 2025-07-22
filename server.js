const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const fileupload = require("express-fileupload");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000
const adminRoute = require("./routes/adminRoute")
const restRoute = require("./routes/restaurantRoute")
const delboy = require("./routes/deliveryBoyRoutes")
const usersRoute = require("./routes/userRoute")
const foodItem = require("./routes/foodItemRoutes");


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json())
app.use(fileupload())
app.use(express.urlencoded())
app.use(cors());


app.use("/admin",adminRoute)
app.use("/rest",restRoute)
app.use("/delivery-boy",delboy)
app.use("/users",usersRoute)
app.use("/food-item",foodItem)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})