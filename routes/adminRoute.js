const express = require("express")
const { createAdmin, allAdmin, adminLogin, updateStatus } = require("../controllers/adminController")
const auth = require("../middleware/auth");
const router = express.Router()

router.post("/create",createAdmin)
router.get("/",auth,allAdmin)
router.post("/login",adminLogin)
router.put("/status-update",auth,updateStatus)

module.exports = router