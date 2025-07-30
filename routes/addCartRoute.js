const express = require("express")
const { addToCart, updateCart, deleteCart, allCartItem } = require("../controllers/cartController")
const auth = require("../middleware/auth");

const router = express.Router()

router.post("/",auth,addToCart)
router.get("/",auth,allCartItem)

router.put("/update-cart",updateCart)
router.delete("/remove",deleteCart)

module.exports = router