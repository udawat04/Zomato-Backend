const express = require("express")
const { addFood, allItems, updateFoodStatus, restItem } = require("../controllers/foodItemController")
const auth = require("../middleware/auth");

const router = express.Router()

router.post("/add",auth,addFood)
router.get("/",allItems)
router.get("/rest-items",auth,restItem)

router.put("/status-update", auth, updateFoodStatus);

module.exports = router