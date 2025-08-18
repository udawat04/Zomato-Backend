const express = require("express")
const { createDeliveryBoy, allDeliveryBoy, deliverBoyLogin, updateDb } = require("../controllers/deliveryBoyController")
const auth = require("../middleware/auth");
const { updateLocation } = require("../controllers/deliveryBoyLocationController");
const router = express.Router()

router.post("/create",createDeliveryBoy)
router.get("/",auth,allDeliveryBoy)
router.post("/login",deliverBoyLogin)
router.put("/db-update",auth,updateDb)
router.put("/update-location/:id", auth, updateLocation);

module.exports = router