const express = require("express")
const auth = require("../middleware/auth")
const { createOrder, restaurantOrders, updateOrderStatus, allOrders } = require("../controllers/orderController")


const router = express.Router()

router.post("/",auth,createOrder)

router.get("/all-order",auth,allOrders)

router.get("/rest-order",auth,restaurantOrders)

router.put("/update-order-status", auth, updateOrderStatus);

module.exports = router