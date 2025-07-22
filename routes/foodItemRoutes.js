const express = require("express")
const { addFood } = require("../controllers/foodItemController")

const router = express.Router()

router.post("/add",addFood)

module.exports = router