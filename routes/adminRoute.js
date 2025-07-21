const express = require("express")
const { createAdmin, allAdmin, adminLogin } = require("../controllers/adminController")
const auth = require("../middleware/auth");
const router = express.Router()

router.post("/create",createAdmin)
router.get("/",auth,allAdmin)
router.post("/login",adminLogin)

module.exports = router