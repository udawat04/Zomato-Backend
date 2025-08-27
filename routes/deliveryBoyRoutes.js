const express = require("express")
const { createDeliveryBoy, allDeliveryBoy, deliverBoyLogin, updateDb, nearbyDeliveryBoy, removealldb, removeRejectedDb } = require("../controllers/deliveryBoyController")
const auth = require("../middleware/auth");
const { updateLocation } = require("../controllers/deliveryBoyLocationController");

const router = express.Router()

router.post("/create",createDeliveryBoy)
router.get("/",auth,allDeliveryBoy)
router.get("/nearby-delivery-boy", auth,nearbyDeliveryBoy);
router.post("/login",deliverBoyLogin)
router.put("/db-update",auth,updateDb)
router.put("/update-location/:id", auth, updateLocation);

router.delete("/all-db-delete",auth,removealldb)
router.delete("/rejected-db-delete/:id",auth,removeRejectedDb)

module.exports = router