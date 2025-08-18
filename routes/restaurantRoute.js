const express = require("express")
const { createRestaurant, allRestaurant, restaurantLogin, updateRestaurant } = require("../controllers/restaurantController")
const auth = require("../middleware/auth");
const router = express.Router()

router.post("/create",createRestaurant)
router.get("/",allRestaurant)
router.post("/login",restaurantLogin)
router.put("/update",auth,updateRestaurant)

module.exports = router