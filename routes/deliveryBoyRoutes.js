const express = require("express")
const { createDeliveryBoy, allDeliveryBoy, deliverBoyLogin } = require("../controllers/deliveryBoyController")
const auth = require("../middleware/auth");
const router = express.Router()

router.post("/create",createDeliveryBoy)
router.get("/",auth,allDeliveryBoy)
router.post("/login",deliverBoyLogin)


module.exports = router