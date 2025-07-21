const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000
const adminRoute = require("./routes/adminRoute")
const restRoute = require("./routes/restaurantRoute")
const delboy = require("./routes/deliveryBoyRoutes")
const usersRoute = require("./routes/userRoute")

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json())



app.use("/admin",adminRoute)
app.use("/rest",restRoute)
app.use("/delivery-boy",delboy)
app.use("/users",usersRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})