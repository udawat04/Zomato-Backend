const express = require("express")
const auth = require("../middleware/auth")
const { createOrder } = require("../controllers/orderController")

const router = express.Router()

router.post("/",auth,createOrder)

module.exports = router