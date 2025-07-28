const express = require("express")
const { addFood, allItems } = require("../controllers/foodItemController")

const router = express.Router()

router.post("/add",addFood)
router.get("/",allItems)

module.exports = router