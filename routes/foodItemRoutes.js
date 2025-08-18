const express = require("express")
const { addFood, allItems, updateFoodStatus, restItem, foodCategory, foodType, foodUpdate } = require("../controllers/foodItemController")
const auth = require("../middleware/auth");

const router = express.Router()

router.post("/add",auth,addFood)
router.get("/",allItems)
router.get("/rest-items/:id",auth,restItem)

router.put("/status-update", auth, updateFoodStatus);
router.get("/category",foodCategory)
router.get("/type",foodType)

router.put("/update-items/:id",auth,foodUpdate)

module.exports = router