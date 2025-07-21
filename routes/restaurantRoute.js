const express = require("express")
const { createRestaurant, allRestaurant, restaurantLogin } = require("../controllers/restaurantController")
const auth = require("../middleware/auth");
const router = express.Router()

router.post("/create",createRestaurant)
router.get("/",auth,allRestaurant)
router.post("/login",restaurantLogin)

module.exports = router